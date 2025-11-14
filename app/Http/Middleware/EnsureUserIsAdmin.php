<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        \Log::info('Admin middleware', [
            'authenticated' => auth()->check(),
            'user' => auth()->user()?->email,
            'is_admin' => auth()->user()?->isAdmin(),
            'method' => $request->method(),
            'url' => $request->url()
        ]);

        if (!auth()->check() || !auth()->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        return $next($request);
    }
}