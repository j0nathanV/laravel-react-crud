<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
use App\Http\Controllers\ClienteController;

Route::prefix('clientes')->group(function () {
    Route::get('/', [ClienteController::class, 'index']); // Listar
    Route::post('/', [ClienteController::class, 'store']); // Crear
    Route::delete('/{id}', [ClienteController::class, 'destroy']); // Eliminar
});
