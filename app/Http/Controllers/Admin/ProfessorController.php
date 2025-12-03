<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProfessorController extends Controller
{
    /**
     * Display a listing of professors with their courses.
     */
    public function index()
    {
        $professors = User::where('role', 'profesor')
            ->with('courses:id,name,year') // Relación belongsToMany
            ->get();

        $courses = Course::all(); // Todos los cursos

        return Inertia::render('Admin/Profesores', [
            'professors' => $professors,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created professor.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        DB::transaction(function () use ($request) {
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => 'profesor',
            ]);
        });

        return redirect()->back()->with('success', 'Profesor creado exitosamente.');
    }

    /**
     * Update the specified professor.
     */
    public function update(Request $request, User $user)
    {
        \Log::info('✅ Update recibido', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'request_data' => $request->all(),
        ]);

        if ($user->role !== 'profesor') {
            abort(403, 'Solo se pueden editar profesores.');
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        DB::transaction(function () use ($request, $user) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ? bcrypt($request->password) : $user->password,
            ]);
        });

        return redirect()->back()->with('success', 'Profesor actualizado.');
    }

    /**
     * Remove the specified professor.
     */
    public function destroy(User $user)
    {
        if ($user->role !== 'profesor') {
            abort(403, 'Solo se pueden eliminar profesores.');
        }
        
        $user->courses()->detach();
        $user->delete();
    
        return back()->with('success', 'Profesor eliminado exitosamente');
    }

    /**
     * Assign a course to a professor.
     * If the course is already assigned to another professor, request confirmation.
     */
    public function assignCourse(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        \Log::info('assignCourse recibido', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'request_course_id' => $request->course_id,
        ]);
    
        if ($user->role !== 'profesor') {
            abort(403, 'Solo se pueden asignar cursos a profesores.');
        }
    
        $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
        ]);
    
        $course = Course::findOrFail($request->course_id);
    
        // Verificar si el curso ya está asignado a otro profesor
        $existingAssignment = DB::table('course_professor')
            ->where('course_id', $course->id)
            ->first();
    
        if ($existingAssignment) {
            $currentProfessor = User::find($existingAssignment->user_id);
            $currentProfessorName = $currentProfessor ? $currentProfessor->name : 'Sin profesor';
    
            return redirect()->route('admin.profesores')->with('requiresConfirmation', [
                'courseId' => $course->id,
                'newProfessorId' => $user->id,
                'currentProfessor' => $currentProfessorName,
            ]);
        }
    
        // Asignar curso al profesor
        $user->courses()->attach($course->id);
    
        return redirect()->back()->with('success', 'Curso asignado exitosamente.');
    }
    /**
     * Confirm reassignment of a course to a new professor.
     */
    public function confirmReassignCourse(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        if ($user->role !== 'profesor') {
            abort(403, 'Solo se pueden reasignar cursos a profesores.');
        }
    
        $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
        ]);
    
        $course = Course::findOrFail($request->course_id);
    
        // Remover el curso del profesor actual
        DB::table('course_professor')
            ->where('course_id', $course->id)
            ->delete();
    
        // Asignar al nuevo profesor
        $user->courses()->attach($course->id);
    
        return redirect()->route('admin.profesores')->with('success', 'Curso reasignado exitosamente.');
    }

    /**
     * Remove a course from a professor.
     */
    public function removeCourse($professorId, $courseId)
    {
        $professor = User::findOrFail($professorId);
        $course = Course::findOrFail($courseId);
    
        \Log::info('removeCourse recibido', [
            'professor_id' => $professor->id,
            'professor_role' => $professor->role,
            'course_id' => $course->id,
        ]);
    
        if ($professor->role !== 'profesor') {
            abort(403, 'Solo se pueden remover cursos de profesores.');
        }
    
        $exists = DB::table('course_professor')
            ->where('course_id', $course->id)
            ->where('user_id', $professor->id)
            ->exists();
    
        if (!$exists) {
            abort(403, 'Este curso no está asignado a este profesor.');
        }
    
        $professor->courses()->detach($course->id);
    
        return back()->with('success', 'Curso removido correctamente.');
    }
}
