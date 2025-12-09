<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    /**
     * Mostrar lista de actividades del profesor
     */
    public function index()
    {
        $activities = Activity::where('professor_id', auth()->id())
            ->with('courses')
            ->withCount('attempts')
            ->latest()
            ->get();

        $courses = auth()->user()->courses()
            ->where('active', true)
            ->orderBy('level')
            ->orderBy('section')
            ->get();

        return Inertia::render('Profesor/Actividades', [
            'activities' => $activities,
            'courses' => $courses,
        ]);
    }

    /**
     * Guardar nueva actividad
     */
    public function store(Request $request)
    {
        \Log::info('🎯 Intentando crear actividad', [
            'user' => auth()->user()->email,
            'data' => $request->all()
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:discover,story_order,error_hunter,story_creator',
            'difficulty' => 'required|in:easy,medium,hard',
            'content' => 'required|string',
            'config' => 'required|array',
            'config.words' => 'required|array|min:3',
            'config.words.*.word' => 'required|string',
            'config.words.*.definition' => 'required|string',
            'course_ids' => 'required|array|min:1',
            'course_ids.*' => 'exists:courses,id',
            'due_date' => 'nullable|date|after:today',
        ]);

        \Log::info('✅ Validación exitosa', ['validated' => $validated]);
        
        // Validar que los cursos sean del mismo nivel
        $courses = Course::whereIn('id', $validated['course_ids'])->get();
        $levels = $courses->pluck('level')->unique();
        
        if ($levels->count() > 1) {
            return back()->withErrors([
                'course_ids' => 'Solo puedes asignar actividades a cursos del mismo nivel.'
            ]);
        }

        // Crear la actividad
        $activity = Activity::create([
            'professor_id' => auth()->id(),
            'title' => $validated['title'],
            'type' => $validated['type'],
            'difficulty' => $validated['difficulty'],
            'content' => $validated['content'],
            'config' => $validated['config'],
            'due_date' => $validated['due_date'] ?? null,
        ]);

        // Asignar a los cursos
        $activity->courses()->attach($validated['course_ids']);

        return back()->with('success', 'Actividad creada exitosamente');
    }

    /**
     * Actualizar actividad existente
     */
    public function update(Request $request, Activity $activity)
    {
        // Verificar que la actividad pertenece al profesor
        if ($activity->professor_id !== auth()->id()) {
            abort(403, 'No tienes permiso para editar esta actividad');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'difficulty' => 'required|in:easy,medium,hard',
            'content' => 'required|string',
            'config' => 'required|array',
            'config.words' => 'required|array|min:3',
            'config.words.*.word' => 'required|string',
            'config.words.*.definition' => 'required|string',
            'course_ids' => 'required|array|min:1',
            'course_ids.*' => 'exists:courses,id',
            'active' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        // Actualizar la actividad
        $activity->update([
            'title' => $validated['title'],
            'difficulty' => $validated['difficulty'],
            'content' => $validated['content'],
            'config' => $validated['config'],
            'active' => $validated['active'] ?? true,
            'due_date' => $validated['due_date'] ?? null,
        ]);

        // Sincronizar cursos (esto reemplaza los antiguos con los nuevos)
        $activity->courses()->sync($validated['course_ids']);

        return back()->with('success', 'Actividad actualizada exitosamente');
    }

    /**
     * Eliminar actividad
     */
    public function destroy(Activity $activity)
    {
        // Verificar que la actividad pertenece al profesor
        if ($activity->professor_id !== auth()->id()) {
            abort(403, 'No tienes permiso para eliminar esta actividad');
        }

        $activity->delete();

        return back()->with('success', 'Actividad eliminada exitosamente');
    }

    /**
     * Ver estadísticas de una actividad
     */
    public function show(Activity $activity)
    {
        // Verificar que la actividad pertenece al profesor
        if ($activity->professor_id !== auth()->id()) {
            abort(403);
        }

        $activity->load([
            'courses',
            'attempts' => function ($query) {
                $query->where('completed', true)
                    ->with('student:id,name')
                    ->latest('completed_at');
            }
        ]);

        // Estadísticas
        $stats = [
            'total_students' => $activity->courses->sum(function ($course) {
                return $course->students()->count();
            }),
            'completed' => $activity->attempts()->where('completed', true)->count(),
            'average_score' => $activity->attempts()->where('completed', true)->avg('score'),
            'average_time' => $activity->attempts()->where('completed', true)->avg('time_spent'),
        ];

        return Inertia::render('Profesor/ActividadDetalle', [
            'activity' => $activity,
            'stats' => $stats,
        ]);
    }
}