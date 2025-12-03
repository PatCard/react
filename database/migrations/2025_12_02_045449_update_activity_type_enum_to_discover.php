<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Primero modificar el enum para incluir ambos valores temporalmente
        DB::statement("ALTER TABLE activities MODIFY COLUMN type ENUM('word_detective','discover','story_order','error_hunter','story_creator') NOT NULL");
        
        // Actualizar los registros existentes
        DB::statement("UPDATE activities SET type = 'discover' WHERE type = 'word_detective'");
        
        // Finalmente, remover 'word_detective' del enum
        DB::statement("ALTER TABLE activities MODIFY COLUMN type ENUM('discover','story_order','error_hunter','story_creator') NOT NULL");
    }

    public function down(): void
    {
        // Primero modificar el enum para incluir ambos valores temporalmente
        DB::statement("ALTER TABLE activities MODIFY COLUMN type ENUM('word_detective','discover','story_order','error_hunter','story_creator') NOT NULL");
        
        // Revertir los registros
        DB::statement("UPDATE activities SET type = 'word_detective' WHERE type = 'discover'");
        
        // Finalmente, remover 'discover' del enum
        DB::statement("ALTER TABLE activities MODIFY COLUMN type ENUM('word_detective','story_order','error_hunter','story_creator') NOT NULL");
    }
};