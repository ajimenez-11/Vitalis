<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;

class LotController extends Controller
{
    // LLISTAR LOTS
    // GET /lots
    public function list() {
        return response()->json([
            'success' => true,
            'data' => Lot::with('liniaAlbaran.producte')->get()
        ]);    
    }
 
    // MOSTRAR UN LOT
    // GET /lots/{id}
    public function getLot($id) {
        $lot = Lot::with('liniaAlbaran.producte')->find($id);
        if (!$lot) {
            return response()->json([
                'success' => false,
                'message' => 'Lot no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $lot
        ]);
    }
 
    // BUSCAR LOT PER NÚMERO
    // GET /lots/numero/{numero}
    public function findByNumero($numero)
    {
        $lot = Lot::where('numero_lot', $numero)
                  ->with('liniaAlbaran.producte')
                  ->first();

        if (!$lot) {
            return response()->json([
                'success' => false,
                'message' => 'No s\'ha trobat cap lot amb aquest número'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $lot
        ]);
    }

    // LOTS D’UN PRODUCTE
    // GET /lots/producte/{id}
    public function getLotsByProducte($producte_id) {
        $lots = Lot::where('producte_id', $producte_id)
            ->orderBy('data_caducitat', 'asc')
            ->get();
            return response()->json([
                'success' => true,
                'data' => $lots
            ]);
        }
 
     // LOTS QUE CADUCARAN AVIAT
    // GET /lots/proxims-caducitat
    public function getLotsProximsCaducitat() {
        // Lots que caduquen en els propers 7 dies
        $lots = Lot::where('data_caducitat', '<=', now()->addDays(7))
            ->where('data_caducitat', '>=', now())
            ->orderBy('data_caducitat', 'asc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $lots
        ]);
    }
 
}
