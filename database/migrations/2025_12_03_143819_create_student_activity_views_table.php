<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_activity_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->string('activity_type'); // 'discover', 'story_order', etc.
            $table->timestamp('viewed_at');
            $table->timestamps();
            
            // Índices para búsquedas rápidas
            $table->index(['student_id', 'activity_type']);
            $table->index(['student_id', 'activity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_activity_views');
    }
};