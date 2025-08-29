<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('index');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Ruta pública para la UI de clientes
Route::get('clientes-ui', function () {
    return Inertia::render('clientes');
})->name('clientes.ui');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
