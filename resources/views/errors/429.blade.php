<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demasiados intentos</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
            <!-- Chocolate el perrito -->
            <div class="text-8xl mb-6 animate-bounce">🐶</div>
            
            <!-- Título -->
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
                ¡Ups! Muchos intentos
            </h1>
            
            <!-- Mensaje -->
            <p class="text-gray-600 text-lg mb-6">
                Has intentado acceder demasiadas veces. Por favor, descansa <strong>1 minuto</strong> y vuelve a intentarlo.
            </p>
            
            <!-- Temporizador visual -->
            <div class="bg-purple-100 rounded-lg p-4 mb-6">
                <p class="text-purple-800 font-semibold">⏱️ Espera un momento...</p>
            </div>
            
            <!-- Botón para volver -->
            @php
                $loginUrl = str_contains(url()->previous(), 'estudiante') 
                    ? route('estudiante.login.form') 
                    : route('login');
            @endphp
            
            <a href="{{ $loginUrl }}" 
               class="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                Volver al login
            </a>
            
            <!-- Mensaje adicional -->
            <p class="text-sm text-gray-500 mt-6">
                💡 <strong>Tip:</strong> Si olvidaste tu contraseña, puedes recuperarla desde el formulario de login.
            </p>
        </div>
    </div>
</body>
</html>