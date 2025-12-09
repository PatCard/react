import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, totalEstudiantes, actividadesActivas, promedioGeneralPuntos, promedioGeneralPorcentaje, cursos }) {
    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            {/* Header con nombre y navegación */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            ¡Bienvenid@, {auth.user.name}!
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Aquí tienes un resumen de la actividad de tus cursos.
                        </p>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-gray-600 hover:text-gray-900 text-lg flex items-center gap-2"
                    >
                        <span>🚪</span>
                        <span>Salir</span>
                    </Link>
                </div>

                {/* Menú de navegación */}
                <div className="flex gap-4 border-b border-gray-200">
                    <Link
                        href="/profesor/dashboard"
                        className="pb-4 px-2 border-b-2 border-purple-500 text-purple-600 font-medium"
                    >
                        📊 Resumen
                    </Link>
                    <Link
                        href="/profesor/actividades"
                        className="pb-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium hover:border-gray-300 transition"
                    >
                        🎯 Actividades
                    </Link>
                    <Link
                        href="/profesor/progreso"
                        className="pb-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium hover:border-gray-300 transition"
                    >
                        📈 Progreso
                    </Link>
                </div>
            </div>

            {/* Tarjetas de métricas globales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Estudiantes */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Estudiantes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{totalEstudiantes}</p>
                            <p className="text-xs text-gray-400 mt-1">En todos tus cursos</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                {/* Actividades Activas */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Actividades Activas</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{actividadesActivas}</p>
                            <p className="text-xs text-gray-400 mt-1">Asignadas actualmente</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                        </div>
                    </div>
                </div>

                {/* Promedio General */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Promedio General</p>
                            {promedioGeneralPorcentaje > 0 ? (
                                <>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {promedioGeneralPuntos} pts
                                    </p>
                                    <p className="text-sm text-purple-600 font-semibold">
                                        ({promedioGeneralPorcentaje}%)
                                    </p>
                                </>
                            ) : (
                                <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                                {promedioGeneralPorcentaje > 0 ? 'De todos tus estudiantes' : 'Sin datos aún'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de cursos */}
            {cursos && cursos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">📚 Mis Cursos</h2>
                        <p className="text-sm text-gray-600 mt-1">Resumen del rendimiento por curso</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Curso
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estudiantes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Activos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Promedio
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
                                {cursos.map((curso) => {
                                    const participacion = curso.total_estudiantes > 0 
                                        ? (curso.estudiantes_activos / curso.total_estudiantes) * 100 
                                        : 0;
                                    
                                    let estadoColor = 'text-gray-500';
                                    let estadoIcon = '⚪';
                                    let estadoTexto = 'Sin datos';

                                    if (curso.promedio_porcentaje > 0) {
                                        if (curso.promedio_porcentaje >= 80) {
                                            estadoColor = 'text-green-600';
                                            estadoIcon = '🟢';
                                            estadoTexto = 'Excelente';
                                        } else if (curso.promedio >= 60) {
                                            estadoColor = 'text-yellow-600';
                                            estadoIcon = '🟡';
                                            estadoTexto = 'Bien';
                                        } else {
                                            estadoColor = 'text-red-600';
                                            estadoIcon = '🔴';
                                            estadoTexto = 'Necesita apoyo';
                                        }
                                    }
                                    
                                    return (
                                        <tr key={curso.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                                        <span className="text-purple-600 font-bold text-sm">
                                                            {curso.name.split(' ')[0]}
                                                        </span>
                                                    </div>
                                                    <div className="font-medium text-gray-900">{curso.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-gray-900 font-medium">{curso.total_estudiantes}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <span className="text-gray-900 font-medium">{curso.estudiantes_activos}</span>
                                                    <span className="text-gray-500 text-sm ml-1">
                                                        ({Math.round(participacion)}%)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {curso.promedio_porcentaje > 0 ? (
                                                    <div>
                                                        <div className="text-gray-900 font-semibold">
                                                            {curso.promedio_puntos} pts
                                                        </div>
                                                        <div className="text-sm text-purple-600">
                                                            ({curso.promedio_porcentaje}%)
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-900">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`flex items-center gap-2 font-medium ${estadoColor}`}>
                                                    <span>{estadoIcon}</span>
                                                    <span>{estadoTexto}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link
                                                    href={route('profesor.cursos.show', curso.id)}
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
                </div>
            )}

            {/* Estado vacío si no hay cursos */}
            {(!cursos || cursos.length === 0) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes cursos asignados
                    </h3>
                    <p className="text-gray-600">
                        Contacta al administrador para que te asigne cursos
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
}