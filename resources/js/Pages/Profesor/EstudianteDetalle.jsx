import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function EstudianteDetalle({ curso, estudiante, actividades, metricas }) {
    
    const getDifficultyBadge = (difficulty) => {
        const badges = {
            easy: { color: 'bg-green-100 text-green-700', text: '⭐ Fácil' },
            medium: { color: 'bg-yellow-100 text-yellow-700', text: '⭐⭐ Medio' },
            hard: { color: 'bg-red-100 text-red-700', text: '⭐⭐⭐ Difícil' },
        };
        return badges[difficulty] || badges.medium;
    };

    const getEstadoActividad = (porcentaje) => {
        if (!porcentaje) return { color: 'text-gray-400', text: 'Sin datos' };
        
        if (porcentaje >= 80) {
            return { color: 'text-green-600', text: '🟢 Excelente' };
        } else if (porcentaje >= 60) {
            return { color: 'text-yellow-600', text: '🟡 Bien' };
        } else {
            return { color: 'text-red-600', text: '🔴 Necesita apoyo' };
        }
    };

    return (
        <DashboardLayout>
            <Head title={`${estudiante.name} - ${curso.name}`} />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href={route('profesor.cursos.show', curso.id)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Volver al curso
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">👤</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {estudiante.name}
                                </h1>
                                <p className="text-gray-600">{estudiante.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        {curso.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Métricas del estudiante */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Progreso</p>
                        <span className="text-2xl">📈</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {metricas.progreso_porcentaje}%
                    </p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-purple-500 rounded-full h-2"
                            style={{ width: `${metricas.progreso_porcentaje}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {metricas.actividades_completadas} de {metricas.total_actividades} actividades
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Completadas</p>
                        <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {metricas.actividades_completadas}/{metricas.total_actividades}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Promedio</p>
                        <span className="text-2xl">📊</span>
                    </div>
                    {metricas.promedio_porcentaje > 0 ? (
                        <>
                            <p className="text-2xl font-bold text-gray-900">
                                {metricas.promedio_puntos} pts
                            </p>
                            <p className="text-sm text-purple-600 font-semibold">
                                ({metricas.promedio_porcentaje}%)
                            </p>
                        </>
                    ) : (
                        <p className="text-3xl font-bold text-gray-400">—</p>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500 text-sm">Última Actividad</p>
                        <span className="text-2xl">⏰</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                        {metricas.ultima_actividad || 'Nunca'}
                    </p>
                </div>
            </div>

            {/* Historial de actividades */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">📚 Historial de Actividades</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Rendimiento por actividad asignada
                    </p>
                </div>

                {actividades.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay actividades asignadas
                        </h3>
                        <p className="text-gray-600">
                            Este curso aún no tiene actividades asignadas
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actividad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Intentos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mejor Resultado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {actividades.map((actividad) => {
                                    const badge = getDifficultyBadge(actividad.difficulty);
                                    const estado = getEstadoActividad(actividad.mejor_porcentaje);
                                    
                                    return (
                                        <tr key={actividad.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {actividad.title}
                                                    </div>
                                                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                                                        {badge.text}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-gray-900 font-medium">
                                                    {actividad.total_intentos}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {actividad.completada ? (
                                                    <div>
                                                        <div className="text-gray-900 font-semibold">
                                                            {actividad.mejor_score} / {actividad.mejor_max_score}
                                                        </div>
                                                        <div className="text-sm text-purple-600">
                                                            ({actividad.mejor_porcentaje}%)
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">No completada</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`font-medium ${estado.color}`}>
                                                    {estado.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-gray-600 text-sm">
                                                    {actividad.ultima_fecha || '—'}
                                                </span>
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