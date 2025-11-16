<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Inertia\Inertia;

class StudentAuthController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/LoginEstudiante');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        // Buscar estudiante por código
        $student = User::where('student_code', $request->code)
            ->where('role', 'estudiante')
            ->first();

        if (!$student) {
            return back()->withErrors([
                'code' => 'Código incorrecto. Verifica con tu profesor.',
            ]);
        }

        // Iniciar sesión
        Auth::login($student);

        return redirect()->intended('/estudiante/dashboard');
    }
}