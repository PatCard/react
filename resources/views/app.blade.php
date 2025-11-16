<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @production
            @php
                $manifest = json_decode(file_get_contents(public_path('build/.vite/manifest.json')), true);
                $cssFile = $manifest['resources/js/app.jsx']['css'][0] ?? null;
                $jsFile = $manifest['resources/js/app.jsx']['file'] ?? null;
            @endphp
            @php
                $isSecure = request()->header('X-Forwarded-Proto') === 'https' || request()->secure();
                $assetHelper = $isSecure ? 'secure_asset' : 'asset';
            @endphp
            <link rel="stylesheet" href="{{ $assetHelper('build/' . $cssFile) }}">
            <script type="module" src="{{ $assetHelper('build/' . $jsFile) }}"></script>
        @else
            @viteReactRefresh
            @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @endproduction
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>