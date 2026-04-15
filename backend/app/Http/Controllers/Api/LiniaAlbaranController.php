<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LiniaAlbaran;

class LiniaAlbaranController extends Controller
{
    // LLISTAR LÍNIES D’UN ALBARÀ
    // GET /albarans/{albaran_id}/linies
    public function listByAlbaran($albaran_id) {
        return response()->json([
            'success' => true,
            'data' => LiniaAlbaran::where('albaran_id', $albaran_id)->get()
        ]);
    }

    // MOSTRAR UNA LÍNIA
    // GET /linies-albaran/{id}
    public function getLinia($id) {
        $linia = LiniaAlbaran::find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $linia
        ]);
    }

    // CREAR LÍNIA
    // POST /albarans/{albaran_id}/linies
    public function new(Request $request, $albaran_id) {
        $validated = $request->validate([
            'producte_id' => 'required|exists:productes,id',
            'quantitat'   => 'required|numeric|min:0.001',
            'preu_unitari'=> 'nullable|numeric|min:0'
        ]);

        $validated['albaran_id'] = $albaran_id;

        $linia = LiniaAlbaran::create($validated);

        return response()->json([
            'success' => true,
            'data' => $linia,
            'message' => 'Línia creada correctament'
        ], 201);
    }


    // EDITAR LÍNIA
    // PUT /linies-albaran/{id}
    public function edit(Request $request, $id) {
        $linia = LiniaAlbaran::find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada'
            ], 404);
        }

        $linia->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $linia,
            'message' => 'Línia actualitzada correctament'
        ]);
    }

    // ELIMINAR LÍNIA
    // DELETE /linies-albaran/{id}
    public function delete($id) {
        $linia = LiniaAlbaran::find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada'
            ], 404);
        }

        $linia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Línia eliminada correctament'
        ]);
    }
}
