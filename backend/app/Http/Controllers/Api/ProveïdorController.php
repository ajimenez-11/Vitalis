<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Proveidor;

class ProveïdorController extends Controller
{
public function getProveidors()
{
    return response()->json([
        'success' => true,
        'data' => Proveidor::all()
    ], 200);
}

public function getProveidor($id)
{
    $proveidor = Proveidor::find($id);

    if (!$proveidor) {
        return response()->json([
            'success' => false,
            'message' => 'Proveedor no encontrado'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $proveidor
    ], 200);
}

public function createProveidor(Request $request)
{
    $proveidor = Proveidor::create($request->all());

    return response()->json([
        'success' => true,
        'data' => $proveidor,
        'message' => 'Proveedor creado'
    ], 201);
}

public function updateProveidor(Request $request, $id)
{
    $proveidor = Proveidor::find($id);

    if (!$proveidor) {
        return response()->json([
            'success' => false,
            'message' => 'Proveedor no encontrado'
        ], 404);
    }

    $proveidor->update($request->all());

    return response()->json([
        'success' => true,
        'data' => $proveidor,
        'message' => 'Proveedor actualizado'
    ], 200);
}

public function deleteProveidor($id)
{
    $proveidor = Proveidor::find($id);

    if (!$proveidor) {
        return response()->json([
            'success' => false,
            'message' => 'Proveedor no encontrado'
        ], 404);
    }

    $proveidor->delete();

    return response()->json([
        'success' => true,
        'message' => 'Proveedor eliminado'
    ], 200);
}

}
