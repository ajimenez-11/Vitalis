<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lot;
use App\Models\Producte;
use App\Models\MovimentStock;

class TracabilitatController extends Controller
{
    // LLISTAR TOTS ELS LOTS (per navegar i fer clic)
    // GET /tracabilitat/lots
    public function list()
    {
        $lots = Lot::with([
                'liniaAlbaran.producte',
                'liniaAlbaran.albaran.proveidor',
            ])
            ->orderBy('data_caducitat', 'asc')
            ->get()
            ->map(function ($lot) {
                $linia   = $lot->liniaAlbaran;
                $albaran = $linia?->albaran;
 
                return [
                    'id' => $lot->id,
                    'numero_lot' => $lot->numero_lot,
                    'data_caducitat' => $lot->data_caducitat,
                    'producte_id' => $linia?->producte?->id,
                    'producte' => $linia?->producte?->nom,
                    'unitat_mesura'  => $linia?->producte?->unitat_mesura,
                    'quantitat' => $linia?->quantitat,
                    'proveidor' => $albaran?->proveidor?->nom,
                    'data_entrada' => $albaran?->data,
                    'albaran_id' => $albaran?->id,
                ];
            });
 
        return response()->json([
            'success' => true,
            'data'    => $lots
        ]);
    }

    // TRAÇABILITAT PER LOT
    // GET /tracabilitat/lot/{numero}
    // Respon: d'on ve el lot i on ha anat (quines receptes/sortides)
    public function lot($numero)
    {
        $lot = Lot::where('numero_lot', $numero)
            ->with([
                'liniaAlbaran.albaran.proveidor',
                'liniaAlbaran.albaran.usuari',
                'liniaAlbaran.producte',
                'moviments.usuari',
                'moviments.receptaConsum.recepta', 
            ])
            ->first();

        if (!$lot) {
            return response()->json([
                'success' => false,
                'message' => 'Lot no trobat'
            ], 404);
        }

        $linia    = $lot->liniaAlbaran;
        $albaran  = $linia->albaran;

        return response()->json([
            'success' => true,
            'data' => [
                // Identitat del lot
                'lot' => [
                    'id' => $lot->id,
                    'numero_lot' => $lot->numero_lot,
                    'quantitat' => $lot->quantitat,
                    'data_caducitat' => $lot->data_caducitat,
                ],
                // Producte al qual pertany
                'producte' => $linia->producte,

                // Origen: albaran i proveïdor
                'origen' => [
                    'albaran_id' => $albaran->id,
                    'data_entrada' => $albaran->data,
                    'estat' => $albaran->estat,
                    'proveidor' => $albaran->proveidor,
                    'usuari' => $albaran->usuari,
                ],

                // Destí: tots els moviments d'aquest lot
                // (entrades, sortides manuals, consums de recepta)
                'moviments' => $lot->moviments->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'tipus' => $m->tipus,
                        'quantitat'  => $m->quantitat,
                        'data' => $m->data,
                        'usuari' => $m->usuari?->nom,
                        'observacions' => $m->observacions,
                        // Si el moviment prové d'una recepta, mostra-la
                        'recepta'    => $m->receptaConsum
                            ? [
                                'consum_id' => $m->receptaConsum->id,
                                'recepta' => $m->receptaConsum->recepta?->nom,
                                'porcions' => $m->receptaConsum->porcions,
                                'data' => $m->receptaConsum->data,
                            ]
                            : null,
                    ];
                }),
            ]
        ]);
    }

    // TRAÇABILITAT PER PRODUCTE
    // GET /tracabilitat/producte/{id}
    // Respon: tots els lots rebuts, tots els moviments i consums
    public function producte($id)
    {
        $producte = Producte::find($id);

        if (!$producte) {
            return response()->json([
                'success' => false,
                'message' => 'Producte no trobat'
            ], 404);
        }

        // Tots els moviments del producte amb context complet
        $moviments = MovimentStock::where('producte_id', $id)
            ->with([
                'lot.liniaAlbaran.albaran.proveidor',
                'usuari',
                'receptaConsum.recepta',  
            ])
            ->orderBy('data', 'desc')
            ->get();

        // Tots els lots que han entrat per aquest producte
        $lots = Lot::whereHas('liniaAlbaran', function ($q) use ($id) {
                $q->where('producte_id', $id);
            })
            ->with('liniaAlbaran.albaran.proveidor')
            ->orderBy('data_caducitat', 'asc')
            ->get()
            ->map(function ($lot) {
                return [
                    'id' => $lot->id,
                    'numero_lot' => $lot->numero_lot,
                    'quantitat' => $lot->quantitat,
                    'data_caducitat' => $lot->data_caducitat,
                    'proveidor' => $lot->liniaAlbaran->albaran->proveidor->nom,
                    'data_entrada' => $lot->liniaAlbaran->albaran->data,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'producte' => $producte,
                'estoc_actual' => $producte->estoc_actual,

                // Tots els lots que han entrat per aquest producte
                'lots_rebuts' => $lots,

                // Historial complet de moviments
                'moviments' => $moviments->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'tipus' => $m->tipus,
                        'quantitat' => $m->quantitat,
                        'data' => $m->data,
                        'observacions' => $m->observacions,
                        'usuari' => $m->usuari?->nom,
                        'lot' => $m->lot?->numero_lot,
                        'proveidor' => $m->lot?->liniaAlbaran?->albaran?->proveidor?->nom,
                        // Si és un consum de recepta, mostra el detall
                        'recepta'      => $m->receptaConsum
                            ? [
                                'nom' => $m->receptaConsum->recepta?->nom,
                                'porcions'=> $m->receptaConsum->porcions,
                            ]
                            : null,
                    ];
                }),

                // Resum agregat per tipus
                'resum' => [
                    'total_entrades' => $moviments->where('tipus', 'entrada')->sum('quantitat'),
                    'total_sortides' => $moviments->where('tipus', 'sortida')->sum('quantitat'),
                    'total_ajustos'  => $moviments->where('tipus', 'ajust')->sum('quantitat'),
                ],
            ]
        ]);
    }
}