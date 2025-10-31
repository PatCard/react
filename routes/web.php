<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página de bienvenida principal
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Login de profesores
Route::get('/login_profesor', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest')->name('login');

// Login de estudiantes (lo crearemos después)
Route::get('/login_estudiante', function () {
    return Inertia::render('Auth/LoginEstudiante');
})->middleware('guest')->name('login.estudiante');

// Rutas de profesores (requieren autenticación)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';