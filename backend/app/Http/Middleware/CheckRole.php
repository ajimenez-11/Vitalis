<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$rols): Response
    {
        if (!in_array($request->user()->rol, $rols)) {
            return response()->json([
                'message' => 'Accés no autoritzat'
            ], 403);
        }
        return $next($request);
    }
}
