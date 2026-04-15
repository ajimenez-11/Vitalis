<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Recepta;

class ReceptaController extends Controller
{
    public function getReceptes() {
        return response()->json([
            'success' => true,
            'data' => Recepta::all()
        ], 200);
    }

    public function getRecepta($id)
    {
        $recepta = Recepta::find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Receta no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $recepta
        ], 200);
    }

    public function createRecepta(Request $request)
    {
        $recepta = new Recepta();
        $recepta->nom = $request->nom;
        $recepta->descripcio = $request->descripcio;
        $recepta->porcions_base = $request->porcions_base;

        if ($request->file('imatge')) {
            $file = $request->file('imatge');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path(env('RUTA_RECEPTES')), $filename);

            $recepta->imatge = $filename;
        }

        $recepta->save();

        return response()->json([
            'success' => true,
            'data' => $recepta,
            'message' => 'Receta creada'
        ], 201);
    }

    public function updateRecepta(Request $request, $id)
    {
        $recepta = Recepta::find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Receta no encontrada'
            ], 404);
        }

        $recepta->update($request->all());

        if ($request->file('imatge')) {
            $file = $request->file('imatge');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path(env('RUTA_RECEPTES')), $filename);

            $recepta->imatge = $filename;
            $recepta->save();
        }

        return response()->json([
            'success' => true,
            'data' => $recepta,
            'message' => 'Receta actualizada'
        ], 200);
    }

    public function deleteRecepta($id)
    {
        $recepta = Recepta::find($id);

        if (!$recepta) {
            return response()->json([
                'success' => false,
                'message' => 'Receta no encontrada'
            ], 404);
        }

        $recepta->delete();

        return response()->json([
            'success' => true,
            'message' => 'Receta eliminada'
        ], 200);
    }
}
