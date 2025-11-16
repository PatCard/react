<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsEstudiante
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->isEstudiante()) {
            abort(403, 'Acceso denegado. Solo para estudiantes.');
        }

        return $next($request);
    }
}