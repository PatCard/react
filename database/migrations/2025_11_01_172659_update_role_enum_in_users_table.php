<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Cambiar el enum para incluir 'admin'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('profesor', 'estudiante', 'admin') NOT NULL DEFAULT 'estudiante'");
    }

    public function down(): void
    {
        // Volver al enum anterior
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('profesor', 'estudiante') NOT NULL DEFAULT 'estudiante'");
    }
};