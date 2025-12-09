<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Activity;
use App\Models\ActivityAttempt;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $profesor = auth()->user();
        
        // Obtener cursos del profesor
        $cursos = $profesor->courses()
            ->where('active', true)
            ->withCount('students')
            ->get();
        
        // Total de estudiantes en todos los cursos del profesor
        $totalEstudiantes = $cursos->sum('students_count');
        
        // Total de actividades activas del profesor
        $actividadesActivas = Activity::where('professor_id', $profesor->id)
            ->where('active', true)
            ->count();
        
        // IDs de todos los estudiantes de los cursos del profesor
        $estudiantesIds = User::whereIn('course_id', $cursos->pluck('id'))
            ->where('role', 'estudiante')
            ->pluck('id');
        
        // Calcular promedio general de todos los estudiantes (puntos y porcentaje)
        $promedioGeneralPuntos = 0;
        $promedioGeneralPorcentaje = 0;
        if ($estudiantesIds->isNotEmpty()) {
            // Obtener el mejor intento de cada estudiante por actividad
            $intentos = ActivityAttempt::whereIn('student_id', $estudiantesIds)
                ->where('completed', true)
                ->select('student_id', 'activity_id', 'score', 'max_score')
                ->get()
                ->groupBy(function($item) {
                    return $item->student_id . '-' . $item->activity_id;
                })
                ->map(function($group) {
                    // Obtener el mejor intento del grupo
                    return $group->sortByDesc('score')->first();
                });
            
            if ($intentos->isNotEmpty()) {
                // Promedio en puntos
                $promedioGeneralPuntos = round($intentos->avg('score'), 1);
                
                // Promedio en porcentaje
                $porcentajes = $intentos->map(function($intento) {
                    return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
                });
                $promedioGeneralPorcentaje = round($porcentajes->avg(), 1);
            }
        }
        
        // Datos por curso
        $cursosConDatos = $cursos->map(function ($curso) {
            // Estudiantes del curso
            $estudiantes = User::where('course_id', $curso->id)
                ->where('role', 'estudiante')
                ->get();
            
            $estudiantesIds = $estudiantes->pluck('id');
            
            // Estudiantes activos (con al menos 1 intento)
            $estudiantesActivos = ActivityAttempt::whereIn('student_id', $estudiantesIds)
                ->distinct('student_id')
                ->count('student_id');
            
            // Promedio del curso (puntos y porcentaje)
            $promedioCursoPuntos = 0;
            $promedioCursoPorcentaje = 0;
            if ($estudiantesIds->isNotEmpty()) {
                $intentos = ActivityAttempt::whereIn('student_id', $estudiantesIds)
                    ->where('completed', true)
                    ->select('student_id', 'activity_id', 'score', 'max_score')
                    ->get()
                    ->groupBy(function($item) {
                        return $item->student_id . '-' . $item->activity_id;
                    })
                    ->map(function($group) {
                        return $group->sortByDesc('score')->first();
                    });
                
                if ($intentos->isNotEmpty()) {
                    // Promedio en puntos
                    $promedioCursoPuntos = round($intentos->avg('score'), 1);
                    
                    // Promedio en porcentaje
                    $porcentajes = $intentos->map(function($intento) {
                        return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
                    });
                    $promedioCursoPorcentaje = round($porcentajes->avg(), 1);
                }
            }
            
            return [
                'id' => $curso->id,
                'name' => $curso->name,
                'total_estudiantes' => $estudiantes->count(),
                'estudiantes_activos' => $estudiantesActivos,
                'promedio_puntos' => $promedioCursoPuntos,
                'promedio_porcentaje' => $promedioCursoPorcentaje,
            ];
        });
        
        return Inertia::render('Profesor/Dashboard', [
            'totalEstudiantes' => $totalEstudiantes,
            'actividadesActivas' => $actividadesActivas,
            'promedioGeneralPuntos' => $promedioGeneralPuntos,
            'promedioGeneralPorcentaje' => $promedioGeneralPorcentaje,
            'cursos' => $cursosConDatos,
        ]);
    }

    /**
     * Mostrar detalle de un curso específico
     */
    public function showCourse($courseId)
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
            // Total de actividades asignadas
            $totalActividades = $actividades->count();
            
            // Actividades completadas (al menos 1 intento completado)
            $actividadesCompletadas = ActivityAttempt::where('student_id', $estudiante->id)
                ->whereIn('activity_id', $actividades->pluck('id'))
                ->where('completed', true)
                ->distinct('activity_id')
                ->count('activity_id');
            
            // Mejor intento de cada actividad
            $intentos = ActivityAttempt::where('student_id', $estudiante->id)
                ->whereIn('activity_id', $actividades->pluck('id'))
                ->where('completed', true)
                ->select('activity_id', 'score', 'max_score', 'completed_at')
                ->get()
                ->groupBy('activity_id')
                ->map(function($group) {
                    return $group->sortByDesc('score')->first();
                });
            
            // Calcular promedio
            $promedioPuntos = 0;
            $promedioPorcentaje = 0;
            
            if ($intentos->isNotEmpty()) {
                $promedioPuntos = round($intentos->avg('score'), 1);
                
                $porcentajes = $intentos->map(function($intento) {
                    return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
                });
                $promedioPorcentaje = round($porcentajes->avg(), 1);
            }
            
            // Última actividad
            $ultimaActividad = ActivityAttempt::where('student_id', $estudiante->id)
                ->whereIn('activity_id', $actividades->pluck('id'))
                ->where('completed', true)
                ->orderBy('completed_at', 'desc')
                ->first();
            
            return [
                'id' => $estudiante->id,
                'name' => $estudiante->name,
                'email' => $estudiante->email,
                'total_actividades' => $totalActividades,
                'actividades_completadas' => $actividadesCompletadas,
                'promedio_puntos' => $promedioPuntos,
                'promedio_porcentaje' => $promedioPorcentaje,
                'ultima_actividad' => $ultimaActividad ? $ultimaActividad->completed_at->diffForHumans() : null,
            ];
        });
        
        return Inertia::render('Profesor/CursoDetalle', [
            'curso' => $curso,
            'estudiantes' => $estudiantesConDatos,
            'totalActividades' => $actividades->count(),
        ]);
    }

    /**
     * Mostrar detalle de un estudiante específico
     */
    public function showStudent($courseId, $studentId)
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
            // Todos los intentos del estudiante en esta actividad
            $intentos = ActivityAttempt::where('student_id', $estudiante->id)
                ->where('activity_id', $actividad->id)
                ->where('completed', true)
                ->orderBy('completed_at', 'desc')
                ->get();
            
            // Mejor intento
            $mejorIntento = $intentos->sortByDesc('score')->first();
            
            return [
                'id' => $actividad->id,
                'title' => $actividad->title,
                'difficulty' => $actividad->difficulty,
                'total_intentos' => $intentos->count(),
                'mejor_score' => $mejorIntento ? $mejorIntento->score : null,
                'mejor_max_score' => $mejorIntento ? $mejorIntento->max_score : null,
                'mejor_porcentaje' => $mejorIntento && $mejorIntento->max_score > 0 
                    ? round(($mejorIntento->score / $mejorIntento->max_score) * 100, 1) 
                    : null,
                'ultima_fecha' => $mejorIntento ? $mejorIntento->completed_at->diffForHumans() : null,
                'completada' => $intentos->count() > 0,
            ];
        });
        
        // Calcular métricas generales del estudiante
        $actividadesCompletadas = $actividadesConDatos->where('completada', true)->count();
        $totalActividades = $actividadesConDatos->count();
        
        $promedioGeneral = 0;
        $promedioPorcentaje = 0;
        
        $completadas = $actividadesConDatos->where('completada', true);
        if ($completadas->isNotEmpty()) {
            $promedioGeneral = round($completadas->avg('mejor_score'), 1);
            $promedioPorcentaje = round($completadas->avg('mejor_porcentaje'), 1);
        }
        
        // Última actividad realizada
        $ultimaActividad = ActivityAttempt::where('student_id', $estudiante->id)
            ->whereIn('activity_id', $actividades->pluck('id'))
            ->where('completed', true)
            ->orderBy('completed_at', 'desc')
            ->first();
        
        return Inertia::render('Profesor/EstudianteDetalle', [
            'curso' => $curso,
            'estudiante' => [
                'id' => $estudiante->id,
                'name' => $estudiante->name,
                'email' => $estudiante->email,
            ],
            'actividades' => $actividadesConDatos,
            'metricas' => [
                'actividades_completadas' => $actividadesCompletadas,
                'total_actividades' => $totalActividades,
                'promedio_puntos' => $promedioGeneral,
                'promedio_porcentaje' => $promedioPorcentaje,
                'ultima_actividad' => $ultimaActividad ? $ultimaActividad->completed_at->diffForHumans() : null,
                'progreso_porcentaje' => $totalActividades > 0 
                    ? round(($actividadesCompletadas / $totalActividades) * 100) 
                    : 0,
            ],
        ]);
    }

    /**
     * Vista de progreso con gráficos
     */
    public function progreso(Request $request)
    {
        $profesor = auth()->user();
        
        // Obtener cursos del profesor
        $cursos = $profesor->courses()
            ->where('active', true)
            ->get();
        
        // IDs de todos los estudiantes de los cursos del profesor
        $estudiantesIds = User::whereIn('course_id', $cursos->pluck('id'))
            ->where('role', 'estudiante')
            ->pluck('id');
        
        // === TAB 1: VISTA GENERAL ===
        
        // Distribución de rendimiento
        $distribucion = [
            'excelente' => 0,
            'bien' => 0,
            'necesita_apoyo' => 0,
            'sin_datos' => 0,
        ];
        
        if ($estudiantesIds->isNotEmpty()) {
            foreach ($estudiantesIds as $estudianteId) {
                $intentos = ActivityAttempt::where('student_id', $estudianteId)
                    ->where('completed', true)
                    ->select('activity_id', 'score', 'max_score')
                    ->get()
                    ->groupBy('activity_id')
                    ->map(function($group) {
                        return $group->sortByDesc('score')->first();
                    });
                
                if ($intentos->isEmpty()) {
                    $distribucion['sin_datos']++;
                    continue;
                }
                
                $porcentajes = $intentos->map(function($intento) {
                    return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
                });
                $promedio = $porcentajes->avg();
                
                if ($promedio >= 80) {
                    $distribucion['excelente']++;
                } elseif ($promedio >= 60) {
                    $distribucion['bien']++;
                } else {
                    $distribucion['necesita_apoyo']++;
                }
            }
        }
        
        // Participación por curso
        $participacionPorCurso = $cursos->map(function($curso) {
            $totalEstudiantes = User::where('course_id', $curso->id)
                ->where('role', 'estudiante')
                ->count();
            
            $estudiantesActivos = 0;
            if ($totalEstudiantes > 0) {
                $estudiantesIds = User::where('course_id', $curso->id)
                    ->where('role', 'estudiante')
                    ->pluck('id');
                
                $estudiantesActivos = ActivityAttempt::whereIn('student_id', $estudiantesIds)
                    ->distinct('student_id')
                    ->count('student_id');
            }
            
            $porcentaje = $totalEstudiantes > 0 
                ? round(($estudiantesActivos / $totalEstudiantes) * 100) 
                : 0;
            
            return [
                'id' => $curso->id,
                'name' => $curso->name,
                'total' => $totalEstudiantes,
                'activos' => $estudiantesActivos,
                'porcentaje' => $porcentaje,
            ];
        });
        
        // Rendimiento por tipo de actividad
        $rendimientoPorTipo = [];

        // Calcular tiempos para Discover
        $discoverTiempos = ActivityAttempt::whereIn('student_id', $estudiantesIds)
            ->whereHas('activity', function($query) {
                $query->where('type', 'discover');
            })
            ->where('completed', true)
            ->avg('time_spent');

        $tiempoPromedioPorTipo['discover'] = $discoverTiempos ? round($discoverTiempos) : 0;

        // Calcular para Story Order
        $storyOrderTiempos = ActivityAttempt::whereIn('student_id', $estudiantesIds)
            ->whereHas('activity', function($query) {
                $query->where('type', 'story_order');
            })
            ->where('completed', true)
            ->avg('time_spent');

        $tiempoPromedioPorTipo['story_order'] = $storyOrderTiempos ? round($storyOrderTiempos) : 0;        

        // Calcular intentos para Discover
        $discoverAttempts = ActivityAttempt::whereIn('student_id', $estudiantesIds)
            ->whereHas('activity', function($query) {
                $query->where('type', 'discover');
            })
            ->where('completed', true)
            ->select('activity_id', 'student_id', 'score', 'max_score')
            ->get()
            ->groupBy(function($item) {
                return $item->student_id . '-' . $item->activity_id;
            })
            ->map(function($group) {
                return $group->sortByDesc('score')->first();
            });

        if ($discoverAttempts->isNotEmpty()) {
            $discoverPorcentajes = $discoverAttempts->map(function($intento) {
                return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
            });
            $rendimientoPorTipo['discover'] = round($discoverPorcentajes->avg(), 1);
        } else {
            $rendimientoPorTipo['discover'] = 0;
        }

        // Calcular para Story Order
        $storyOrderAttempts = ActivityAttempt::whereIn('student_id', $estudiantesIds)
            ->whereHas('activity', function($query) {
                $query->where('type', 'story_order');
            })
            ->where('completed', true)
            ->select('activity_id', 'student_id', 'score', 'max_score')
            ->get()
            ->groupBy(function($item) {
                return $item->student_id . '-' . $item->activity_id;
            })
            ->map(function($group) {
                return $group->sortByDesc('score')->first();
            });

        if ($storyOrderAttempts->isNotEmpty()) {
            $storyOrderPorcentajes = $storyOrderAttempts->map(function($intento) {
                return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
            });
            $rendimientoPorTipo['story_order'] = round($storyOrderPorcentajes->avg(), 1);
        } else {
            $rendimientoPorTipo['story_order'] = 0;
        }
        
        // === TAB 2: POR CURSO ===
        
        $cursoSeleccionado = $request->input('curso_id', $cursos->first()->id ?? null);
        $datosPorCurso = null;
        
        if ($cursoSeleccionado) {
            $curso = $cursos->firstWhere('id', $cursoSeleccionado);
            
            if ($curso) {
                $estudiantesCurso = User::where('course_id', $curso->id)
                    ->where('role', 'estudiante')
                    ->get();
                
                $actividadesCurso = Activity::where('professor_id', $profesor->id)
                    ->where('active', true)
                    ->whereHas('courses', function($query) use ($cursoSeleccionado) {
                        $query->where('courses.id', $cursoSeleccionado);
                    })
                    ->count();
                
                $datosEstudiantes = $estudiantesCurso->map(function($estudiante) use ($actividadesCurso) {
                    // Obtener los mejores intentos por actividad
                    $intentos = ActivityAttempt::where('student_id', $estudiante->id)
                        ->where('completed', true)
                        ->with('activity:id,type,config')
                        ->select('activity_id', 'student_id', 'score', 'max_score', 'answers')
                        ->get()
                        ->groupBy('activity_id')
                        ->map(function($group) {
                            return $group->sortByDesc('score')->first();
                        });
                    
                    $completadas = $intentos->count();
                    $progreso = $actividadesCurso > 0 ? round(($completadas / $actividadesCurso) * 100) : 0;
                    
                    $promedio = 0;
                    if ($intentos->isNotEmpty()) {
                        $porcentajes = $intentos->map(function($intento) {
                            return $intento->max_score > 0 ? ($intento->score / $intento->max_score) * 100 : 0;
                        });
                        $promedio = round($porcentajes->avg(), 1);
                    }
                    
                    // NUEVO: Calcular aciertos y errores por tipo
                    $aciertosDiscover = 0;
                    $erroresDiscover = 0;
                    $aciertosStoryOrder = 0;
                    $erroresStoryOrder = 0;
                    
                    foreach ($intentos as $intento) {
                        if (!$intento->activity) continue;
                        
                        $answers = $intento->answers;
                        
                        if ($intento->activity->type === 'discover') {
                            $aciertos = $answers['correct_matches'] ?? 0;
                            $totalPalabras = count($intento->activity->config['words'] ?? []);
                            $errores = $totalPalabras - $aciertos;
                            
                            $aciertosDiscover += $aciertos;
                            $erroresDiscover += $errores;
                            
                        } elseif ($intento->activity->type === 'story_order') {
                            $aciertos = $answers['correct_count'] ?? 0;
                            $total = $answers['total'] ?? 0;
                            $errores = $total - $aciertos;
                            
                            $aciertosStoryOrder += $aciertos;
                            $erroresStoryOrder += $errores;
                        }
                    }
                    
                    return [
                        'id' => $estudiante->id,
                        'name' => $estudiante->name,
                        'progreso' => $progreso,
                        'promedio' => $promedio,
                        'aciertos_discover' => $aciertosDiscover,
                        'errores_discover' => $erroresDiscover,
                        'aciertos_story_order' => $aciertosStoryOrder,
                        'errores_story_order' => $erroresStoryOrder,
                    ];
                });

                // Calcular tiempo promedio del curso (simplificado)
                $estudiantesIdsCurso = $estudiantesCurso->pluck('id');

                // Obtener IDs de actividades del curso
                $actividadesIdsCurso = Activity::where('professor_id', $profesor->id)
                    ->where('active', true)
                    ->whereHas('courses', function($query) use ($cursoSeleccionado) {
                        $query->where('courses.id', $cursoSeleccionado);
                    })
                    ->pluck('id');

                // Calcular promedio de tiempo
                $tiempoPromedioCurso = ActivityAttempt::whereIn('student_id', $estudiantesIdsCurso)
                    ->whereIn('activity_id', $actividadesIdsCurso)
                    ->where('completed', true)
                    ->avg('time_spent');

                $datosPorCurso = [
                    'estudiantes' => $datosEstudiantes,
                    'total_actividades' => $actividadesCurso,
                    'tiempo_promedio' => $tiempoPromedioCurso ? round($tiempoPromedioCurso) : 0,
                ];
            }
        }
        
        // === TAB 3: INDIVIDUAL ===
        
        $estudianteSeleccionado = $request->input('estudiante_id');
        \Log::info('🔍 Estudiante seleccionado:', ['id' => $estudianteSeleccionado]); //Sacarlo despues que se me olvidan los log

        $datosIndividuales = null;
        
        if ($estudianteSeleccionado) {
            $estudiante = User::where('id', $estudianteSeleccionado)
                ->where('role', 'estudiante')
                ->whereIn('course_id', $cursos->pluck('id'))
                ->first();
            
            if ($estudiante) {
                $actividadesEstudiante = Activity::where('professor_id', $profesor->id)
                    ->where('active', true)
                    ->whereHas('courses', function($query) use ($estudiante) {
                        $query->where('courses.id', $estudiante->course_id);
                    })
                    ->get();
                
                $evolucion = ActivityAttempt::where('student_id', $estudiante->id)
                    ->where('completed', true)
                    ->orderBy('completed_at', 'asc')
                    ->get()
                    ->map(function($intento, $index) {
                        $porcentaje = $intento->max_score > 0 
                            ? round(($intento->score / $intento->max_score) * 100, 1) 
                            : 0;
                        
                        return [
                            'intento' => $index + 1,
                            'porcentaje' => $porcentaje,
                            'fecha' => $intento->completed_at->format('d/m'),
                        ];
                    });

                // Calcular tiempo promedio del estudiante
                $tiempoPromedioEstudiante = ActivityAttempt::where('student_id', $estudiante->id)
                    ->where('completed', true)
                    ->avg('time_spent');
                
                // Evolución del tiempo
                $evolucionTiempo = ActivityAttempt::where('student_id', $estudiante->id)
                    ->where('completed', true)
                    ->orderBy('completed_at', 'asc')
                    ->get()
                    ->map(function($intento, $index) {
                        return [
                            'intento' => $index + 1,
                            'tiempo' => $intento->time_spent,
                            'fecha' => $intento->completed_at->format('d/m'),
                        ];
                    });
                
                $datosIndividuales = [
                    'estudiante' => [
                        'id' => $estudiante->id,
                        'name' => $estudiante->name,
                    ],
                    'evolucion' => $evolucion,
                    'tiempo_promedio' => $tiempoPromedioEstudiante ? round($tiempoPromedioEstudiante) : 0, 
                    'evolucion_tiempo' => $evolucionTiempo, 
                ];
            }
        }
        
        // Lista de estudiantes para selector
        $todosEstudiantes = User::whereIn('course_id', $cursos->pluck('id'))
            ->where('role', 'estudiante')
            ->select('id', 'name', 'course_id')
            ->with('course:id,name')
            ->orderBy('name')
            ->get()
            ->map(function($estudiante) {
                return [
                    'id' => $estudiante->id,
                    'name' => $estudiante->name,
                    'course_id' => $estudiante->course_id, 
                    'curso' => $estudiante->course->name ?? '',
                ];
            });
        
        return Inertia::render('Profesor/Progreso', [
            // Tab 1
            'distribucion' => $distribucion,
            'participacion' => $participacionPorCurso,
            'totalEstudiantes' => $estudiantesIds->count(),
            'rendimientoPorTipo' => $rendimientoPorTipo,
            'tiempoPromedioPorTipo' => $tiempoPromedioPorTipo,
            
            // Tab 2
            'cursos' => $cursos->map(fn($c) => ['id' => $c->id, 'name' => $c->name]),
            'cursoSeleccionado' => $cursoSeleccionado,
            'datosPorCurso' => $datosPorCurso,
            
            // Tab 3
            'todosEstudiantes' => $todosEstudiantes,
            'estudianteSeleccionado' => $estudianteSeleccionado,
            'datosIndividuales' => $datosIndividuales,
        ]);
    }


}