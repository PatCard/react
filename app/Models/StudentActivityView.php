<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentActivityView extends Model
{
    protected $fillable = [
        'student_id',
        'activity_id',
        'activity_type',
        'viewed_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    // Relación con el estudiante
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Relación con la actividad
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}