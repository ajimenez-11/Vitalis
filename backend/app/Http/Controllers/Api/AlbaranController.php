<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Albaran;
use App\Models\MovimentStock;


class AlbaranController extends Controller
{
    // LLISTAR ALBARAN  
    // GET /albarans

    function list() { 
        
        $albarans = Albaran::all();

        return response()->json([
            'success' => true,
            'data' => $albarans
        ]);
    }

    // MOSTRAR UN ALBARAN
    // GET /albarans/{id}

    function getAlbaran($id) { 
        $albaran = Albaran::find($id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albarán no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $albaran
        ], 200);
    }

    // CREAR ALBARÁN
    // POST /albarans

    function new(Request $request) {
        $albaran = Albaran::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $albaran,
            'message' => 'Albarán creado'
        ], 201);
    }

    // EDITAR ALBARAN
    // PUT /albarans/{id}
    function edit(Request $request, $id) {        
        $albaran = Albaran::find($id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albarán no encontrado'
            ], 404);
        }

        $albaran->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $albaran,
            'message' => 'Albarán actualizado'
        ], 200);
    }

    // ELIMINAR ALBARAN
    // DELETE /albarans/{id}
    function delete($id) { 
        $albaran = Albaran::find($id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albarán no encontrado'
            ], 404);
        }

        $albaran->delete();

        return response()->json([
            'success' => true,
            'message' => 'Albarán eliminado'
        ], 200);
    }

    // CONFIRMAR ALBARAN
    // POST /albaran/{id}/confirmar
    public function confirmar($id) {
        $albaran = Albaran::with('linies.lots', 'linies.producte')->find($id);

    if (!$albaran) {
        return response()->json([
            'success' => false,
            'message' => 'Albarán no encontrado'
        ], 404);
    }

    // Revisar si esta confirmat
    if ($albaran->estat === 'confirmat') {
        return response()->json([
            'success' => false,
            'message' => 'El albarán ya está confirmado'
        ], 400);
    }

    // Validar que contingui linies
    if ($albaran->linies->count() === 0) {
        return response()->json([
            'success' => false,
            'message' => 'El albarán no tiene líneas, no se puede confirmar'
        ], 400);
    }

    // Validar que cada linia tengui lots
    foreach ($albaran->linies as $linia) {
        if ($linia->lots->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'La línea '.$linia->id.' no tiene lotes asignados'
            ], 400);
        }
    }

    // Procesar confirmació
    foreach ($albaran->linies as $linia) {
        foreach ($linia->lots as $lot) {

            // Crear movimient stock
            MovimentStock::create([
                'producte_id' => $linia->producte_id,
                'lot_id' => $lot->id,
                'usuari_id' => auth()->id(),
                'tipus' => 'entrada',
                'quantitat' => $linia->quantitat,
                'data' => now(),
                'observacions' => 'Entrada por albarán '.$albaran->id
            ]);

            // Actualitzar stock del producte
            $linia->producte->increment('estoc_actual', $linia->quantitat);
        }
    }

    // Cambiar estado del albarán
    $albaran->estat = 'confirmat';
    $albaran->save();

    return response()->json([
        'success' => true,
        'message' => 'Albarán confirmado correctamente',
        'data' => $albaran
    ]);
    }
}
