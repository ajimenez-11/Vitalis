<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TracabilitatController extends Controller
{
    // TRAÇABILITAT PER LOT
    // GET /tracabilitat/lot/{numero}
    public function tracabilitatLot($numero) {
        $lot = Lot::where('numero_lot', $numero)
            ->with([
                'liniaAlbaran.albaran.proveidor',
                'liniaAlbaran.producte',
                'moviments.producte',
                'moviments.usuari'
            ])
            ->first();

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

    // TRAÇABILITAT PER PRODUCTE
    // GET /tracabilitat/producte/{id}
    public function tracabilitatProducte($id) {
        $producte = Producte::with([
                'lots.liniaAlbaran.albaran.proveidor',
                'lots.moviments.usuari'
            ])
            ->find($id);

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
}
