<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producte;
use App\Models\Lot;
use App\Models\MovimentStock;
use App\Models\ReceptaConsum;
use App\Models\Albaran;

class DashboardController extends Controller
{
    // DASHBOARD GENERAL
    // GET /dashboard
    public function list()
    {
        // PRODUCTES AMB STOCK BAIX
        $stock_baix = Producte::whereColumn('estoc_actual', '<', 'estoc_minim')->get();

        // LOTS QUE CADUCARAN AVIAT (7 dies)
        $$lots_proxims = Lot::whereBetween('data_caducitat', [now(), now()->addDays(7)])
            ->orderBy('data_caducitat', 'asc')
            ->with('liniaAlbaran.producte')
            ->get();

        // MOVIMENTS RECENTS
        $moviments_recents = MovimentStock::with('producte', 'lot', 'usuari')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // RECEPTES MÉS CONSUMIDES
        $receptes_mes_consumides = ReceptaConsum::selectRaw('recepta_id, SUM(porcions) as total')
            ->groupBy('recepta_id')
            ->orderByDesc('total')
            ->with('recepta')
            ->limit(5)
            ->get();

        // ALBARANS RECENTS
        $albarans_recents = Albaran::with('proveidor')
            ->orderBy('data', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stock_baix' => $stock_baix,
                'lots_proxims_caducitat' => $lots_proxims,
                'moviments_recents' => $moviments_recents,
                'receptes_mes_consumides' => $receptes_mes_consumides,
                'albarans_recents' => $albarans_recents
            ]
        ]);
    }
}
