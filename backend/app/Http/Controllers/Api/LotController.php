<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;

class LotController extends Controller
{
        public function getLots()
    {
        return response()->json(Lot::all(), 200);
    }
 
    public function getLot($id)
    {
        $lot = Lot::findOrFail($id);
        return response()->json($lot, 200);
    }
 
    public function getLotsByProducte($producte_id)
    {
        $lots = Lot::where('producte_id', $producte_id)
            ->orderBy('data_caducitat', 'asc')
            ->get();
        return response()->json($lots, 200);
    }
 
    public function getLotsProximsCaducitat()
    {
        // Lots que caduquen en els propers 7 dies
        $lots = Lot::where('data_caducitat', '<=', now()->addDays(7))
            ->where('data_caducitat', '>=', now())
            ->orderBy('data_caducitat', 'asc')
            ->get();
        return response()->json($lots, 200);
    }
 
    public function createLot(Request $request)
    {
        $request->validate([
            'producte_id'    => 'required|exists:productes,id',
            'numero_lot'     => 'required|string|unique:lots,numero_lot',
            'data_caducitat' => 'required|date|after:today',
        ]);
 
        $lot = Lot::create($request->all());
 
        return response()->json([
            'message' => 'Lot creat correctament',
            'data'    => $lot
        ], 201);
    }
 
    public function updateLot(Request $request, $id)
    {
        $lot = Lot::findOrFail($id);
 
        if (isset($request->numero_lot))     $lot->numero_lot     = $request->numero_lot;
        if (isset($request->data_caducitat)) $lot->data_caducitat = $request->data_caducitat;
 
        $lot->save();
 
        return response()->json([
            'message' => 'Lot actualitzat correctament',
            'data'    => $lot
        ], 200);
    }
 
    public function deleteLot($id)
    {
        $lot = Lot::findOrFail($id);
        $lot->delete();
        return response()->json(['message' => 'Lot eliminat correctament'], 200);
    }
}
