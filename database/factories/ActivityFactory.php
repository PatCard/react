<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'type' => 'discover',
            'difficulty' => fake()->randomElement(['easy', 'medium', 'hard']),
            'content' => fake()->paragraph(),
            'config' => [
                'words' => [
                    ['word' => 'perro', 'definition' => 'Animal doméstico'],
                    ['word' => 'gato', 'definition' => 'Felino pequeño'],
                    ['word' => 'casa', 'definition' => 'Lugar donde vives'],
                ]
            ],
            'professor_id' => null, // Debe asignarse manualmente
        ];
    }
}