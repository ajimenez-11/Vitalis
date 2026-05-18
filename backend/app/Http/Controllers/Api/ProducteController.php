<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producte;
use Illuminate\Http\Request;

class ProducteController extends Controller
{
    // LLISTAR PRODUCTES
    // GET /productes
    
    public function list()
    {
        return response()->json([
            'success' => true,
            'data' => Producte::orderBy('nom')->get(),
        ]);
    }

    // MOSTRAR UN PRODUCTE
    // GET /productes/{id}

    public function getProducte($id)
    {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $producte,
        ]);
    }

    // CREAR PRODUCTE
    // POST /productes

    public function new(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'unitat_mesura' => 'required|string|max:50',
            'estoc_actual' => 'nullable|numeric|min:0',
            'estoc_minim' => 'nullable|numeric|min:0',
        ]);

        $producte = Producte::create($validated);

        return response()->json([
            'success' => true,
            'data' => $producte,
            'message' => 'Producte creat',
        ], 201);
    }

    // EDITAR PRODUCTE
    // PUT /productes/{id}

    public function edit(Request $request, $id)
    {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat',
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'unitat_mesura' => 'sometimes|required|string|max:50',
            'estoc_actual' => 'nullable|numeric|min:0',
            'estoc_minim' => 'nullable|numeric|min:0',
        ]);

        $producte->update($validated);

        return response()->json([
            'success' => true,
            'data' => $producte,
            'message' => 'Producte actualitzat correctament',
        ]);
    }

    // ELIMINAR PRODUCTE
    // DELETE /productes/{id}

    public function delete($id)
    {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat',
            ], 404);
        }

        try {
            $producte->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar el producte: té moviments o línies associades',
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Producte eliminat correctament',
        ]);
    }
}