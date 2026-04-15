<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Recepta;

class ReceptaController extends Controller
{
    // LLISTAR RECEPTES
    // GET /receptes
    public function list()
    {
        return response()->json([
            'success' => true,
            'data' => Recepta::all()
        ]);
    }

    // MOSTRAR UNA RECEPTA
    // GET /receptes/{id}
    public function getRecepta($id)
    {
        $recepta = Recepta::with('linies.producte')->find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $recepta
        ]);
    }

    // CREAR RECEPTA
    // POST /receptes
    public function new(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required',
            'descripcio' => 'nullable'
        ]);

        $recepta = Recepta::create($validated);

        return response()->json([
            'success' => true,
            'data' => $recepta,
            'message' => 'Recepta creada correctament'
        ], 201);
    }

    // EDITAR RECEPTA
    // PUT /receptes/{id}
    public function edit(Request $request, $id)
    {
        $recepta = Recepta::find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }

        $recepta->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $recepta,
            'message' => 'Recepta actualitzada correctament'
        ]);
    }

    // ELIMINAR RECEPTA
    // DELETE /receptes/{id}
    public function delete($id)
    {
        $recepta = Recepta::find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }

        $recepta->delete();

        return response()->json([
            'success' => true,
            'message' => 'Recepta eliminada correctament'
        ]);
    }
}
