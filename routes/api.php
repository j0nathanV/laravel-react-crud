<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;

Route::prefix('clientes')->group(function () {
    Route::get('/', [ClienteController::class, 'index']); // Listar
    Route::post('/', [ClienteController::class, 'store']); // Crear
    Route::delete('/{id}', [ClienteController::class, 'destroy']); // Eliminar
});
