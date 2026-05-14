<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recepta;

class ReceptaController extends Controller
{
    // LLISTAR RECEPTES
    // GET /receptes
    public function list()
    {
        return response()->json([
            'success' => true,
            'data' => Recepta::with('usuari')->orderBy('nom')->get()
        ]);
    }
 
    // MOSTRAR UNA RECEPTA
    // GET /receptes/{id}
    
    public function getRecepta($id)
    {
        $recepta = Recepta::with('linies.producte', 'usuari')->find($id);
 
        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }
 
        return response()->json([
            'success' => true,
            'data' => $recepta
        ]);
    }
 
    // CREAR RECEPTA
    // POST /receptes

    public function new(Request $request)
    {
        $validated = $request->validate([
            'nom'           => 'required|string|max:255',
            'descripcio'    => 'nullable|string',
            'porcions_base' => 'nullable|integer|min:1',
            'imatge'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);
 
        $validated['imatge']     = $this->handleImageUpload($request);
        $validated['usuari_id']  = auth()->id();
 
        $recepta = Recepta::create($validated);
 
        return response()->json([
            'success' => true,
            'data'    => $recepta->load('usuari'),
            'message' => 'Recepta creada correctament'
        ], 201);
    }
 
    // EDITAR RECEPTA
    // PUT /receptes/{id}

    public function edit(Request $request, $id)
    {
        $recepta = Recepta::find($id);
 
        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }
 
        $validated = $request->validate([
            'nom'           => 'sometimes|required|string|max:255',
            'descripcio'    => 'nullable|string',
            'porcions_base' => 'nullable|integer|min:1',
            'imatge'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);
 
        if ($request->hasFile('imatge')) {
            $validated['imatge'] = $this->handleImageUpload($request, $recepta->imatge);
        }
 
        $recepta->update($validated);
 
        return response()->json([
            'success' => true,
            'data'    => $recepta->load('linies.producte', 'usuari'),
            'message' => 'Recepta actualitzada correctament'
        ]);
    }
 
    // ELIMINAR RECEPTA
    // DELETE /receptes/{id}

    public function delete($id)
    {
        $recepta = Recepta::find($id);
 
        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Recepta no trobada'
            ], 404);
        }
 
        try {
            $imatgeRuta = $recepta->imatge;
            $recepta->delete();
            $this->deleteImage($imatgeRuta);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'No es pot eliminar la recepta: té consums registrats',
            ], 409);
        }
 
        return response()->json([
            'success' => true,
            'message' => 'Recepta eliminada correctament'
        ]);
    }
}
