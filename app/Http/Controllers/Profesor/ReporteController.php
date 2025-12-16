<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivityAttempt;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    /**
     * Generar reporte individual de un estudiante
     */
    public function reporteEstudiante($courseId, $studentId)
    {
        $profesor = auth()->user();
        
        // Verificar que el curso pertenece al profesor
        $curso = $profesor->courses()
            ->where('courses.id', $courseId)
            ->where('active', true)
            ->firstOrFail();
        
        // Verificar que el estudiante pertenece al curso
        $estudiante = User::where('id', $studentId)
            ->where('course_id', $curso->id)
            ->where('role', 'estudiante')
            ->firstOrFail();
        
        // Obtener actividades asignadas al curso
        $actividades = Activity::where('professor_id', $profesor->id)
            ->where('active', true)
            ->whereHas('courses', function($query) use ($courseId) {
                $query->where('courses.id', $courseId);
            })
            ->get();
        
        // Procesar cada actividad con los intentos del estudiante
        $actividadesConDatos = $actividades->map(function($actividad) use ($estudiante) {
            $intentos = ActivityAttempt::where('student_id', $estudiante->id)
                ->where('activity_id', $actividad->id)
                ->where('completed', true)
                ->orderBy('completed_at', 'desc')
                ->get();
            
            $mejorIntento = $intentos->sortByDesc('score')->first();
            
            return [
                'title' => $actividad->title,
                'type' => $actividad->type,
                'difficulty' => $actividad->difficulty,
                'total_intentos' => $intentos->count(),
                'mejor_score' => $mejorIntento ? $mejorIntento->score : null,
                'mejor_max_score' => $mejorIntento ? $mejorIntento->max_score : null,
                'mejor_porcentaje' => $mejorIntento && $mejorIntento->max_score > 0 
                    ? round(($mejorIntento->score / $mejorIntento->max_score) * 100, 1) 
                    : null,
                'ultima_fecha' => $mejorIntento ? $mejorIntento->completed_at->format('d/m/Y') : null,
                'completada' => $intentos->count() > 0,
            ];
        });
        
        // Calcular métricas generales
        $actividadesCompletadas = $actividadesConDatos->where('completada', true)->count();
        $totalActividades = $actividadesConDatos->count();
        
        $promedioGeneral = 0;
        $promedioPorcentaje = 0;
        
        $completadas = $actividadesConDatos->where('completada', true);
        if ($completadas->isNotEmpty()) {
            $promedioGeneral = round($completadas->avg('mejor_score'), 1);
            $promedioPorcentaje = round($completadas->avg('mejor_porcentaje'), 1);
        }
        
        $estado = $this->getEstado($promedioPorcentaje, $actividadesCompletadas, $totalActividades);
        
        // Generar PDF
        $pdf = Pdf::loadView('reportes.estudiante', [
            'estudiante' => $estudiante,
            'curso' => $curso,
            'profesor' => $profesor,
            'actividades' => $actividadesConDatos,
            'actividadesCompletadas' => $actividadesCompletadas,
            'totalActividades' => $totalActividades,
            'promedioGeneral' => $promedioGeneral,
            'promedioPorcentaje' => $promedioPorcentaje,
            'estado' => $estado,
            'fecha' => now()->format('d/m/Y'),
        ]);
        
        return $pdf->download("reporte_{$estudiante->name}.pdf");
    }
    
    /**
     * Generar reporte completo de un curso
     */
    public function reporteCurso($courseId)
    {
        $profesor = auth()->user();
        
        // Verificar que el curso pertenece al profesor
        $curso = $profesor->courses()
            ->where('courses.id', $courseId)
            ->where('active', true)
            ->firstOrFail();
        
        // Obtener estudiantes del curso
        $estudiantes = User::where('course_id', $curso->id)
            ->where('role', 'estudiante')
            ->get();
        
        // Obtener actividades asignadas al curso
        $actividades = Activity::where('professor_id', $profesor->id)
            ->where('active', true)
            ->whereHas('courses', function($query) use ($courseId) {
                $query->where('courses.id', $courseId);
            })
            ->get();
        
        // Procesar datos de cada estudiante
        $estudiantesConDatos = $estudiantes->map(function($estudiante) use ($actividades) {
            $totalActividades = $actividades->count();
            
            $actividadesCompletadas = ActivityAttempt::where('student_id', $estudiante->id)
                ->whereIn('activity_id', $actividades->pluck('id'))
                ->where('completed', true)
                ->distinct('activity_id')
                ->count('activity_id');
            
            $intentos = ActivityAttempt::where('student_id', $estudiante->id)
                ->whereIn('activity_id', $actividades->pluck('id'))
                ->where('completed', true)
                ->select('activity_id', 'score', 'max_score')
                ->get()
                ->groupBy('activity_id')
                ->map(function($group) {
                    return $group->sortByDesc('score')->first();
                });
            
            $promedioPuntos = 0;
            $promedioPorcentaje = 0;
            
            if ($intentos->isNotEmpty()) {
                $promedioPuntos = round($intentos->avg('score'), 1);
                
                $porcentajes = $intentos->map(function($intento) {
                    return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
                });
                $promedioPorcentaje = round($porcentajes->avg(), 1);
            }
            
            return [
                'name' => $estudiante->name,
                'email' => $estudiante->email,
                'actividades_completadas' => $actividadesCompletadas,
                'promedio_porcentaje' => $promedioPorcentaje,
                'estado' => $this->getEstado($promedioPorcentaje, $actividadesCompletadas, $totalActividades),
            ];
        });
        
        // Calcular métricas del curso
        $totalEstudiantes = $estudiantes->count();
        $estudiantesActivos = $estudiantesConDatos->where('actividades_completadas', '>', 0)->count();
        $promedioGeneral = $estudiantesConDatos->avg('promedio_porcentaje');
        
        $distribucion = [
            'excelente' => $estudiantesConDatos->filter(fn($e) => $e['promedio_porcentaje'] >= 80)->count(),
            'bien' => $estudiantesConDatos->filter(fn($e) => $e['promedio_porcentaje'] >= 60 && $e['promedio_porcentaje'] < 80)->count(),
            'necesita_apoyo' => $estudiantesConDatos->filter(fn($e) => $e['promedio_porcentaje'] > 0 && $e['promedio_porcentaje'] < 60)->count(),
            'sin_datos' => $estudiantesConDatos->where('actividades_completadas', 0)->count(),
        ];
        
        // Generar PDF
        $pdf = Pdf::loadView('reportes.curso', [
            'curso' => $curso,
            'profesor' => $profesor,
            'estudiantes' => $estudiantesConDatos,
            'totalEstudiantes' => $totalEstudiantes,
            'estudiantesActivos' => $estudiantesActivos,
            'promedioGeneral' => round($promedioGeneral, 1),
            'distribucion' => $distribucion,
            'totalActividades' => $actividades->count(),
            'fecha' => now()->format('d/m/Y'),
        ]);
        
        return $pdf->download("reporte_{$curso->name}.pdf");
    }
    
    /**
     * Determinar el estado del estudiante
     */
    private function getEstado($porcentaje, $completadas, $total)
    {
        if ($completadas === 0) {
            return ['icon' => '🔴', 'text' => 'En riesgo', 'color' => '#dc2626'];
        }
        
        if ($porcentaje >= 80) {
            return ['icon' => '🟢', 'text' => 'Excelente', 'color' => '#16a34a'];
        }
        
        if ($porcentaje >= 60) {
            return ['icon' => '🟡', 'text' => 'Bien', 'color' => '#eab308'];
        }
        
        return ['icon' => '★', 'text' => 'Necesita apoyo', 'color' => '#dc2626'];
    }
}