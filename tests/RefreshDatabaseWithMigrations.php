<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;

trait RefreshDatabaseWithMigrations
{
    use RefreshDatabase;

    protected function refreshTestDatabase()
    {
        if (! $this->usingInMemoryDatabase()) {
            $this->artisan('migrate:fresh');
            return;
        }

        // Para SQLite en memoria, ejecutar TODAS las migraciones manualmente
        Artisan::call('migrate:fresh', ['--drop-views' => true, '--drop-types' => true]);
    }
}