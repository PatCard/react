<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsProfesor
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->isProfesor()) {
            abort(403, 'Acceso denegado. Solo para profesores.');
        }

        return $next($request);
    }
}