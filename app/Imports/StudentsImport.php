<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation
{
    protected $courseId;
    protected $createdStudents = [];

    public function __construct($courseId)
    {
        $this->courseId = $courseId;
    }

    public function model(array $row)
    {
        // Generar código único de 6 caracteres
        do {
            $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
        } while (User::where('student_code', $code)->exists());

        // Generar email basado en nombre completo (sin acentos ni ñ)
        $nameParts = explode(' ', trim($row['nombre_completo']));

        // Función para normalizar texto (quitar acentos y ñ)
        $normalize = function($text) {
            $text = strtolower($text);
            $text = str_replace(
                ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'],
                ['a', 'e', 'i', 'o', 'u', 'n', 'u'],
                $text
            );
            return $text;
        };

        $firstName = $normalize($nameParts[0]);
        $lastName = isset($nameParts[1]) ? $normalize($nameParts[1]) : '';

        $baseEmail = $lastName ? "{$firstName}.{$lastName}" : $firstName;
        $domain = config('app.student_email_domain', 'colegio.cl');

        // Verificar si el email ya existe y agregar contador
        $email = "{$baseEmail}@{$domain}";
        $counter = 2;

        while (User::where('email', $email)->exists()) {
            $email = "{$baseEmail}{$counter}@{$domain}";
            $counter++;
        }

        $student = User::create([
            'name' => $row['nombre_completo'],
            'email' => $email,
            'password' => Hash::make($code),
            'role' => 'estudiante',
            'student_code' => $code,
            'course_id' => $this->courseId,
        ]);

        // Guardar información del estudiante creado
        $this->createdStudents[] = [
            'name' => $student->name,
            'email' => $student->email,
            'code' => $code,
        ];

        return $student;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => 'required|string|max:255',
        ];
    }

    public function getCreatedStudents()
    {
        return $this->createdStudents;
    }
}