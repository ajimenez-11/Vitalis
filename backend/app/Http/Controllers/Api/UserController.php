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
            'data' => User::all()
        ]);
    }

    // MOSTRAR UN USUARI
    // GET /usuaris/{id}
    public function getUsuari($id)
    {
        $usuari = User::find($id);

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
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role'     => 'required'
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $usuari = User::create($validated);

        return response()->json([
            'success' => true,
            'data' => $usuari,
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

        $usuari->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $usuari,
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

        $usuari->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuari eliminat correctament'
        ]);
    }

    // ACTIVAR / DESACTIVAR USUARI
    // POST /usuaris/{id}/toggle
    public function toggleActive($id)
    {
        $usuari = User::find($id);

        if (!$usuari) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no trobat'
            ], 404);
        }

        $usuari->active = !$usuari->active;
        $usuari->save();

        return response()->json([
            'success' => true,
            'message' => 'Estat d\'usuari actualitzat',
            'data' => $usuari
        ]);
    }
}
