<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
            'quantitat'   => 'required|numeric',
            'motiu'       => 'nullable|string'
        ]);

        $mov = MovimentStock::create([
            'producte_id' => $validated['producte_id'],
            'lot_id'      => null,
            'usuari_id'   => auth()->id(),
            'tipus'       => 'ajust',
            'quantitat'   => $validated['quantitat'],
            'observacions'=> $validated['motiu'] ?? 'Ajust manual'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ajust realitzat correctament',
            'data' => $mov
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

        $mov = MovimentStock::create([
            'producte_id' => $validated['producte_id'],
            'lot_id'      => null,
            'usuari_id'   => auth()->id(),
            'tipus'       => 'sortida',
            'quantitat'   => $validated['quantitat'],
            'observacions'=> $validated['motiu'] ?? 'Sortida manual'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sortida registrada correctament',
            'data' => $mov
        ]);
    }
}
