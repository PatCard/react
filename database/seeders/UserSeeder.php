<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Profesor de prueba
        User::create([
            'name' => 'Silvia Moraga',
            'email' => 'smoraga@colegio.cl',
            'password' => Hash::make('password'),
            'role' => 'profesor',
        ]);

        // Estudiante de prueba
        User::create([
            'name' => 'Juan Rivas',
            'email' => 'jrivas@colegio.cl',
            'password' => Hash::make('password'),
            'role' => 'estudiante',
        ]);
    }
}