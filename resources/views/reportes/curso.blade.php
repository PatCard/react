<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de {{ $curso->name }}</title>
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
            table-layout: fixed;
        }
        .metric {
            display: table-cell;
            text-align: center;
            padding: 15px 5px;
            background-color: #f3f4f6;
            border-radius: 8px;
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
        .distribucion {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .dist-item {
            display: table-cell;
            text-align: center;
            padding: 12px;
            border-radius: 8px;
            width: 25%;
        }
        .dist-excelente {
            background-color: #dcfce7;
        }
        .dist-bien {
            background-color: #fef3c7;
        }
        .dist-apoyo {
            background-color: #fee2e2;
        }
        .dist-sin-datos {
            background-color: #f3f4f6;
        }
        .dist-value {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .dist-label {
            font-size: 11px;
            font-weight: bold;
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
        .estado-excelente {
            color: #16a34a;
            font-weight: bold;
        }
        .estado-bien {
            color: #eab308;
            font-weight: bold;
        }
        .estado-apoyo {
            color: #dc2626;
            font-weight: bold;
        }
        .estado-riesgo {
            color: #dc2626;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
        .alerta-box {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 12px;
            margin-top: 15px;
            border-radius: 4px;
        }
        .alerta-title {
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="logo">Aprendiendo a Leer con Chocolate</div>
        <div class="title">REPORTE DE CURSO</div>
        <div class="subtitle">Generado el {{ $fecha }}</div>
    </div>

    <!-- Información del Curso -->
    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Curso:</span>
            <span class="info-value">{{ $curso->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Profesor(a):</span>
            <span class="info-value">{{ $profesor->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Periodo:</span>
            <span class="info-value">{{ $curso->year }}</span>
        </div>
    </div>

    <!-- Resumen General -->
    <div class="section-title">RESUMEN GENERAL DEL CURSO</div>
    <div class="metrics">
        <div class="metric">
            <div class="metric-value">{{ $totalEstudiantes }}</div>
            <div class="metric-label">Total Estudiantes</div>
        </div>
        <div class="metric">
            <div class="metric-value">{{ $estudiantesActivos }}</div>
            <div class="metric-label">Estudiantes Activos</div>
        </div>
        <div class="metric">
            <div class="metric-value">{{ round(($estudiantesActivos / $totalEstudiantes) * 100) }}%</div>
            <div class="metric-label">Participación</div>
        </div>
        <div class="metric">
            <div class="metric-value">{{ $promedioGeneral }}%</div>
            <div class="metric-label">Promedio General</div>
        </div>
    </div>

    <!-- Distribución de Rendimiento -->
    <div class="section-title">DISTRIBUCIÓN DE RENDIMIENTO</div>
    <div class="distribucion">
        <div class="dist-item dist-excelente">
            <div class="dist-value" style="color: #16a34a;">{{ $distribucion['excelente'] }}</div>
            <div class="dist-label" style="color: #16a34a;">EXCELENTE<br>(≥80%)</div>
        </div>
        <div class="dist-item dist-bien">
            <div class="dist-value" style="color: #eab308;">{{ $distribucion['bien'] }}</div>
            <div class="dist-label" style="color: #eab308;">BIEN<br>(60-79%)</div>
        </div>
        <div class="dist-item dist-apoyo">
            <div class="dist-value" style="color: #dc2626;">{{ $distribucion['necesita_apoyo'] }}</div>
            <div class="dist-label" style="color: #dc2626;">NECESITA APOYO<br>(<60%)</div>
        </div>
        <div class="dist-item dist-sin-datos">
            <div class="dist-value" style="color: #6b7280;">{{ $distribucion['sin_datos'] }}</div>
            <div class="dist-label" style="color: #6b7280;">SIN DATOS<br>(Sin actividad)</div>
        </div>
    </div>

    <!-- Detalle por Estudiante -->
    <div class="section-title">DETALLE POR ESTUDIANTE</div>
    <table>
        <thead>
            <tr>
                <th>Estudiante</th>
                <th>Correo</th>
                <th style="text-align: center;">Completadas</th>
                <th style="text-align: center;">Promedio</th>
                <th style="text-align: center;">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($estudiantes->sortByDesc('promedio_porcentaje') as $estudiante)
            <tr>
                <td>{{ $estudiante['name'] }}</td>
                <td>{{ $estudiante['email'] }}</td>
                <td style="text-align: center;">
                    <strong>{{ $estudiante['actividades_completadas'] }}/{{ $totalActividades }}</strong>
                    @if($estudiante['actividades_completadas'] === $totalActividades)
                        <span style="color: #16a34a; font-size: 14px;"> ✓</span>
                    @endif
                </td>
                <td style="text-align: center;">
                    <strong>{{ $estudiante['promedio_porcentaje'] }}%</strong>
                </td>
                <td style="text-align: center;">
                    @if($estudiante['estado']['text'] === 'Excelente')
                        <span class="estado-excelente"> {{ $estudiante['estado']['text'] }}</span>
                    @elseif($estudiante['estado']['text'] === 'Bien')
                        <span class="estado-bien"> {{ $estudiante['estado']['text'] }}</span>
                    @elseif($estudiante['estado']['text'] === 'En riesgo')
                        <span class="estado-riesgo"> {{ $estudiante['estado']['text'] }}</span>
                    @else
                        <span class="estado-apoyo"> {{ $estudiante['estado']['text'] }}</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Estudiantes que Requieren Atención -->
    @if($distribucion['sin_datos'] > 0 || $distribucion['necesita_apoyo'] > 0)
    <div class="section-title">ESTUDIANTES QUE REQUIEREN ATENCIÓN</div>
    <div class="alerta-box">
        <div class="alerta-title">ACCIÓN REQUERIDA</div>
        <p style="font-size: 11px; line-height: 1.5;">
            @if($distribucion['sin_datos'] > 0)
                • <strong>{{ $distribucion['sin_datos'] }} estudiante(s)</strong> no ha(n) participado en ninguna actividad. Se recomienda contacto urgente con las familias.
                <br>
            @endif
            @if($distribucion['necesita_apoyo'] > 0)
                • <strong>{{ $distribucion['necesita_apoyo'] }} estudiante(s)</strong> necesita(n) apoyo adicional. Se sugiere planificar sesiones de refuerzo.
            @endif
        </p>
    </div>
    @endif

    <!-- Recomendaciones -->
    <div class="section-title">RECOMENDACIONES</div>
    <div class="info-section">
        @if($promedioGeneral >= 80)
            <p><strong>Rendimiento Sobresaliente del Curso:</strong> El curso demuestra un excelente nivel de comprensión lectora. Se recomienda continuar con la metodología aplicada y considerar actividades de mayor complejidad para mantener el desafío.</p>
        @elseif($promedioGeneral >= 60)
            <p><strong>Buen Rendimiento General:</strong> El curso muestra un progreso satisfactorio. Se sugiere identificar y reforzar las áreas específicas donde los estudiantes presentan mayor dificultad, especialmente con aquellos en estado "Necesita apoyo".</p>
        @else
            <p><strong>Requiere Intervención:</strong> El curso necesita apoyo significativo. Se recomienda:
            <br>• Revisar la metodología de enseñanza aplicada
            <br>• Implementar sesiones de refuerzo grupales
            <br>• Contactar con las familias de estudiantes en riesgo
            <br>• Considerar apoyo de especialistas en comprensión lectora</p>
        @endif
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Este reporte fue generado automáticamente por el sistema "Aprendiendo a Leer con Chocolate"</p>
        <p>{{ $fecha }} - {{ $profesor->name }}</p>
    </div>
</body>
</html>