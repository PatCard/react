<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'student_id',
        'score',
        'max_score',
        'time_spent',
        'answers',
        'completed',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Relación: Intento pertenece a una actividad
     */
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Relación: Intento pertenece a un estudiante
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Obtener el porcentaje del intento
     */
    public function getPercentageAttribute()
    {
        if ($this->max_score === 0) {
            return 0;
        }
        return round(($this->score / $this->max_score) * 100);
    }

    /**
     * Obtener las estrellas según el puntaje
     */
    public function getStarsAttribute()
    {
        $percentage = $this->percentage;
        
        if ($percentage >= 90) return 3;
        if ($percentage >= 70) return 2;
        if ($percentage >= 50) return 1;
        return 0;
    }
}