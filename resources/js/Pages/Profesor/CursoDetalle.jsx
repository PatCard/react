import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function CursoDetalle({ curso, estudiantes, totalActividades }) {
    
    const getEstadoEstudiante = (porcentaje, completadas, total) => {
        // Si no ha hecho nada
        if (completadas === 0) {
            return {
                icon: '🔴',
                text: 'En riesgo',
                color: 'text-red-600'
            };
        }
        
        // Si completó todo pero con bajo rendimiento
        if (completadas === total && porcentaje < 60) {
            return {
                icon: '🟡',
                text: 'Necesita apoyo',
                color: 'text-yellow-600'
            };
        }
        
        // Si tiene buen rendimiento
        if (porcentaje >= 80) {
            return {
                icon: '🟢',
                text: 'Excelente',
                color: 'text-green-600'
            };
        }
        
        // Rendimiento medio
        if (porcentaje >= 60) {
            return {
                icon: '🟡',
                text: 'Bien',
                color: 'text-yellow-600'
            };
        }
        
        // Bajo rendimiento
        return {
            icon: '🔴',
            text: 'Necesita apoyo',
            color: 'text-red-600'
        };
    };

    // Calcular métricas generales del curso
    const estudiantesActivos = estudiantes.filter(e => e.actividades_completadas > 0).length;
    const promedioGeneral = estudiantes.length > 0
        ? estudiantes.reduce((sum, e) => sum + e.promedio_porcentaje, 0) / estudiantes.filter(e => e.promedio_porcentaje > 0).length
        : 0;

    return (
        <DashboardLayout>
            <Head title={`Detalle de ${curso.name}`} />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/profesor/dashboard"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Volver
                    </Link>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">
                            {curso.name.split(' ')[0]}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📚 {curso.name}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Seguimiento detallado del curso
                        </p>
                    </div>
                </div>

                {/* Menú de navegación */}
                <div className="flex gap-4 border-b border-gray-200">
                    <Link
                        href="/profesor/dashboard"
                        className="pb-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium hover:border-gray-300 transition"
                    >
                        📊 Resumen
                    </Link>
                    <Link
                        href="/profesor/actividades"
                        className="pb-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium hover:border-gray-300 transition"
                    >
                        🎯 Actividades
                    </Link>
                    <button
                        className="pb-4 px-2 border-b-2 border-purple-500 text-purple-600 font-medium"
                    >
                        👥 Estudiantes
                    </button>
                </div>
            </div>

            {/* Métricas del curso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Estudiantes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{estudiantes.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Estudiantes Activos</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{estudiantesActivos}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {estudiantes.length > 0 ? Math.round((estudiantesActivos / estudiantes.length) * 100) : 0}% de participación
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Promedio del Curso</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {promedioGeneral > 0 ? `${Math.round(promedioGeneral)}%` : '—'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de estudiantes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">👥 Estudiantes del Curso</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {totalActividades} {totalActividades === 1 ? 'actividad asignada' : 'actividades asignadas'}
                    </p>
                </div>

                {estudiantes.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay estudiantes en este curso
                        </h3>
                        <p className="text-gray-600">
                            Contacta al administrador para agregar estudiantes
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estudiante
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Completadas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Promedio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Última Actividad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {estudiantes.map((estudiante) => {
                                    const estado = getEstadoEstudiante(
                                        estudiante.promedio_porcentaje,
                                        estudiante.actividades_completadas,
                                        estudiante.total_actividades
                                    );
                                    
                                    return (
                                        <tr key={estudiante.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="font-medium text-gray-900">{estudiante.name}</div>
                                                    <div className="text-sm text-gray-500">{estudiante.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-900 font-medium">
                                                        {estudiante.actividades_completadas}/{estudiante.total_actividades}
                                                    </span>
                                                    {estudiante.actividades_completadas === estudiante.total_actividades && estudiante.total_actividades > 0 && (
                                                        <span className="text-green-500">✅</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {estudiante.promedio_porcentaje > 0 ? (
                                                    <div>
                                                        <div className="text-gray-900 font-semibold">
                                                            {estudiante.promedio_puntos} pts
                                                        </div>
                                                        <div className="text-sm text-purple-600">
                                                            ({estudiante.promedio_porcentaje}%)
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-gray-600 text-sm">
                                                    {estudiante.ultima_actividad || 'Nunca'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`flex items-center gap-2 font-medium ${estado.color}`}>
                                                    <span>{estado.icon}</span>
                                                    <span>{estado.text}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link
                                                    href={route('profesor.cursos.estudiantes.show', [curso.id, estudiante.id])}
                                                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    Ver Detalle
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}