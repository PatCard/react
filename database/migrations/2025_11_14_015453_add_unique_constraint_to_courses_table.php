<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Índice único compuesto: no puede haber dos cursos con el mismo level, section y year
            $table->unique(['level', 'section', 'year'], 'courses_level_section_year_unique');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropUnique('courses_level_section_year_unique');
        });
    }
};