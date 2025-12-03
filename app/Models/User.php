<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'course_id',
        'student_code',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is a professor
     */
    public function isProfesor(): bool
    {
        return $this->role === 'profesor';
    }

    /**
     * Check if user is a student
     */
    public function isEstudiante(): bool
    {
        return $this->role === 'estudiante';
    }
    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    /**
     * Relación: Estudiante pertenece a un curso
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Relación: Profesor tiene muchos cursos
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_professor');
    }

    /**
     * Relación: Profesor tiene muchas actividades
     */
    public function activities()
    {
        return $this->hasMany(Activity::class, 'professor_id');
    }

    /**
     * Relación: Estudiante tiene muchos intentos de actividades
     */
    public function activityAttempts()
    {
        return $this->hasMany(ActivityAttempt::class, 'student_id');
    }    
}