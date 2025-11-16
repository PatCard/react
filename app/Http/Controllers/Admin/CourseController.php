<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::orderBy('level')->orderBy('section')->get();
        
        return Inertia::render('Admin/Cursos', [
            'courses' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'level' => 'required|in:3° Básico,4° Básico',
            'section' => 'required|in:A,B,C,D,E',
            'year' => 'required|integer|min:2024|max:2030',
        ]);

        // Verificar si ya existe un curso con ese nivel, sección y año
        $existingCourse = Course::where('level', $validated['level'])
            ->where('section', $validated['section'])
            ->where('year', $validated['year'])
            ->first();

        if ($existingCourse) {
            return back()->withErrors([
                'level' => 'Ya existe un curso ' . $validated['level'] . ' ' . $validated['section'] . ' para el año ' . $validated['year']
            ]);
        }

        // Crear el nombre completo del curso
        $validated['name'] = $validated['level'] . ' ' . $validated['section'];
        $validated['active'] = true;

        Course::create($validated);

        return back()->with('success', 'Curso creado exitosamente');
    }

    public function destroy(Course $course)
    {
        \Log::info('🗑️ Intentando eliminar curso', [
            'course_id' => $course->id,
            'course_name' => $course->name,
        ]);

        try {
            // Verificar si hay profesores asignados
            $professorsCount = $course->professors()->count();
            
            \Log::info('👨‍🏫 Profesores asignados', ['count' => $professorsCount]);
            
            if ($professorsCount > 0) {
                \Log::info('❌ No se puede eliminar: tiene profesores');
                return back()->withErrors([
                    'delete' => 'No se puede eliminar este curso porque tiene ' . $professorsCount . ' profesor(es) asignado(s). Primero remueve las asignaciones.'
                ]);
            }
            
            // Verificar si hay estudiantes asignados
            $studentsCount = $course->students()->count();
            
            \Log::info('🎓 Estudiantes asignados', [
                'count' => $studentsCount,
                'students' => $course->students()->pluck('name', 'id')->toArray()
            ]);
            
            if ($studentsCount > 0) {
                \Log::info('❌ No se puede eliminar: tiene estudiantes');
                return back()->withErrors([
                    'delete' => 'No se puede eliminar este curso porque tiene ' . $studentsCount . ' estudiante(s) matriculado(s). Primero remueve las asignaciones.'
                ]);
            }
            
            \Log::info('✅ Eliminando curso...');
            $course->delete();
            \Log::info('✅ Curso eliminado exitosamente');

            return back()->with('success', 'Curso eliminado exitosamente');
            
        } catch (\Exception $e) {
            \Log::error('💥 Error al eliminar curso', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'delete' => 'Error al eliminar el curso: ' . $e->getMessage()
            ]);
        }
    }
}