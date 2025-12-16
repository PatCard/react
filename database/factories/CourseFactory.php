<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                '3° Básico A',
                '3° Básico B',
                '4° Básico A',
                '4° Básico B',
            ]),
            'level' => fake()->randomElement(['3° Básico', '4° Básico']), //'professor_id' => null, // Debe asignarse manualmente si es necesario
            'section' => fake()->randomElement(['A', 'B']),
            'year' => 2025,
        ];
    }
}