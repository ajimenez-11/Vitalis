<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proveidor;
use Illuminate\Http\Request;

class ProveidorController extends Controller
{
    // LLISTAR PROVEÏDORS
    // GET /proveidors
    
    public function list()
    {
        return response()->json([
            'success' => true,
            'data' => Proveidor::orderBy('nom')->get(),
        ]);
    }

    // MOSTRAR UN PROVEÏDOR
    // GET /proveidors/{id}

    public function getProveidor($id)
    {
        $proveidor = Proveidor::find($id);

        if (!$proveidor) {
            return response()->json([
                'success' => false,
                'message' => 'Proveïdor no trobat',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $proveidor,
        ]);
    }

    // CREAR PROVEÏDOR
    // POST /proveidors

    public function new(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'nif' => 'nullable|string|max:20|unique:proveidors',
            'telefon' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'adreca' => 'nullable|string|max:500',
        ]);

        $proveidor = Proveidor::create($validated);

        return response()->json([
            'success' => true,
            'data' => $proveidor,
            'message' => 'Proveïdor creat correctament',
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
                'message' => 'Proveïdor no trobat',
            ], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'nif' => 'nullable|string|max:20|unique:proveidors,nif,' . $proveidor->id,
            'telefon' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'adreca' => 'nullable|string|max:500',
        ]);

        $proveidor->update($validated);

        return response()->json([
            'success' => true,
            'data' => $proveidor,
            'message' => 'Proveïdor actualitzat correctament',
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
                'message' => 'Proveïdor no trobat',
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

        return response()->json([
            'success' => true,
            'message' => 'Proveïdor eliminat correctament',
        ]);
    }
}