<?php
/**
 * PRUEBAS DE INTEGRACIÓN: SEGUIMIENTO Y PROGRESO
 * 
 * Test-17: Sistema registra intentos en BD con estructura correcta (3 iteraciones)
 *          - Registro completo con todos los campos
 *          - Campo answers guarda JSON correctamente
 *          - Timestamps se registran correctamente
 * 
 * Test-18: Dashboard carga datos de progreso (2 iteraciones)
 *          - Datos de estudiantes se cargan
 *          - Estadísticas se calculan correctamente
 * 
 * Test-19: Sistema puede generar datos para reportes (2 iteraciones)
 *          - Datos de curso disponibles
 *          - Datos de estudiante disponibles
 * 
 * Total: 7 validaciones
 */

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Activity;
use App\Models\ActivityAttempt;
use Tests\RefreshDatabaseWithMigrations;

class SeguimientoProgresoTest extends TestCase
{
    use RefreshDatabaseWithMigrations;

    /**
     * Test-17: Sistema registra intentos correctamente en BD
     */
    public function test_17_sistema_registra_intentos_correctamente(): void
    {
        $curso = Course::factory()->create();
        $estudiante = User::factory()->create([
            'role' => 'estudiante',
            'course_id' => $curso->id,
        ]);
        
        $profesor = User::factory()->create(['role' => 'profesor']);
        
        $actividad = Activity::factory()->create([
            'professor_id' => $profesor->id,
            'type' => 'discover',
        ]);
        $actividad->courses()->attach($curso->id);
        
        $answersData = [
            'word1' => 'correct',
            'word2' => 'incorrect',
            'word3' => 'correct',
        ];
        
        // Iteración 1: Crear registro completo
        $attempt = ActivityAttempt::create([
            'activity_id' => $actividad->id,
            'student_id' => $estudiante->id,
            'score' => 66,
            'max_score' => 100,
            'time_spent' => 240,
            'answers' => $answersData,
            'completed' => true,
            'completed_at' => now(),
        ]);
        
        $this->assertDatabaseHas('activity_attempts', [
            'activity_id' => $actividad->id,
            'student_id' => $estudiante->id,
            'score' => 66,
        ]);
        
        // Iteración 2: Verificar que answers se guardó como JSON
        $attemptFromDB = ActivityAttempt::find($attempt->id);
        $this->assertIsArray($attemptFromDB->answers);
        $this->assertEquals('correct', $attemptFromDB->answers['word1']);
        
        // Iteración 3: Verificar timestamps
        $this->assertNotNull($attemptFromDB->completed_at);
        $this->assertNotNull($attemptFromDB->created_at);
        $this->assertNotNull($attemptFromDB->updated_at);
    }

    /**
     * Test-18: Dashboard puede cargar datos de progreso
     */
    public function test_18_dashboard_carga_datos_progreso(): void
    {
        $curso = Course::factory()->create();
        
        // Crear 3 estudiantes
        $estudiantes = User::factory()->count(3)->create([
            'role' => 'estudiante',
            'course_id' => $curso->id,
        ]);
        
        $profesor = User::factory()->create(['role' => 'profesor']);
        
        $actividad = Activity::factory()->create([
            'professor_id' => $profesor->id,
            'type' => 'discover',
        ]);
        $actividad->courses()->attach($curso->id);
        
        // Crear intentos para cada estudiante
        foreach ($estudiantes as $estudiante) {
            ActivityAttempt::create([
                'activity_id' => $actividad->id,
                'student_id' => $estudiante->id,
                'score' => rand(60, 100),
                'max_score' => 100,
                'time_spent' => rand(60, 300),
                'answers' => ['test' => 'data'],
                'completed' => true,
                'completed_at' => now(),
            ]);
        }
        
        // Iteración 1: Verificar que hay datos de estudiantes
        $estudiantesConIntentos = User::where('course_id', $curso->id)
            ->whereHas('activityAttempts')
            ->count();
        
        $this->assertEquals(3, $estudiantesConIntentos);
        
        // Iteración 2: Verificar que se pueden calcular estadísticas
        $totalIntentos = ActivityAttempt::where('activity_id', $actividad->id)->count();
        $promedioScore = ActivityAttempt::where('activity_id', $actividad->id)->avg('score');
        
        $this->assertEquals(3, $totalIntentos);
        $this->assertGreaterThan(0, $promedioScore);
    }

    /**
     * Test-19: Sistema genera datos para reportes
     */
    public function test_19_sistema_genera_datos_para_reportes(): void
    {
        $curso = Course::factory()->create(['name' => '3° Básico A']);
        
        $estudiantes = User::factory()->count(2)->create([
            'role' => 'estudiante',
            'course_id' => $curso->id,
        ]);
        
        $profesor = User::factory()->create(['role' => 'profesor']);
        
        $actividades = Activity::factory()->count(2)->create([
            'professor_id' => $profesor->id,
            'type' => 'discover',
        ]);
        
        foreach ($actividades as $actividad) {
            $actividad->courses()->attach($curso->id);
            
            foreach ($estudiantes as $estudiante) {
                ActivityAttempt::create([
                    'activity_id' => $actividad->id,
                    'student_id' => $estudiante->id,
                    'score' => rand(70, 100),
                    'max_score' => 100,
                    'time_spent' => rand(100, 200),
                    'answers' => ['test' => 'data'],
                    'completed' => true,
                    'completed_at' => now(),
                ]);
            }
        }
        
        // Iteración 1: Datos de curso disponibles
        $datosCurso = [
            'nombre' => $curso->name,
            'total_estudiantes' => User::where('course_id', $curso->id)->count(),
            'total_actividades' => Activity::whereHas('courses', function($q) use ($curso) {
                $q->where('courses.id', $curso->id);
            })->count(),
        ];
        
        $this->assertEquals('3° Básico A', $datosCurso['nombre']);
        $this->assertEquals(2, $datosCurso['total_estudiantes']);
        $this->assertEquals(2, $datosCurso['total_actividades']);
        
        // Iteración 2: Datos de estudiante disponibles
        $primerEstudiante = $estudiantes->first();
        $datosEstudiante = [
            'nombre' => $primerEstudiante->name,
            'total_intentos' => ActivityAttempt::where('student_id', $primerEstudiante->id)->count(),
            'promedio' => ActivityAttempt::where('student_id', $primerEstudiante->id)->avg('score'),
        ];
        
        $this->assertEquals(2, $datosEstudiante['total_intentos']);
        $this->assertGreaterThan(0, $datosEstudiante['promedio']);
    }
}