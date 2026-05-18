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
            'data' => 'required|date',
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

        // no és possible editar un albarà confirmat
        if ($albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es pot editar un albaran confirmat'
            ], 400);
        }

        $validated = $request->validate([
            'proveidor_id' => 'sometimes|exists:proveidors,id',
            'data' => 'sometimes|date',
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

        // // no és possible eliminar un albarà confirmat 
        if ($albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar un albaran confirmat'
            ], 400);
        }

        try {
            $albaran->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar l\'albaran: ' . $e->getMessage(),
            ], 409);
        }
 
        return response()->json([
            'success' => true,
             'message' => 'Albaran eliminat'
        ]);
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

        foreach ($albaran->linies as $linia) {
            $totalLots = $linia->lots->sum('quantitat');

            if (abs($totalLots - $linia->quantitat) > 0.001) {
                return response()->json([
                    'success' => false,
                    'message' => 'La suma dels lots de la línia ' . $linia->id . ' no coincideix amb la quantitat de la línia'
                ], 400);
            }
        }

        // Procesar confirmació
        DB::transaction(function () use ($albaran) {
            foreach ($albaran->linies as $linia) {
                
                // Crear un moviment per cada lot per garantir la traçabilitat
                foreach ($linia->lots as $lot) {

                    MovimentStock::create([
                        'producte_id'  => $linia->producte_id,
                        'lot_id' => $lot->id,
                        'usuari_id' => auth()->id(),
                        'tipus' => 'entrada',
                        'quantitat' => $lot->quantitat,
                        'data' => now(),
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

    // TORNAR A ESBORRANY
    // POST /albarans/{id}/esborrany
    public function tornarEsborrany($id) {
        $albaran = Albaran::with('linies.producte')->find($id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albaran no trobat'
            ], 404);
        }

        if ($albaran->estat === 'esborrany') {
            return response()->json([
                'success' => false,
                'message' => 'L\'albaran ja és en esborrany'
            ], 400);
        }

        // Comprovar que hi ha estoc suficient per revertir
        foreach ($albaran->linies as $linia) {
            if ($linia->producte->estoc_actual < $linia->quantitat) {
                return response()->json([
                    'success' => false,
                    'message' => 'No es pot revertir: el producte "' . $linia->producte->nom
                        . '" no té estoc suficient per descomptar ('
                        . $linia->producte->estoc_actual . ' disponible, '
                        . $linia->quantitat . ' necessari)'
                ], 422);
            }
        }

        DB::transaction(function () use ($albaran) {
            foreach ($albaran->linies as $linia) {
                // Crear moviment d'ajust negatiu per revertir l'entrada
                MovimentStock::create([
                    'producte_id'  => $linia->producte_id,
                    'lot_id' => null,
                    'usuari_id' => auth()->id(),
                    'tipus' => 'ajust',
                    'quantitat' => -$linia->quantitat,
                    'data' => now(),
                    'observacions' => 'Reversió albaran #' . $albaran->id . ' a esborrany'
                ]);

                // Descomptar estoc
                $linia->producte->decrement('estoc_actual', $linia->quantitat);
            }

            $albaran->estat = 'esborrany';
            $albaran->save();
        });

        return response()->json([
            'success' => true,
            'message' => 'Albaran revertit a esborrany correctament',
            'data' => $albaran->load('linies.producte', 'linies.lots', 'proveidor')
        ]);
    }
}
