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
        
        // Obtener todas las actividades activas del curso del estudiante
        $allActivities = Activity::whereHas('courses', function($query) use ($student) {
            $query->where('courses.id', $student->course_id);
        })
        ->where('active', true)
        ->orderBy('created_at', 'asc')
        ->get();

        // Si no hay actividades, retornar vacío
        if ($allActivities->isEmpty()) {
            return Inertia::render('Estudiante/Actividades', [
                'activities' => collect([]),
            ]);
        }

        // Separar por tipo
        $discoverActivities = $allActivities->where('type', 'discover');
        $storyOrderActivities = $allActivities->where('type', 'story_order');

        // Obtener actividades ya vistas por el estudiante (por tipo)
        $viewedDiscoverIds = StudentActivityView::where('student_id', $student->id)
            ->where('activity_type', 'discover')
            ->pluck('activity_id')
            ->toArray();
        
        $viewedStoryOrderIds = StudentActivityView::where('student_id', $student->id)
            ->where('activity_type', 'story_order')
            ->pluck('activity_id')
            ->toArray();

        // Filtrar actividades no vistas por tipo
        $notViewedDiscover = $discoverActivities->filter(function($activity) use ($viewedDiscoverIds) {
            return !in_array($activity->id, $viewedDiscoverIds);
        });

        $notViewedStoryOrder = $storyOrderActivities->filter(function($activity) use ($viewedStoryOrderIds) {
            return !in_array($activity->id, $viewedStoryOrderIds);
        });

        // Si ya vio todas de un tipo, reiniciar ese tipo
        if ($discoverActivities->isNotEmpty() && $notViewedDiscover->isEmpty()) {
            StudentActivityView::where('student_id', $student->id)
                ->where('activity_type', 'discover')
                ->delete();
            $notViewedDiscover = $discoverActivities;
        }

        if ($storyOrderActivities->isNotEmpty() && $notViewedStoryOrder->isEmpty()) {
            StudentActivityView::where('student_id', $student->id)
                ->where('activity_type', 'story_order')
                ->delete();
            $notViewedStoryOrder = $storyOrderActivities;
        }

        // Seleccionar UNA de cada tipo (la primera no vista)
        $selectedActivities = collect();

        if ($notViewedDiscover->isNotEmpty()) {
            $selectedDiscover = $notViewedDiscover->first();
            
            // Registrar que vio esta actividad
            StudentActivityView::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'activity_id' => $selectedDiscover->id,
                ],
                [
                    'activity_type' => $selectedDiscover->type,
                    'viewed_at' => now(),
                ]
            );

            // Agregar información de intentos
            $selectedDiscover->best_attempt = ActivityAttempt::where('activity_id', $selectedDiscover->id)
                ->where('student_id', $student->id)
                ->where('completed', true)
                ->orderBy('score', 'desc')
                ->first();
            
            $selectedDiscover->total_attempts = ActivityAttempt::where('activity_id', $selectedDiscover->id)
                ->where('student_id', $student->id)
                ->count();

            $selectedActivities->push($selectedDiscover);
        }

        if ($notViewedStoryOrder->isNotEmpty()) {
            $selectedStoryOrder = $notViewedStoryOrder->first();
            
            // Registrar que vio esta actividad
            StudentActivityView::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'activity_id' => $selectedStoryOrder->id,
                ],
                [
                    'activity_type' => $selectedStoryOrder->type,
                    'viewed_at' => now(),
                ]
            );

            // Agregar información de intentos
            $selectedStoryOrder->best_attempt = ActivityAttempt::where('activity_id', $selectedStoryOrder->id)
                ->where('student_id', $student->id)
                ->where('completed', true)
                ->orderBy('score', 'desc')
                ->first();
            
            $selectedStoryOrder->total_attempts = ActivityAttempt::where('activity_id', $selectedStoryOrder->id)
                ->where('student_id', $student->id)
                ->count();

            $selectedActivities->push($selectedStoryOrder);
        }

        return Inertia::render('Estudiante/Actividades', [
            'activities' => $selectedActivities,
        ]);
    }

    /**
     * Mostrar una actividad específica para jugar
     */
    public function show(Activity $activity)
    {
        // Verificar que el estudiante pertenece a un curso que tiene esta actividad
        $student = auth()->user();
        
        if (!$activity->courses->contains($student->course_id)) {
            abort(403, 'No tienes acceso a esta actividad');
        }

        // Obtener intentos anteriores del estudiante en esta actividad
        $attempts = ActivityAttempt::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->where('completed', true)
            ->orderBy('completed_at', 'desc')
            ->get();

        // Determinar qué componente renderizar según el tipo de actividad
        $component = match($activity->type) {
            'story_order' => 'Estudiante/StoryOrder',
            default => 'Estudiante/Discover',
        };

        return Inertia::render($component, [
            'activity' => $activity,
            'attempts' => $attempts,
        ]);
    }

    /**
     * Guardar intento del estudiante
     */
    public function storeAttempt(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:0',
            'max_score' => 'required|integer|min:0',
            'time_spent' => 'required|integer|min:0',
            'answers' => 'nullable|array',
            'completed' => 'required|boolean',
        ]);

        $attempt = ActivityAttempt::create([
            'activity_id' => $activity->id,
            'student_id' => auth()->id(),
            'score' => $validated['score'],
            'max_score' => $validated['max_score'],
            'time_spent' => $validated['time_spent'],
            'answers' => $validated['answers'] ?? [],
            'completed' => $validated['completed'],
            'completed_at' => now(),
        ]);

        return redirect()->back();
    }
}