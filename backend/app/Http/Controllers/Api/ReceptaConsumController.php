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
 
        if ($recepta->linies->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'La recepta no té ingredients definits'
            ], 400);
        }
 
        $porcions  = $validated['porcions'];
        $mancances = $this->getMancances($recepta->linies, $porcions);
 
        if (!empty($mancances)) {
            return response()->json([
                'success'   => false,
                'message'   => 'Estoc insuficient per registrar el consum',
                'mancances' => $mancances
            ], 422);
        }
 
        $consum = DB::transaction(function () use ($recepta, $porcions, $validated) {
            // Segona comprovació dins la transacció per evitar race conditions
            $mancances = $this->getMancances($recepta->linies, $porcions);
            if (!empty($mancances)) {
                throw new \RuntimeException('estoc_insuficient');
            }
 
            $consum = ReceptaConsum::create([
                'recepta_id'   => $recepta->id,
                'usuari_id'    => auth()->id(),
                'porcions'     => $porcions,
                'data'         => now(),
                'observacions' => $validated['observacions'] ?? null
            ]);
 
            foreach ($recepta->linies as $linia) {
                $quantitatConsumida = $linia->quantitat_per_porcio * $porcions;
                $this->consumirPerFEFO($linia, $quantitatConsumida, $consum, $recepta, $porcions);
 
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