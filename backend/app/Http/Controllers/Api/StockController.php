<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Producte;
use App\Models\MovimentStock;

class StockController extends Controller
{
    // LLISTAR STOCK GENERAL
    // GET /stock
    public function list()
    {
        $productes = Producte::with('lots')->get();

        return response()->json([
            'success' => true,
            'data' => $productes
        ]);
    }

    // STOCK DE PRODUCTE
    // GET /stock/producte/{id}
    public function getProducteStock($id)
    {
        $producte = Producte::with('lots')->find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $producte
        ]);
    }

    // LLISTAR MOVIMENTS
    // GET /stock/moviments
    public function listMoviments()
    {
        return response()->json([
            'success' => true,
            'data' => MovimentStock::with('producte', 'lot')->orderBy('created_at', 'desc')->get()
        ]);
    }

    // MOVIMENTS D’UN PRODUCTE
    // GET /stock/producte/{id}/moviments
    public function listMovimentsProducte($id)
    {
        $moviments = MovimentStock::where('producte_id', $id)
            ->with('producte', 'lot')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $moviments
        ]);
    }

    // AJUST DE STOCK
    // POST /stock/ajust
    public function ajust(Request $request)
    {
        $validated = $request->validate([
            'producte_id' => 'required|exists:productes,id',
            'quantitat'   => 'required|numeric|not_in:0',
            'motiu'       => 'nullable|string'
        ]);

        $producte = Producte::find($validated['producte_id']);

        DB::transaction(function () use ($validated, $producte) {
            MovimentStock::create([
                'producte_id'  => $validated['producte_id'],
                'lot_id'       => null,
                'usuari_id'    => auth()->id(),
                'tipus'        => 'ajust',
                'quantitat'    => $validated['quantitat'],
                'data'         => now(),  // FIX: afegit data
                'observacions' => $validated['motiu'] ?? 'Ajust manual'
            ]);
 
            // augmenta o redueix stock en funcio de si quantitat es negatiu o positiu
            // facilita ajust stock
            $producte->increment('estoc_actual', $validated['quantitat']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Ajust realitzat correctament',
            'data'    => $producte->fresh()
        ]);
    }

    // SORTIDA DE STOCK
    // POST /stock/sortida
    public function sortida(Request $request)
    {
        $validated = $request->validate([
            'producte_id' => 'required|exists:productes,id',
            'quantitat'   => 'required|numeric|min:0.001',
            'motiu'       => 'nullable|string'
        ]);
        
        $producte = Producte::find($validated['producte_id']);

        // verificar si hi ha stock suficient
        if ($producte->estoc_actual < $validated['quantitat']) {
            return response()->json([
                'success' => false,
                'message' => 'Estoc insuficient. Estoc actual: ' . $producte->estoc_actual . ' ' . $producte->unitat_mesura
            ], 422);
        }

        DB::transaction(function () use ($validated, $producte) {
            MovimentStock::create([
                'producte_id'  => $validated['producte_id'],
                'lot_id'       => null,
                'usuari_id'    => auth()->id(),
                'tipus'        => 'sortida',
                'quantitat'    => $validated['quantitat'],
                'data'         => now(), 
                'observacions' => $validated['motiu'] ?? 'Sortida manual'
            ]);
 
            $producte->decrement('estoc_actual', $validated['quantitat']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Sortida registrada correctament',
            'data' => $producte->fresh()
        ]);
    }
}
