<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('course_id')->nullable()->after('role')->constrained()->onDelete('set null');
            $table->string('student_code', 6)->nullable()->unique()->after('course_id'); // Código de 6 caracteres
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn(['course_id', 'student_code']);
        });
    }
};