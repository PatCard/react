<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->integer('score')->default(0); // Puntaje obtenido
            $table->integer('max_score'); // Puntaje máximo posible
            $table->integer('time_spent')->nullable(); // Tiempo en segundos
            $table->json('answers'); // Respuestas del estudiante
            $table->boolean('completed')->default(false);
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
            
            // Índice para buscar intentos rápidamente
            $table->index(['activity_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_attempts');
    }
};