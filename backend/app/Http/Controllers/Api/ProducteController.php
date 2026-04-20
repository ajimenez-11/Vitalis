<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producte;

class ProducteController extends Controller
{
    
    // LLISTAR PRODUCTES
    // GET /productes
    function list(){ 
        return response()->json([
            'success' => true,
            'data' => Producte::all()
        ], 200);
    }
    
    // MOSTRAR UN PRODUCTE
    // GET /productes/{id}
    function getProducte($id) { 
        $producte = Producte::find($id);  

        if (!$producte){
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $producte
        ], 200);
    }

    // CREAR PRODUCTE
    // POST /productes
    function new(Request $request) {
        
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
            'message' => 'Producte creat'
        ], 201);
    }

    // EDITAR PRODUCTE
    // PUT /productes/{id}
    function edit(Request $request, $id) {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat'
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'unitat_mesura' => 'required|string|max:50',
            'estoc_actual' => 'nullable|numeric|min:0',
            'estoc_minim' => 'nullable|numeric|min:0',
        ]);

        $producte->update($validated);

        return response()->json([
            'success' => true,
            'data' => $producte,
            'message' => 'Producte actualitzat correctament'
        ], 200);
    }

    // ELIMINAR PRODUCTE
    // DELETE /productes/{id}
    function delete($id) { 
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat'
            ], 404);
        }

        $producte->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producte eliminat correctament'
        ], 200);
    }
}
