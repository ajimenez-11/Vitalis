<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Proveidor;

class ProveidorController extends Controller
{

    // LLISTAR PROVEÏDORS
    // GET /proveidors
    public function list() {
        return response()->json([
            'success' => true,
            'data' => Proveidor::all()
        ], 200);
    }

    // MOSTRAR UN PROVEÏDOR
    // GET /proveidors/{id}
    public function getProveidor($id) {
        $proveidor = Proveidor::find($id);

        if (!$proveidor) {
            return response()->json([
                'success' => false,
                'message' => 'Proveïdor no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $proveidor
        ], 200);
    }

    // CREAR PROVEÏDOR
    // POST /proveidors
    public function new(Request $request) {
        $validated = $request->validate([
            'nom' => 'required',
            'nif' => 'nullable|unique:proveidors',
            'telefon' => 'nullable',
            'email' => 'nullable|email',
            'adreca' => 'nullable'
        ]);

        $proveidor = Proveidor::create($validated);

        return response()->json([
            'success' => true,
            'data' => $proveidor,
            'message' => 'Proveïdor creat correctament'
        ], 201);
    }

    // EDITAR PROVEÏDOR
    // PUT /proveidors/{id}
    public function edit(Request $request, $id)
    {
        $proveidor = Proveidor::find($id);

        if (!$proveidor) {
            return response()->json([
                'success' => false,
                'message' => 'Proveïdor no trobat'
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required',
            'nif' => 'nullable|unique:proveidors,nif,' . $proveidor->id,
            'telefon' => 'nullable',
            'email' => 'nullable|email',
            'adreca' => 'nullable'
        ]);

        $proveidor->update($validated);

        return response()->json([
            'success' => true,
            'data' => $proveidor,
            'message' => 'Proveïdor actualitzat correctament'
        ]);
    }

    // ELIMINAR PROVEÏDOR
    // DELETE /proveidors/{id}
    public function delete($id)
    {
        $proveidor = Proveidor::find($id);

        if (!$proveidor) {
            return response()->json([
                'success' => false,
                'message' => 'Proveïdor no trobat'
            ], 404);
        }

        try {
            $proveidor->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar el proveïdor: té albarans associats',
            ], 409);
        }
 
        return response()->json(['success' => true, 'message' => 'Proveïdor eliminat correctament']);
    }

}
