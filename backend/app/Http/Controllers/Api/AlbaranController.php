<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Albaran;

class AlbaranController extends Controller
{
    function getAlbarans() { 
        return response()->json([
            'success' => true,
            'data' => Albaran::all()
        ], 200);
    }

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

    function createAlbaran (Request $request) {
        $albaran = Albaran::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $albaran,
            'message' => 'Albarán creado'
        ], 201);
    }

    function updateAlbaran (Request $request, $id) {
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

    function deleteAlbaran($id) { 
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

}
