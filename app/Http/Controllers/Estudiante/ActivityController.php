<?php

namespace App\Http\Controllers\Estudiante;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivityAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentActivityView;

class ActivityController extends Controller
{
    /**
     * Mostrar actividades asignadas al estudiante (con rotación)
     */
    public function index()
    {
        $student = auth()->user();
        
        // Obtener todas las actividades Discover del curso del estudiante
        $allDiscoverActivities = Activity::whereHas('courses', function($query) use ($student) {
            $query->where('courses.id', $student->course_id);
        })
        ->where('active', true)
        ->where('type', 'discover')
        ->orderBy('created_at', 'asc')
        ->get();

        // Si no hay actividades, retornar vacío
        if ($allDiscoverActivities->isEmpty()) {
            return Inertia::render('Estudiante/Actividades', [
                'activities' => collect([]),
            ]);
        }

        // Obtener actividades ya vistas por el estudiante (de tipo discover)
        $viewedActivityIds = StudentActivityView::where('student_id', $student->id)
            ->where('activity_type', 'discover')
            ->pluck('activity_id')
            ->toArray();

        // Filtrar actividades no vistas
        $notViewedActivities = $allDiscoverActivities->filter(function($activity) use ($viewedActivityIds) {
            return !in_array($activity->id, $viewedActivityIds);
        });

        // Si ya vio todas, reiniciar el ciclo (limpiar el historial)
        if ($notViewedActivities->isEmpty()) {
            StudentActivityView::where('student_id', $student->id)
                ->where('activity_type', 'discover')
                ->delete();
            
            $notViewedActivities = $allDiscoverActivities;
        }

        // Seleccionar la primera actividad no vista
        $selectedActivity = $notViewedActivities->first();

        // Registrar que el estudiante vio esta actividad
        StudentActivityView::updateOrCreate(
            [
                'student_id' => $student->id,
                'activity_id' => $selectedActivity->id,
                'activity_type' => 'discover',
            ],
            [
                'viewed_at' => now(),
            ]
        );

        // Agregar información de intentos
        $selectedActivity->best_attempt = ActivityAttempt::where('activity_id', $selectedActivity->id)
            ->where('student_id', $student->id)
            ->where('completed', true)
            ->orderBy('score', 'desc')
            ->first();
        
        $selectedActivity->total_attempts = ActivityAttempt::where('activity_id', $selectedActivity->id)
            ->where('student_id', $student->id)
            ->count();

        // Retornar solo la actividad seleccionada (como colección)
        return Inertia::render('Estudiante/Actividades', [
            'activities' => collect([$selectedActivity]),
        ]);
    }

    /**
     * Mostrar una actividad específica para jugar
     */
    public function show(Activity $activity)
    {
        $student = auth()->user();
        
        // Verificar que la actividad esté asignada al curso del estudiante
        if (!$activity->courses->contains('id', $student->course_id)) {
            abort(403, 'Esta actividad no está asignada a tu curso');
        }

        // Cargar intentos anteriores del estudiante
        $attempts = ActivityAttempt::where('activity_id', $activity->id)
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Estudiante/Discover', [
            'activity' => $activity,
            'attempts' => $attempts,
        ]);
    }

    /**
     * Guardar intento del estudiante
     */
    public function storeAttempt(Request $request, Activity $activity)
    {
        $student = auth()->user();
        
        // Verificar que la actividad esté asignada al curso del estudiante
        if (!$activity->courses->contains('id', $student->course_id)) {
            abort(403, 'Esta actividad no está asignada a tu curso');
        }

        $validated = $request->validate([
            'answers' => 'required|array',
            'score' => 'required|integer|min:0',
            'time_spent' => 'required|integer|min:0',
            'completed' => 'required|boolean',
        ]);

        // Calcular puntaje máximo
        $maxScore = count($activity->config['words']) * ($activity->config['points_per_word'] ?? 20);

        $attempt = ActivityAttempt::create([
            'activity_id' => $activity->id,
            'student_id' => $student->id,
            'score' => $validated['score'],
            'max_score' => $maxScore,
            'time_spent' => $validated['time_spent'],
            'answers' => $validated['answers'],
            'completed' => $validated['completed'],
            'completed_at' => $validated['completed'] ? now() : null,
        ]);

        return back()->with('success', '¡Intento guardado exitosamente!');
    }
}