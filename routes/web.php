<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas Web
|--------------------------------------------------------------------------
| Rutas principales de la aplicación. La autenticación está en auth.php
*/

// Página de bienvenida
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Dashboard general - redirige según el rol del usuario
Route::middleware('auth')->get('/dashboard', function () {
    $user = auth()->user();
    
    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }
    
    if ($user->isEstudiante()) {
        return redirect()->route('estudiante.dashboard');
    }
    
    if ($user->isProfesor()) {
        return redirect()->route('profesor.dashboard');
    }
    
    abort(403, 'Rol no reconocido');
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Rutas de Profesores
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'profesor'])->prefix('profesor')->name('profesor.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Profesor/Dashboard');
    })->name('dashboard');

    Route::get('/estudiantes', function () {
        return Inertia::render('Estudiantes/Index');
    })->name('estudiantes.index');
});

/*
|--------------------------------------------------------------------------
| Rutas de Estudiantes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'estudiante'])->prefix('estudiante')->name('estudiante.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Estudiante/Dashboard');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Rutas de Administradores
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
    
    // Gestión de cursos
    Route::get('/cursos', [\App\Http\Controllers\Admin\CourseController::class, 'index'])->name('cursos');
    Route::post('/cursos', [\App\Http\Controllers\Admin\CourseController::class, 'store'])->name('cursos.store');
    Route::delete('/cursos/{course}', [\App\Http\Controllers\Admin\CourseController::class, 'destroy'])->name('cursos.destroy');    
    
    // Gestión de estudiantes
    Route::get('/estudiantes', [\App\Http\Controllers\Admin\StudentController::class, 'index'])->name('estudiantes');
    Route::post('/estudiantes', [\App\Http\Controllers\Admin\StudentController::class, 'store'])->name('estudiantes.store');
    Route::delete('/estudiantes/{id}', [\App\Http\Controllers\Admin\StudentController::class, 'destroy'])->name('estudiantes.destroy');
    
    // Gestión de profesores - CRUD completo
    Route::get('/profesores', [\App\Http\Controllers\Admin\ProfessorController::class, 'index'])->name('profesores');
    Route::post('/profesores', [\App\Http\Controllers\Admin\ProfessorController::class, 'store'])->name('profesores.store');
    Route::patch('/profesores/{user}', [\App\Http\Controllers\Admin\ProfessorController::class, 'update'])->name('profesores.update');
    Route::delete('/profesores/{user}', [\App\Http\Controllers\Admin\ProfessorController::class, 'destroy'])->name('profesores.destroy');
    Route::post('/profesores/{id}/assign-course', [\App\Http\Controllers\Admin\ProfessorController::class, 'assignCourse'])->name('profesores.assign');
    Route::post('/profesores/{id}/confirm-reassign', [\App\Http\Controllers\Admin\ProfessorController::class, 'confirmReassignCourse'])->name('profesores.confirm-reassign');
    Route::delete('/profesores/{professorId}/courses/{courseId}',  [\App\Http\Controllers\Admin\ProfessorController::class, 'removeCourse'])->name('profesores.remove-course');
});

/*
|--------------------------------------------------------------------------
| Rutas de Perfil (todos los usuarios autenticados)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Rutas de Autenticación
|--------------------------------------------------------------------------
| Todas las rutas de login/registro están en routes/auth.php 
*/
require __DIR__.'/auth.php';