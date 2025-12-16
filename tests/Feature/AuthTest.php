<?php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use Tests\RefreshDatabaseWithMigrations;

class AuthTest extends TestCase
{
    use RefreshDatabaseWithMigrations;

    /** Test-06: Sistema permite crear usuarios */
    public function test_06_sistema_crea_usuarios(): void
    {
        $user = User::factory()->create(['role' => 'profesor']);
        $this->assertDatabaseHas('users', ['role' => 'profesor']);
    }


    /** Test-07: Roles están correctos */
    public function test_07_roles_validos(): void
    {
        User::factory()->create(['role' => 'admin']);
        User::factory()->create(['role' => 'profesor']);
        $this->assertDatabaseCount('users', 2);
    }
}