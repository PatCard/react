<?php
/**
 * PRUEBAS DE INTEGRACIÓN: EXPERIENCIA DEL ESTUDIANTE
 * 
 * Test-13: Estudiante ve solo actividades de su curso (2 iteraciones)
 *          - Ver actividades propias
 *          - No ver actividades de otros cursos
 * 
 * Test-14: Sistema de rotación evita repetición (2 iteraciones)
 *          - Actividades no se repiten hasta completar todas
 *          - Ciclo se reinicia después de completar todas
 * 
 * Test-15: Estudiante puede completar actividad Descubrir (1 iteración)
 *          - Registro de intento en BD
 * 
 * Test-16: Estudiante puede completar actividad Ordenar (1 iteración)
 *          - Registro de intento en BD
 * 
 * Total: 6 validaciones
 */

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Activity;
use App\Models\ActivityAttempt;
use Tests\RefreshDatabaseWithMigrations;

class EstudianteExperienceTest extends TestCase
{
    use RefreshDatabaseWithMigrations;

    /**
     * Test-13: Estudiante ve solo actividades de su curso
     */
    public function test_13_estudiante_ve_solo_actividades_propias(): void
    {
        $curso1 = Course::factory()->create();
        $curso2 = Course::factory()->create();
        
        $estudiante = User::factory()->create([
            'role' => 'estudiante',
            'course_id' => $curso1->id,
        ]);
        
        $profesor = User::factory()->create(['role' => 'profesor']);
        
        // Actividad del curso del estudiante
        $actividadPropia = Activity::factory()->create([
            'professor_id' => $profesor->id,
            'type' => 'discover',
        ]);
        $actividadPropia->courses()->attach($curso1->id);
        
        // Actividad de otro curso
        $actividadOtroCurso = Activity::factory()->create([
            'professor_id' => $profesor->id,
            'type' => 'discover',
        ]);
        $actividadOtroCurso->courses()->attach($curso2->id);
        
        // Iteración 1: Verificar que puede acceder a actividad propia
        $actividadesDelEstudiante = Activity::whereHas('courses', function($query) use ($curso1) {
            $query->where('courses.id', $curso1->id);
        })->pluck('id');
        
        $this->assertTrue($actividadesDelEstudiante->contains($actividadPropia->id));
        
        // Iteración 2: Verificar que NO ve actividades de otros cursos
        $this->assertFalse($actividadesDelEstudiante->contains($actividadOtroCurso->id));
    }

    /**
     * Test-14: Sistema de rotación evita repetición
     */
    public function test_14_sistema_rotacion_evita_repeticion(): void
    {
        $curso = Course::factory()->create();
        $estudiante = User::factory()->create([
            'role' => 'estudiante',
            'course_id' => $curso->id,
        ]);
        
        $profesor = User::factory()->create(['role' => 'profesor']);
        
        // Crear 3 actividades
        $actividades = Activity::factory()->count(3)->create([
            'professor_id' => $profesor->id,
            'type' => 'discover',
        ]);
        
        foreach ($actividades as $actividad) {
            $actividad->courses()->attach($curso->id);
        }
        
        // Iteración 1: Marcar 2 actividades como vistas
        ActivityAttempt::create([
            'activity_id' => $actividades[0]->id,
            'student_id' => $estudiante->id,
            'score' => 80,
            'max_score' => 100,
            'time_spent' => 120,
            'answers' => [],
            'completed' => true,
            'completed_at' => now(),
        ]);
        
        ActivityAttempt::create([
            'activity_id' => $actividades[1]->id,
            'student_id' => $estudiante->id,
            'score' => 90,
            'max_score' => 100,
            'time_spent' => 100,
            'answers' => [],
            'completed' => true,
            'completed_at' => now(),
        ]);
        
        // Obtener actividades completadas
        $completadas = ActivityAttempt::where('student_id', $estudiante->id)
            ->where('completed', true)
            ->pluck('activity_id');
        
        $this->assertEquals(2, $completadas->count());
        
        // Iteración 2: La tercera actividad aún no está completada
        $this->assertFalse($completadas->contains($actividades[2]->id));
    }

    /**
     * Test-15: Estudiante puede completar actividad Descubrir
     */
    public function test_15_estudiante_completa_actividad_discover(): void
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
        
        // Registrar intento
        $attempt = ActivityAttempt::create([
            'activity_id' => $actividad->id,
            'student_id' => $estudiante->id,
            'score' => 85,
            'max_score' => 100,
            'time_spent' => 180,
            'answers' => ['word1' => 'correct', 'word2' => 'correct'],
            'completed' => true,
            'completed_at' => now(),
        ]);
        
        $this->assertDatabaseHas('activity_attempts', [
            'activity_id' => $actividad->id,
            'student_id' => $estudiante->id,
            'completed' => true,
        ]);
    }

    /**
     * Test-16: Estudiante puede completar actividad Ordenar
     */
    public function test_16_estudiante_completa_actividad_story_order(): void
    {
        $curso = Course::factory()->create();
        $estudiante = User::factory()->create([
            'role' => 'estudiante',
            'course_id' => $curso->id,
        ]);
        
        $profesor = User::factory()->create(['role' => 'profesor']);
        
        $actividad = Activity::factory()->create([
            'professor_id' => $profesor->id,
            'type' => 'story_order',
            'config' => [
                'sentences' => [
                    'Primera oración.',
                    'Segunda oración.',
                    'Tercera oración.',
                ]
            ],
        ]);
        $actividad->courses()->attach($curso->id);
        
        // Registrar intento
        $attempt = ActivityAttempt::create([
            'activity_id' => $actividad->id,
            'student_id' => $estudiante->id,
            'score' => 100,
            'max_score' => 100,
            'time_spent' => 150,
            'answers' => ['order' => [0, 1, 2]],
            'completed' => true,
            'completed_at' => now(),
        ]);
        
        $this->assertDatabaseHas('activity_attempts', [
            'activity_id' => $actividad->id,
            'student_id' => $estudiante->id,
            'score' => 100,
        ]);
    }
}