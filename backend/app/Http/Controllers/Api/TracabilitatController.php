<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lot;     
use App\Models\Producte;

class TracabilitatController extends Controller
{
    // TRAÇABILITAT PER LOT
    // GET /tracabilitat/lot/{numero}
    public function lot($numero) {
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
    public function producte($id) {
        $producte = Producte::with([
            'liniesAlbaran.lots.moviments.usuari',
            'liniesAlbaran.albaran.proveidor',
        ])->find($id);

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
