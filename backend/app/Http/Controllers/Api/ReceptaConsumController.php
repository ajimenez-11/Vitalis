<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Recepta;
use App\Models\ReceptaConsum;
use App\Models\MovimentStock;
use App\Models\Lot;

class ReceptaConsumController extends Controller
{
    // REGISTRAR CONSUM
    // POST /receptes/{id}/consum
    public function new(Request $request, $id)
    {
        $validated = $request->validate([
            'porcions'     => 'required|integer|min:1',
            'observacions' => 'nullable|string'
        ]);

        $recepta = Recepta::with('linies.producte')->find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }

        if ($recepta->linies->count() === 0) {
            return response()->json([
                'success' => false,
                'message' => 'La recepta no té ingredients definits'
            ], 400);
        }

        $porcions  = $validated['porcions'];
        $mancances = [];

        foreach ($recepta->linies as $linia) {
            $quantitatNecessaria = $linia->quantitat_per_porcio * $porcions;

            if ($linia->producte->estoc_actual < $quantitatNecessaria) {
                $mancances[] = [
                    'producte'             => $linia->producte->nom,
                    'estoc_actual'         => $linia->producte->estoc_actual,
                    'quantitat_necessaria' => $quantitatNecessaria,
                    'unitat_mesura'        => $linia->producte->unitat_mesura,
                ];
            }
        }

        if (!empty($mancances)) {
            return response()->json([
                'success'   => false,
                'message'   => 'Estoc insuficient per registrar el consum',
                'mancances' => $mancances
            ], 422);
        }

        $consum = DB::transaction(function () use ($recepta, $porcions, $validated) {
            $consum = ReceptaConsum::create([
                'recepta_id'   => $recepta->id,
                'usuari_id'    => auth()->id(),
                'porcions'     => $porcions,
                'data'         => now(),
                'observacions' => $validated['observacions'] ?? null
            ]);

            foreach ($recepta->linies as $linia) {
                $quantitatConsumida = $linia->quantitat_per_porcio * $porcions;
                $restant = $quantitatConsumida;

                // FEFO: lots del producte ordenats per data de caducitat (el que caduca abans primer)
                $lots = Lot::whereHas('liniaAlbaran', function ($q) use ($linia) {
                        $q->where('producte_id', $linia->producte_id);
                    })
                    ->where('quantitat', '>', 0)
                    ->orderBy('data_caducitat', 'asc')
                    ->get();

                foreach ($lots as $lot) {
                    if ($restant <= 0) break;

                    $consumDeLot = min($lot->quantitat, $restant);

                    MovimentStock::create([
                        'producte_id'       => $linia->producte_id,
                        'lot_id'            => $lot->id,
                        'usuari_id'         => auth()->id(),
                        'recepta_consum_id' => $consum->id,
                        'tipus'             => 'sortida',
                        'quantitat'         => $consumDeLot,
                        'data'              => now(),
                        'observacions'      => 'Consum recepta "' . $recepta->nom . '" (' . $porcions . ' porcions)'
                    ]);

                    $lot->decrement('quantitat', $consumDeLot);
                    $restant -= $consumDeLot;
                }

                // Descomptem l'estoc general del producte
                $linia->producte->decrement('estoc_actual', $quantitatConsumida);
            }

            return $consum;
        });

        return response()->json([
            'success' => true,
            'data'    => $consum->load('recepta', 'usuari'),
            'message' => 'Consum registrat correctament'
        ], 201);
    }

    // LLISTAR CONSUMS D'UNA RECEPTA
    // GET /receptes/{id}/consums
    public function listByRecepta($id)
    {
        $recepta = Recepta::find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }

        $consums = ReceptaConsum::where('recepta_id', $id)
            ->with('usuari', 'moviments.producte')
            ->orderBy('data', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $consums
        ]);
    }

    // MOSTRAR UN CONSUM
    // GET /consums/{id}
    public function getConsum($id)
    {
        $consum = ReceptaConsum::with('recepta', 'usuari', 'moviments.producte')->find($id);

        if (!$consum) {
            return response()->json([
                'success' => false,
                'message' => 'Consum no trobat'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $consum
        ]);
    }
}