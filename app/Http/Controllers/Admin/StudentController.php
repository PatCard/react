<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'estudiante')
            ->with('course')
            ->orderBy('name')
            ->get();
            
        $courses = Course::where('active', true)
            ->orderBy('level')
            ->orderBy('section')
            ->get();
        
        return Inertia::render('Admin/Estudiantes', [
            'students' => $students,
            'courses' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
        ]);

        // Generar código único de 6 caracteres
        do {
            $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
        } while (User::where('student_code', $code)->exists());

        $validated['email'] = $code . '@' . config('app.student_email_domain', 'colegio.cl');
        $validated['password'] = Hash::make($code); // Password es el mismo código
        $validated['role'] = 'estudiante';
        $validated['student_code'] = $code;

        User::create($validated);

        return redirect()->route('admin.estudiantes')->with('success', 'Estudiante creado exitosamente');
    }

    public function destroy($id)
    {
        $student = User::where('role', 'estudiante')->findOrFail($id);
        $student->delete();

        return redirect()->route('admin.estudiantes')->with('success', 'Estudiante eliminado exitosamente');
    }
}