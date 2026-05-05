<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/login
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Credencials incorrectes'
            ], 401);
        }

        if (!$user->actiu) {
            return response()->json([
                'message' => 'Usuari desactivat'
            ], 403);
        }

        $token = $user->createToken('vitalis-' . $user->rol)->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'nom'   => $user->nom,
                'email' => $user->email,
                'rol'   => $user->rol,
            ]
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sessió tancada correctament'
        ]);
    }

    // GET /api/me
    public function me(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'id'    => $user->id,
            'nom'   => $user->nom,
            'email' => $user->email,
            'rol'   => $user->rol,
        ]);
    }
}
