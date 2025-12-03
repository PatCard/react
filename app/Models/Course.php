<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'level',
        'section',
        'year',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }

    // Relación con profesores
    public function professors()
    {
        return $this->belongsToMany(User::class, 'course_professor');
    }

    // Relación con estudiantes (un curso tiene muchos estudiantes)
    public function students()
    {
        return $this->hasMany(User::class, 'course_id')->where('role', 'estudiante');
    }

    // Relación: Curso tiene muchas actividades asignadas
    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'activity_course');
    }    
}