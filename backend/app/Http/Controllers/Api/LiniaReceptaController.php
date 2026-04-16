<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LiniaRecepta;

class LiniaReceptaController extends Controller
{
    // CREAR LÍNIA
    // POST /receptes/{recepta_id}/linies
    public function new(Request $request, $recepta_id) {
        $validated = $request->validate([
            'producte_id' => 'required|exists:productes,id',
            'quantitat_per_porcio' => 'required|numeric|min:0.001',
            'temperatura_coccio' => 'nullable|numeric'
        ]);

        $validated['recepta_id'] = $recepta_id;

        $linia = LiniaRecepta::create($validated);

        return response()->json([
            'success' => true,
            'data' => $linia,
            'message' => 'Línia creada correctament'
        ], 201);
    }

    // MOSTRAR UNA LÍNIA
    // GET /linies-recepta/{id}
    public function getLinia($id) {
        $linia = LiniaRecepta::with('producte')->find($id);

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

    // EDITAR LÍNIA
    // PUT /linies-recepta/{id}
    public function edit(Request $request, $id) {
        $linia = LiniaRecepta::find($id);

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
    // DELETE /linies-recepta/{id}
    public function delete($id) {
        $linia = LiniaRecepta::find($id);

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
