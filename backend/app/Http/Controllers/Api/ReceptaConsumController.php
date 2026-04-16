<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReceptaConsumController extends Controller
{
    // REGISTRAR CONSUM
    // POST /receptes/{id}/consum
    public function new(Request $request, $id)
    {
        $validated = $request->validate([
            'quantitat' => 'required|numeric|min:0.001',
            'observacions' => 'nullable|string'
        ]);

        $validated['recepta_id'] = $id;

        $consum = ReceptaConsum::create($validated);

        return response()->json([
            'success' => true,
            'data' => $consum,
            'message' => 'Consum registrat correctament'
        ], 201);
    }

    // LLISTAR CONSUMS D’UNA RECEPTA
    // GET /receptes/{id}/consums
    public function listByRecepta($id)
    {
        $consums = ReceptaConsum::where('recepta_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $consums
        ]);
    }

    // MOSTRAR UN CONSUM
    // GET /consums/{id}
    public function getConsum($id)
    {
        $consum = ReceptaConsum::find($id);

        if (!$consum) {
            return response()->json([
                'success' => false,
                'message' => 'Consum no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $consum
        ]);
    }
}
