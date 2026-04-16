<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProducteController;
use App\Http\Controllers\Api\ProveidorController;
use App\Http\Controllers\Api\AlbaranController;
use App\Http\Controllers\Api\LiniaAlbaranController;
use App\Http\Controllers\Api\LotController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\ReceptaController;
use App\Http\Controllers\Api\LiniaReceptaController;
use App\Http\Controllers\Api\ReceptaConsumController;
use App\Http\Controllers\Api\TracabilitatController;
use App\Http\Controllers\Api\DashboardController;

/*
  PUBLIC
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    /*
      AUTH
    */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);


    /*
      USUARIS (ADMIN) OK
    */
    Route::middleware('role:admin')->group(function () {

        Route::get('/usuaris', [UserController::class, 'list']);
        Route::get('/usuaris/{id}', [UserController::class, 'getUsuari']);
        Route::post('/usuaris', [UserController::class, 'new']);
        Route::put('/usuaris/{id}', [UserController::class, 'edit']);
        Route::delete('/usuaris/{id}', [UserController::class, 'delete']);

        Route::post('/usuaris/{id}/toggle', [UserController::class, 'toggleActive']);
    });


    /*
      PRODUCTES OK
    */
    Route::middleware('role:admin,responsable_cuina')->group(function () {
        Route::get('/productes', [ProducteController::class, 'list']);
        Route::get('/productes/{id}', [ProducteController::class, 'getProducte']);
        Route::post('/productes', [ProducteController::class, 'new']);
        Route::put('/productes/{id}', [ProducteController::class, 'edit']);
        Route::delete('/productes/{id}', [ProducteController::class, 'delete']);
    });


    /*
      PROVEIDORS OK
    */
    Route::middleware('role:admin,responsable_cuina')->group(function () {
        Route::get('/proveidors', [ProveidorController::class, 'list']);
        Route::get('/proveidors/{id}', [ProveidorController::class, 'getProveidor']);
        Route::post('/proveidors', [ProveidorController::class, 'new']);
        Route::put('/proveidors/{id}', [ProveidorController::class, 'edit']);
        Route::delete('/proveidors/{id}', [ProveidorController::class, 'delete']);
    });


    /*
      ALBARANS OK
    */
    Route::middleware('role:admin,responsable_cuina')->group(function () {

        Route::get('/albarans', [AlbaranController::class, 'list']);
        Route::get('/albarans/{id}', [AlbaranController::class, 'getAlbaran']);
        Route::post('/albarans', [AlbaranController::class, 'new']);
        Route::put('/albarans/{id}', [AlbaranController::class, 'edit']);
        Route::delete('/albarans/{id}', [AlbaranController::class, 'delete']);

        Route::post('/albarans/{id}/confirmar', [AlbaranController::class, 'confirmar']);
    });


    /*
      LÍNIES D’ALBARÀ (REST) OK
    */
    Route::middleware('role:admin,responsable_cuina')->group(function () {

        Route::get('/albarans/{albaran_id}/linies', [LiniaAlbaranController::class, 'listByAlbaran']);
        Route::post('/albarans/{albaran_id}/linies', [LiniaAlbaranController::class, 'new']);
        Route::get('/linies-albaran/{id}', [LiniaAlbaranController::class, 'getLinia']);
        Route::put('/linies-albaran/{id}', [LiniaAlbaranController::class, 'edit']);
        Route::delete('/linies-albaran/{id}', [LiniaAlbaranController::class, 'delete']);

    });


    /*
      LOTS OK
    */
    Route::middleware('role:admin,responsable_cuina,cuiner')->group(function () {
        Route::get('/lots', [LotController::class, 'list']);
        Route::get('/lots/{id}', [LotController::class, 'getLot']);
        Route::get('/lots/numero/{numero}', [LotController::class, 'findByNumero']);
        Route::get('/lots/producte/{id}', [LotController::class, 'getLotsByProducte']);
        Route::get('/lots/proxims-caducitat', [LotController::class, 'getLotsProximsCaducitat']);
    });


    /*
      STOCK OK
    */
    Route::middleware('role:admin,responsable_cuina,cuiner')->group(function () {
        Route::get('/stock', [StockController::class, 'list']);
        Route::get('/stock/producte/{id}', [StockController::class, 'getProducteStock']);
        Route::get('/stock/moviments', [StockController::class, 'listMoviments']);
        Route::get('/stock/producte/{id}/moviments', [StockController::class, 'listMovimentsProducte']);
       
        Route::post('/stock/ajust', [StockController::class, 'ajust']);
        Route::post('/stock/sortida', [StockController::class, 'sortida']);
    });


    /*
      TRAÇABILITAT OK
    */
    Route::middleware('role:admin,responsable_cuina,cuiner')->group(function () {
        Route::get('/tracabilitat/lot/{numero}', [TracabilitatController::class, 'lot']);
        Route::get('/tracabilitat/producte/{id}', [TracabilitatController::class, 'producte']);
    });


    /*
      RECEPTES OK
    */
    Route::middleware('role:admin,responsable_cuina')->group(function () {

        Route::get('/receptes', [ReceptaController::class, 'list']);
        Route::get('/receptes/{id}', [ReceptaController::class, 'getRecepta']);
        Route::post('/receptes', [ReceptaController::class, 'new']);
        Route::put('/receptes/{id}', [ReceptaController::class, 'edit']);
        Route::delete('/receptes/{id}', [ReceptaController::class, 'delete']);
    });


    /*
      LÍNIES DE RECEPTA (REST) OK
    */
    Route::middleware('role:admin,responsable_cuina')->group(function () {

        Route::post('/receptes/{recepta_id}/linies', [LiniaReceptaController::class, 'new']);
        Route::get('/linies-recepta/{id}', [LiniaReceptaController::class, 'getLinia']);
        Route::put('/linies-recepta/{id}', [LiniaReceptaController::class, 'edit']);
        Route::delete('/linies-recepta/{id}', [LiniaReceptaController::class, 'delete']);
    });


    /*
      CONSUM DE RECEPTES OK
    */
    Route::middleware('role:admin,responsable_cuina,cuiner')->group(function () {

        Route::post('/receptes/{id}/consum', [ReceptaConsumController::class, 'new']);
        Route::get('/receptes/{id}/consums', [ReceptaConsumController::class, 'listByRecepta']);
        Route::get('/consums/{id}', [ReceptaConsumController::class, 'getConsum']);
    });


    /*
      DASHBOARD OK
    */
    Route::middleware('role:admin,responsable_cuina,cuiner')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'list']);
    });

});
