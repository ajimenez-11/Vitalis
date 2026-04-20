<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
     // LLISTAR USUARIS
    // GET /usuaris
    public function list()
    {
        return response()->json([
            'success' => true,
            'data' => User::select('id', 'nom', 'email', 'rol', 'actiu', 'created_at')
                ->orderBy('nom')
                ->get()
        ]);
    }

    // MOSTRAR UN USUARI
    // GET /usuaris/{id}
    public function getUsuari($id)
    {
        $usuari = User::select('id', 'nom', 'email', 'rol', 'actiu', 'created_at')->find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $usuari
        ]);
    }

    // CREAR USUARI
    // POST /usuaris
    public function new(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'rol' => 'required|in:admin,responsable_cuina,cuiner'
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['actiu'] = true;

        $usuari = User::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $usuari->only(['id', 'nom', 'email', 'rol', 'actiu']),
            'message' => 'Usuari creat correctament'
        ], 201);
    }

    // EDITAR USUARI
    // PUT /usuaris/{id}
    public function edit(Request $request, $id)
    {
        $usuari = User::find($id);
        
        if (!$usuari) {
            return response()->json([
                'success' => false, 
                'message' => 'Usuari no trobat'
            ], 404);
        }

        $validated = $request->validate([
            'nom'      => 'sometimes|required|string|max:255',
            'email'    => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|min:6',
            'rol'      => 'sometimes|required|in:admin,responsable_cuina,cuiner',
            'actiu'    => 'sometimes|boolean',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $usuari->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $usuari->only(['id', 'nom', 'email', 'rol', 'actiu']),
            'message' => 'Usuari actualitzat correctament'
        ]);
    }

    // ELIMINAR USUARI
    // DELETE /usuaris/{id}
    public function delete($id)
    {
        $usuari = User::find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], 404);
        }

        // Evitar que l'admin s'esborri a si mateix
        if ($usuari->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No et pots eliminar a tu mateix'
            ], 400);
        }

        try {
            $usuari->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar l\'usuari: té registres associats',
            ], 409);
        }
 
        return response()->json([
            'success' => true,
            'message' => 'Usuari eliminat correctament'
        ]);
    }

    // ACTIVAR / DESACTIVAR USUARI
    // POST /usuaris/{id}/toggle
    public function toggleActive($id) {
        $usuari = User::find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], 404);
        }

        if ($usuari->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No et pots desactivar a tu mateix'
            ], 400);
        }

        $usuari->actiu = !$usuari->actiu;
        $usuari->save();

        return response()->json([
            'success' => true,
            'message' => 'Estat d\'usuari actualitzat',
            'data'    => $usuari->only(['id', 'nom', 'email', 'rol', 'actiu'])
        ]);
    }
}
