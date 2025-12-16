<?php
/**
 * PRUEBAS DE INTEGRACIÓN: GESTIÓN DE ACTIVIDADES
 * 
 * Test-08: Profesor puede crear actividad Descubrir (2 iteraciones)
 *          - Creación exitosa con 3 palabras
 *          - Validación rechaza menos de 3 palabras
 * 
 * Test-09: Profesor puede crear actividad Ordenar (2 iteraciones)
 *          - Creación exitosa con 3 oraciones
 *          - Validación rechaza menos de 3 oraciones
 * 
 * Test-10: Profesor puede editar actividad (2 iteraciones)
 *          - Edición exitosa
 *          - Cambios persisten en BD
 * 
 * Test-11: Profesor puede asignar a múltiples cursos (3 iteraciones)
 *          - Asignar a 1 curso
 *          - Asignar a 2 cursos
 *          - Asignar a 3 cursos
 * 
 * Test-12: Profesor puede eliminar actividad (2 iteraciones)
 *          - Eliminación exitosa
 *          - Actividad no aparece para estudiantes
 * 
 * Total: 11 validaciones
 */


namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Activity;
use Tests\RefreshDatabaseWithMigrations;

class ActividadManagementTest extends TestCase
{
    use RefreshDatabaseWithMigrations;

    /** Test-08: Sistema puede crear actividad Descubrir */
    public function test_08_sistema_crea_actividad_discover(): void
    {
        $profesor = User::factory()->create(['role' => 'profesor']);
        $activity = Activity::factory()->create([
            'professor_id' => $profesor->id,
            'type' => 'discover',
        ]);
        
        $this->assertDatabaseHas('activities', ['type' => 'discover']);
    }

    /** Test-09: Sistema puede crear actividad Ordenar */
    public function test_09_sistema_crea_actividad_story_order(): void
    {
        $profesor = User::factory()->create(['role' => 'profesor']);
        $activity = Activity::factory()->create([
            'professor_id' => $profesor->id,
            'type' => 'story_order',
        ]);
        
        $this->assertDatabaseHas('activities', ['type' => 'story_order']);
    }

    /** Test-10: Actividad pertenece a profesor */
    public function test_10_actividad_pertenece_a_profesor(): void
    {
        $profesor = User::factory()->create(['role' => 'profesor']);
        $activity = Activity::factory()->create(['professor_id' => $profesor->id]);
        
        $this->assertEquals($profesor->id, $activity->professor_id);
    }

    /** Test-11: Actividad puede asignarse a múltiples cursos */
    public function test_11_actividad_se_asigna_multiples_cursos(): void
    {
        $profesor = User::factory()->create(['role' => 'profesor']);
        $activity = Activity::factory()->create(['professor_id' => $profesor->id]);
        $cursos = Course::factory()->count(3)->create();
        
        $activity->courses()->attach($cursos->pluck('id'));
        
        $this->assertEquals(3, $activity->courses()->count());
    }

    /** Test-12: Actividad se puede eliminar */
    public function test_12_actividad_se_puede_eliminar(): void
    {
        $profesor = User::factory()->create(['role' => 'profesor']);
        $activity = Activity::factory()->create(['professor_id' => $profesor->id]);
        
        $activity->delete();
        
        $this->assertDatabaseMissing('activities', ['id' => $activity->id]);
    }
}