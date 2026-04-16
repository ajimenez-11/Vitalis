<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Albaran;
use App\Models\MovimentStock;


class AlbaranController extends Controller
{
    // LLISTAR ALBARAN  
    // GET /albarans

    function list() { 
        
        $albarans = Albaran::with('proveidor', 'usuari')
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $albarans
        ]);
    }

    // MOSTRAR UN ALBARAN
    // GET /albarans/{id}

    function getAlbaran($id) { 
        $albaran = Albaran::with('proveidor', 'usuari', 'linies.producte', 'linies.lots')->find($id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albaran no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $albaran
        ]);
    }

    // CREAR ALBARÁN
    // POST /albarans

    function new(Request $request) {
        $validated = $request->validate([
            'proveidor_id' => 'required|exists:proveidors,id',
            'data'         => 'required|date',
            'observacions' => 'nullable|string'
        ]);

        $validated['estat'] = 'esborrany';
        $validated['usuari_id'] = auth()->id();

        $albaran = Albaran::create($validated);

        return response()->json([
            'success' => true,
            'data' => $albaran->load('proveidor', 'usuari'),
            'message' => 'Albaran creat'
        ], 201);
    }

    // EDITAR ALBARAN
    // PUT /albarans/{id}
    function edit(Request $request, $id) {        
        $albaran = Albaran::find($id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albaran no trobat'
            ], 404);
        }

        // no es posible editar albaran confirmado
        if ($albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es pot editar un albaran confirmat'
            ], 400);
        }

        $validated = $request->validate([
            'proveidor_id' => 'sometimes|exists:proveidors,id',
            'data'         => 'sometimes|date',
            'observacions' => 'nullable|string'
        ]);

        $albaran->update($validated);

        return response()->json([
            'success' => true,
            'data' => $albaran->load('proveidor', 'usuari'),
            'message' => 'Albaran actualitzat correctament'
        ]);
    }

    // ELIMINAR ALBARAN
    // DELETE /albarans/{id}
    function delete($id) { 
        $albaran = Albaran::find($id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albaran no trobat'
            ], 404);
        }

        // no se puede eliminar un albaran confirmado
        if ($albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar un albaran confirmat'
            ], 400);
        }

        $albaran->delete();

        return response()->json([
            'success' => true,
            'message' => 'Albaran eliminat'
        ], 200);
    }

    // CONFIRMAR ALBARAN
    // POST /albaran/{id}/confirmar
    public function confirmar($id) {
        $albaran = Albaran::with('linies.lots', 'linies.producte')->find($id);

    if (!$albaran) {
        return response()->json([
            'success' => false,
            'message' => 'Albaran no trobat'
        ], 404);
    }

    // Revisar si esta confirmat
    if ($albaran->estat === 'confirmat') {
        return response()->json([
            'success' => false,
            'message' => 'El albaran ja està confirmat'
        ], 400);
    }

    // Validar que contingui linies
    if ($albaran->linies->count() === 0) {
        return response()->json([
            'success' => false,
            'message' => 'L\' albaran no te linies, no es pot confirmar'
        ], 400);
    }

    // Validar que cada linia tengui lots
    foreach ($albaran->linies as $linia) {
        if ($linia->lots->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'La línea '.$linia->id.' no te lots assignats'
            ], 400);
        }
    }

    // Procesar confirmació
    DB::transaction(function () use ($albaran) {
        foreach ($albaran->linies as $linia) {
            foreach ($linia->lots as $lot) {
                // FIX: afegit 'data' => now() explícit
                MovimentStock::create([
                    'producte_id'  => $linia->producte_id,
                    'lot_id'       => $lot->id,
                    'usuari_id'    => auth()->id(),
                    'tipus'        => 'entrada',
                    'quantitat'    => $linia->quantitat,
                    'data'         => now(),
                    'observacions' => 'Entrada per albaran #' . $albaran->id
                ]);
            }

            // Actualitzar estoc del producte
            $linia->producte->increment('estoc_actual', $linia->quantitat);
        }

        $albaran->estat = 'confirmat';
        $albaran->save();
    });

    return response()->json([
        'success' => true,
        'message' => 'Albaran confirmat correctamente',
        'data' => $albaran->load('linies.producte', 'linies.lots', 'proveidor')
    ]);
    }
}
