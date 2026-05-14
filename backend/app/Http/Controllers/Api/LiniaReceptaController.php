<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LiniaRecepta;
use App\Models\Recepta;
use Illuminate\Http\Request;

class LiniaReceptaController extends Controller
{
    // CREAR LÍNIA
    // POST /receptes/{recepta_id}/linies
    
    public function new(Request $request, $recepta_id)
    {
        $recepta = Recepta::find($recepta_id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada',
            ], 404);
        }

        $validated = $request->validate([
            'producte_id'          => 'required|exists:productes,id',
            'quantitat_per_porcio' => 'required|numeric|min:0.001',
            'temperatura_coccio'   => 'nullable|numeric',
        ]);

        $validated['recepta_id'] = $recepta_id;

        $linia = LiniaRecepta::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $linia->load('producte'),
            'message' => 'Línia creada correctament',
        ], 201);
    }

    // MOSTRAR UNA LÍNIA
    // GET /linies-recepta/{id}

    public function getLinia($id)
    {
        $linia = LiniaRecepta::with('producte')->find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $linia,
        ]);
    }

    // EDITAR LÍNIA
    // PUT /linies-recepta/{id}

    public function edit(Request $request, $id)
    {
        $linia = LiniaRecepta::find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        $validated = $request->validate([
            'producte_id'          => 'sometimes|exists:productes,id',
            'quantitat_per_porcio' => 'sometimes|numeric|min:0.001',
            'temperatura_coccio'   => 'nullable|numeric',
        ]);

        $linia->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $linia->load('producte'),
            'message' => 'Línia actualitzada correctament',
        ]);
    }

    // ELIMINAR LÍNIA
    // DELETE /linies-recepta/{id}

    public function delete($id)
    {
        $linia = LiniaRecepta::find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        try {
            $linia->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar la línia: ' . $e->getMessage(),
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Línia eliminada correctament',
        ]);
    }
}