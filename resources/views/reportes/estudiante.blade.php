<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de {{ $estudiante->name }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #9333ea;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #9333ea;
            margin-bottom: 5px;
        }
        .title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-top: 10px;
        }
        .subtitle {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
        }
        .info-section {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }
        .info-label {
            display: table-cell;
            font-weight: bold;
            width: 30%;
            color: #4b5563;
        }
        .info-value {
            display: table-cell;
            color: #1f2937;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-top: 25px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        .metrics {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .metric {
            display: table-cell;
            text-align: center;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 8px;
        }
        .metric:not(:last-child) {
            padding-right: 10px;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #9333ea;
        }
        .metric-label {
            font-size: 11px;
            color: #6b7280;
            margin-top: 5px;
        }
        .estado-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th {
            background-color: #9333ea;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .completada {
            color: #16a34a;
            font-weight: bold;
        }
        .no-completada {
            color: #dc2626;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
        .tipo-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .tipo-discover {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .tipo-order {
            background-color: #d1fae5;
            color: #065f46;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="logo">Aprendiendo a Leer con Chocolate</div>
        <div class="title">REPORTE DE PROGRESO INDIVIDUAL</div>
        <div class="subtitle">Generado el {{ $fecha }}</div>
    </div>

    <!-- Información del Estudiante -->
    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Estudiante:</span>
            <span class="info-value">{{ $estudiante->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Correo:</span>
            <span class="info-value">{{ $estudiante->email }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Curso:</span>
            <span class="info-value">{{ $curso->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Profesor(a):</span>
            <span class="info-value">{{ $profesor->name }}</span>
        </div>
    </div>

    <!-- Resumen General -->
    <div class="section-title">RESUMEN GENERAL</div>
    <div class="metrics">
        <div class="metric">
            <div class="metric-value">{{ $actividadesCompletadas }}/{{ $totalActividades }}</div>
            <div class="metric-label">Actividades Completadas</div>
        </div>
        <div class="metric">
            <div class="metric-value">{{ $promedioPorcentaje }}%</div>
            <div class="metric-label">Promedio General</div>
        </div>
        <div class="metric">
            <div style="margin: 0 auto 10px; width: 26px; height: 26px; border-radius: 50%; background-color: {{ $estado['color'] }}; border: 3px solid {{ $estado['color'] }}"></div>
            <div class="metric-label" style=" color: {{ $estado['color'] }}">{{ $estado['text'] }}</div>
        </div>
    </div>

    <!-- Detalle por Actividad -->
    <div class="section-title">DETALLE POR ACTIVIDAD</div>
    <table>
        <thead>
            <tr>
                <th>Actividad</th>
                <th>Tipo</th>
                <th style="text-align: center;">Intentos</th>
                <th style="text-align: center;">Mejor Resultado</th>
                <th style="text-align: center;">Fecha</th>
                <th style="text-align: center;">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($actividades as $actividad)
            <tr>
                <td>{{ $actividad['title'] }}</td>
                <td>
                    <span class="tipo-badge {{ $actividad['type'] === 'discover' ? 'tipo-discover' : 'tipo-order' }}">
                        {{ $actividad['type'] === 'discover' ? 'Descubrir' : 'Ordenar' }}
                    </span>
                </td>
                <td style="text-align: center;">{{ $actividad['total_intentos'] }}</td>
                <td style="text-align: center;">
                    @if($actividad['completada'])
                        <strong>{{ $actividad['mejor_score'] }}/{{ $actividad['mejor_max_score'] }}</strong>
                        <br>
                        <span style="color: #9333ea; font-size: 10px;">({{ $actividad['mejor_porcentaje'] }}%)</span>
                    @else
                        <span class="no-completada">No completada</span>
                    @endif
                </td>
                <td style="text-align: center;">
                    {{ $actividad['ultima_fecha'] ?? '—' }}
                </td>
                <td style="text-align: center;">
                    @if($actividad['completada'])
                        @if($actividad['mejor_porcentaje'] >= 80)
                            <span class="completada">Excelente</span>
                        @elseif($actividad['mejor_porcentaje'] >= 60)
                            <span style="color: #eab308; font-weight: bold;">Bien</span>
                        @else
                            <span class="no-completada">Mejorable</span>
                        @endif
                    @else
                        <span class="no-completada">Pendiente</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Observaciones -->
    <div class="section-title">OBSERVACIONES</div>
    <div class="info-section">
        @if($promedioPorcentaje >= 80)
            <p><strong>Rendimiento Excelente:</strong> El estudiante demuestra un dominio sobresaliente de las actividades de lectura. Se recomienda continuar con el buen trabajo y desafiar con actividades más complejas.</p>
        @elseif($promedioPorcentaje >= 60)
            <p><strong>Buen Rendimiento:</strong> El estudiante muestra un progreso satisfactorio. Se sugiere reforzar las áreas con menor desempeño mediante práctica adicional.</p>
        @elseif($actividadesCompletadas > 0)
            <p><strong>Necesita Apoyo:</strong> El estudiante requiere acompañamiento adicional. Se recomienda realizar sesiones de refuerzo y motivación para mejorar su comprensión lectora.</p>
        @else
            <p><strong>Sin Actividad Registrada:</strong> El estudiante no ha participado en las actividades asignadas. Es urgente contactar con la familia y motivar su participación.</p>
        @endif
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Este reporte fue generado automáticamente por el sistema "Aprendiendo a Leer con Chocolate"</p>
        <p>{{ $fecha }} - {{ $profesor->name }}</p>
    </div>
</body>
</html>