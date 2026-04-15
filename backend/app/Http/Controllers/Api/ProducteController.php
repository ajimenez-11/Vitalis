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
        $producte = Producte::findOrFail($id);

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
        $producte = Producte::create($request->all());

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

        $producte->update($request->all());

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
