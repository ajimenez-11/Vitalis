<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producte;

class ProducteController extends Controller
{
    function getProductes() { 
        return response()->json([
            'success' => true,
            'data' => Producte::all()
        ], 200);
    }
    

    function getProducte($id) { 
        $producte = Producte::findOrFail($id);

        if (!$producte){
            return response()->json([
                'success' => false,
                'message' => 'Producte no encontrado'
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => $producte
        ], 200);
    }

    function createProducte (Request $request) {
        $producte = Producte::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $producte,
            'message' => 'Producto creado'
        ], 201);
    }

    function updateProducte (Request $request, $id) {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $producte->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $producte,
            'message' => 'Producto actualizado'
        ], 200);
    }

    function deleteProducte($id) { 
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $producte->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado'
        ], 200);
    }
}
