<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StudentsImport;

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

        // Generar email basado en nombre completo (sin acentos ni ñ)
        $nameParts = explode(' ', trim($validated['name']));

        // Función para normalizar texto (quitar acentos y ñ)
        $normalize = function($text) {
            $text = strtolower($text);
            $text = str_replace(
                ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'],
                ['a', 'e', 'i', 'o', 'u', 'n', 'u'],
                $text
            );
            return $text;
        };

        $firstName = $normalize($nameParts[0]);
        $lastName = isset($nameParts[1]) ? $normalize($nameParts[1]) : '';

        $baseEmail = $lastName ? "{$firstName}.{$lastName}" : $firstName;
        $domain = config('app.student_email_domain', 'colegio.cl');

        // Verificar si el email ya existe y agregar contador si es necesario
        $email = "{$baseEmail}@{$domain}";
        $counter = 2;

        while (User::where('email', $email)->exists()) {
            $email = "{$baseEmail}{$counter}@{$domain}";
            $counter++;
        }

        $validated['email'] = $email;
        $validated['password'] = Hash::make($code); // Password sigue siendo el código de 6 caracteres
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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
            'course_id' => 'required|exists:courses,id',
        ]);

        $import = new StudentsImport($request->course_id);
        
        Excel::import($import, $request->file('file'));

        $createdStudents = $import->getCreatedStudents();

        return redirect()->route('admin.estudiantes')->with([
            'success' => 'Estudiantes importados exitosamente',
            'students' => $createdStudents
        ]);
    }

}