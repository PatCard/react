<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professor_id')->constrained('users')->onDelete('cascade');
            $table->string('title'); // Ej: "Encuentra las palabras del cuento"
            $table->enum('type', ['discover', 'story_order', 'error_hunter', 'story_creator'])->default('discover');
            $table->enum('difficulty', ['easy', 'medium', 'hard']);
            $table->text('content'); // El texto completo
            $table->json('config'); // Palabras, definiciones, configuración
            $table->boolean('active')->default(true);
            $table->dateTime('due_date')->nullable();
            $table->timestamps();
        });

        // Tabla pivot para asignar actividades a múltiples cursos
        Schema::create('activity_course', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['activity_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_course');
        Schema::dropIfExists('activities');
    }
};