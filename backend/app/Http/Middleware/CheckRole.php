<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->rol !== $role) {
            return response()->json([
                'message' => 'No tens permisos per accedir aqui'
            ], 403);
        }
        return $next($request);
    }
}
