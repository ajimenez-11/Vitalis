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
                'success' => false,
                'message' => 'Credencials incorrectes',
            ], 401);
        }

        if (!$user->actiu) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari desactivat',
            ], 403);
        }

        $token = $user->createToken('vitalis-' . $user->rol)->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'nom'   => $user->nom,
                'email' => $user->email,
                'rol'   => $user->rol,
            ],
        ]);
    }

    // POST /api/logout

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sessió tancada correctament',
        ]);
    }

    // GET /api/me

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'    => $user->id,
                'nom'   => $user->nom,
                'email' => $user->email,
                'rol'   => $user->rol,
            ],
        ]);
    }
}