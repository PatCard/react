<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'professor_id',
        'title',
        'type',
        'difficulty',
        'content',
        'config',
        'active',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'config' => 'array',
            'active' => 'boolean',
            'due_date' => 'datetime',
        ];
    }

    /**
     * Relación: Actividad pertenece a un profesor
     */
    public function professor()
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    /**
     * Relación: Actividad puede estar asignada a múltiples cursos
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'activity_course');
    }

    /**
     * Relación: Actividad tiene múltiples intentos de estudiantes
     */
    public function attempts()
    {
        return $this->hasMany(ActivityAttempt::class);
    }

    /**
     * Scope: Solo actividades activas
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope: Actividades por tipo
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}