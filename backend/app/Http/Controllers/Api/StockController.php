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
        $productes = Producte::select('id', 'nom', 'unitat_mesura', 'estoc_actual', 'estoc_minim')
            ->orderBy('nom')
            ->get()
            ->map(function ($p) {
                $p->baix_minim = $p->estoc_actual < $p->estoc_minim;
                return $p;
            });

        return response()->json([
            'success' => true,
            'data'    => $productes
        ]);
    }

    // STOCK D'UN PRODUCTE
    // GET /stock/producte/{id}
    public function getProducteStock($id)
    {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id' => $producte->id,
                'nom' => $producte->nom,
                'unitat_mesura' => $producte->unitat_mesura,
                'estoc_actual' => $producte->estoc_actual,
                'estoc_minim' => $producte->estoc_minim,
                'baix_minim' => $producte->estoc_actual < $producte->estoc_minim,
            ]
        ]);
    }

    // LLISTAR MOVIMENTS
    // GET /stock/moviments
    public function listMoviments()
    {
        $moviments = MovimentStock::with('producte', 'lot', 'usuari')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $moviments
        ]);
    }

    // MOVIMENTS D'UN PRODUCTE
    // GET /stock/producte/{id}/moviments
    public function listMovimentsProducte($id)
    {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat'
            ], 404);
        }

        $moviments = MovimentStock::where('producte_id', $id)
            ->with('producte', 'lot', 'usuari')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $moviments
        ]);
    }

    // AJUST D'ESTOC
    // POST /stock/ajust
    public function ajust(Request $request)
    {
        $validated = $request->validate([
            'producte_id' => 'required|exists:productes,id',
            'quantitat'   => 'required|numeric|not_in:0',
            'motiu'       => 'nullable|string'
        ]);

        $producte = Producte::find($validated['producte_id']);

        // Si la quantitat és negativa, comprovar que hi ha prou estoc
        if ($validated['quantitat'] < 0 && $producte->estoc_actual < abs($validated['quantitat'])) {
            return response()->json([
                'success' => false,
                'message' => 'Estoc insuficient per a l\'ajust negatiu. Estoc actual: '
                    . $producte->estoc_actual . ' ' . $producte->unitat_mesura
            ], 422);
        }

        DB::transaction(function () use ($validated, $producte) {
            MovimentStock::create([
                'producte_id' => $validated['producte_id'],
                'lot_id' => null,
                'usuari_id' => auth()->id(),
                'tipus' => 'ajust',
                'quantitat' => $validated['quantitat'],
                'data' => now(),
                'observacions' => $validated['motiu'] ?? 'Ajust manual'
            ]);

            $producte->increment('estoc_actual', $validated['quantitat']);
        });

        return response()->json([
            'success' => true,
            'message'=> 'Ajust realitzat correctament',
            'data' => $producte->fresh()
        ]);
    }

    // SORTIDA D'ESTOC
    // POST /stock/sortida
    public function sortida(Request $request)
    {
        $validated = $request->validate([
            'producte_id' => 'required|exists:productes,id',
            'quantitat' => 'required|numeric|min:0.001',
            'motiu' => 'nullable|string'
        ]);

        $producte = Producte::find($validated['producte_id']);

        if ($producte->estoc_actual < $validated['quantitat']) {
            return response()->json([
                'success' => false,
                'message' => 'Estoc insuficient. Estoc actual: '
                    . $producte->estoc_actual . ' ' . $producte->unitat_mesura
            ], 422);
        }

        DB::transaction(function () use ($validated, $producte) {
            MovimentStock::create([
                'producte_id' => $validated['producte_id'],
                'lot_id' => null,
                'usuari_id' => auth()->id(),
                'tipus' => 'sortida',
                'quantitat' => $validated['quantitat'],
                'data' => now(),
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