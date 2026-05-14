<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Albaran;
use App\Models\LiniaAlbaran;
use App\Models\Lot;
use Illuminate\Http\Request;

class LiniaAlbaranController extends Controller
{
    // LLISTAR LÍNIES D'UN ALBARÀ
    // GET /albarans/{albaran_id}/linies
    
    public function listByAlbaran($albaran_id)
    {
        $albaran = Albaran::find($albaran_id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albaran no trobat',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => LiniaAlbaran::where('albaran_id', $albaran_id)
                ->with('producte', 'lots')
                ->get(),
        ]);
    }

    // MOSTRAR UNA LÍNIA
    // GET /linies-albaran/{id}

    public function getLinia($id)
    {
        $linia = LiniaAlbaran::with('producte', 'lots')->find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $linia,
        ]);
    }

    // CREAR LÍNIA
    // POST /albarans/{albaran_id}/linies

    public function new(Request $request, $albaran_id)
    {
        $albaran = Albaran::find($albaran_id);

        if (!$albaran) {
            return response()->json([
                'success' => false,
                'message' => 'Albaran no trobat',
            ], 404);
        }

        // No es poden afegir línies a un albaran confirmat

        if ($albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es poden afegir línies a un albaran confirmat',
            ], 400);
        }

        $validated = $request->validate([
            'producte_id'  => 'required|exists:productes,id',
            'quantitat'    => 'required|numeric|min:0.001',
            'preu_unitari' => 'nullable|numeric|min:0',
        ]);

        $validated['albaran_id'] = $albaran_id;

        $linia = LiniaAlbaran::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $linia->load('producte'),
            'message' => 'Línia creada correctament',
        ], 201);
    }

    // EDITAR LÍNIA
    // PUT /linies-albaran/{id}

    public function edit(Request $request, $id)
    {
        $linia = LiniaAlbaran::with('albaran')->find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        if ($linia->albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es pot editar una línia d\'un albaran confirmat',
            ], 400);
        }

        $validated = $request->validate([
            'producte_id'  => 'sometimes|exists:productes,id',
            'quantitat'    => 'sometimes|numeric|min:0.001',
            'preu_unitari' => 'nullable|numeric|min:0',
        ]);

        $linia->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $linia->load('producte'),
            'message' => 'Línia actualitzada correctament',
        ]);
    }

    // ELIMINAR LÍNIA
    // DELETE /linies-albaran/{id}

    public function delete($id)
    {
        $linia = LiniaAlbaran::with('albaran')->find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        if ($linia->albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar una línia d\'un albaran confirmat',
            ], 400);
        }

        try {
            $linia->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar la línia: ' . $e->getMessage(),
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Línia eliminada correctament',
        ]);
    }

    // LLISTAR LOTS D'UNA LÍNIA
    // GET /linies-albaran/{id}/lots

    public function listLots($id)
    {
        $linia = LiniaAlbaran::find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $linia->lots()->orderBy('data_caducitat', 'asc')->get(),
        ]);
    }

    // CREAR LOT D'UNA LÍNIA
    // POST /linies-albaran/{id}/lots

    public function newLot(Request $request, $id)
    {
        $linia = LiniaAlbaran::with('albaran')->find($id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        if ($linia->albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es poden afegir lots a una línia d\'un albaran confirmat',
            ], 400);
        }

        $validated = $request->validate([
            'numero_lot'     => 'required|string|max:100',
            'quantitat'      => 'required|numeric|min:0.001',
            'data_caducitat' => 'required|date|after:today',
        ]);

        $validated['linia_albaran_id'] = $id;

        $lot = Lot::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $lot,
            'message' => 'Lot creat correctament',
        ], 201);
    }

    // ELIMINAR LOT D'UNA LÍNIA
    // DELETE /linies-albaran/{linia_id}/lots/{lot_id}

    public function deleteLot($linia_id, $lot_id)
    {
        $linia = LiniaAlbaran::with('albaran')->find($linia_id);

        if (!$linia) {
            return response()->json([
                'success' => false,
                'message' => 'Línia no trobada',
            ], 404);
        }

        if ($linia->albaran->estat === 'confirmat') {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar un lot d\'un albaran confirmat',
            ], 400);
        }

        $lot = Lot::where('id', $lot_id)
            ->where('linia_albaran_id', $linia_id)
            ->first();

        if (!$lot) {
            return response()->json([
                'success' => false,
                'message' => 'Lot no trobat o no pertany a aquesta línia',
            ], 404);
        }

        try {
            $lot->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar el lot: ' . $e->getMessage(),
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lot eliminat correctament',
        ]);
    }
}