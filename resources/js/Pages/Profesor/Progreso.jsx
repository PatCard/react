import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

export default function Progreso({ 
    distribucion, 
    participacion, 
    totalEstudiantes,
    cursos,
    cursoSeleccionado,
    datosPorCurso,
    todosEstudiantes,
    estudianteSeleccionado,
    datosIndividuales
}) {
    
    const [activeTab, setActiveTab] = useState('general');
    const [selectedCurso, setSelectedCurso] = useState(cursoSeleccionado || '');
    const [selectedEstudiante, setSelectedEstudiante] = useState(estudianteSeleccionado || '');

    // Manejar cambio de curso
    const handleCursoChange = (cursoId) => {
        setSelectedCurso(cursoId);
        router.get(route('profesor.progreso'), { curso_id: cursoId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Manejar cambio de estudiante
    const handleEstudianteChange = (estudianteId) => {
        setSelectedEstudiante(estudianteId);
        router.get(route('profesor.progreso'), { estudiante_id: estudianteId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Datos para el gráfico de distribución
    const dataDistribucion = [
        { 
            name: '🟢 Excelente', 
            value: distribucion.excelente,
            porcentaje: totalEstudiantes > 0 ? Math.round((distribucion.excelente / totalEstudiantes) * 100) : 0,
            color: '#16a34a'
        },
        { 
            name: '🟡 Bien', 
            value: distribucion.bien,
            porcentaje: totalEstudiantes > 0 ? Math.round((distribucion.bien / totalEstudiantes) * 100) : 0,
            color: '#eab308'
        },
        { 
            name: '🔴 Necesita apoyo', 
            value: distribucion.necesita_apoyo,
            porcentaje: totalEstudiantes > 0 ? Math.round((distribucion.necesita_apoyo / totalEstudiantes) * 100) : 0,
            color: '#dc2626'
        },
        { 
            name: '⚪ Sin datos', 
            value: distribucion.sin_datos,
            porcentaje: totalEstudiantes > 0 ? Math.round((distribucion.sin_datos / totalEstudiantes) * 100) : 0,
            color: '#9ca3af'
        },
    ];

    // Datos para el gráfico de participación
    const dataParticipacion = participacion.map(curso => ({
        name: curso.name.length > 15 ? curso.name.substring(0, 15) + '...' : curso.name,
        porcentaje: curso.porcentaje,
        activos: curso.activos,
        total: curso.total,
    }));

    return (
        <DashboardLayout>
            <Head title="Progreso" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📈 Progreso</h1>
                        <p className="text-gray-600 mt-2">
                            Visualización del rendimiento y participación de tus estudiantes
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
                    <Link
                        href="/profesor/progreso"
                        className="pb-4 px-2 border-b-2 border-purple-500 text-purple-600 font-medium"
                    >
                        📈 Progreso
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-6 py-3 font-medium transition ${
                            activeTab === 'general'
                                ? 'border-b-2 border-purple-500 text-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        🌍 Vista General
                    </button>
                    <button
                        onClick={() => setActiveTab('curso')}
                        className={`px-6 py-3 font-medium transition ${
                            activeTab === 'curso'
                                ? 'border-b-2 border-purple-500 text-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        📚 Por Curso
                    </button>
                    <button
                        onClick={() => setActiveTab('individual')}
                        className={`px-6 py-3 font-medium transition ${
                            activeTab === 'individual'
                                ? 'border-b-2 border-purple-500 text-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        👤 Individual
                    </button>
                </div>
            </div>

            {/* TAB 1: VISTA GENERAL */}
            {activeTab === 'general' && (
                <div className="space-y-8">
                    
                    {/* Gráfico 1: Distribución de Rendimiento */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">📊 Rendimiento Global</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Clasificación de estudiantes según su desempeño
                            </p>
                        </div>

                        {totalEstudiantes > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dataDistribucion} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={150} />
                                        <Tooltip 
                                            content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                            <p className="font-semibold">{data.name}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {data.value} estudiantes ({data.porcentaje}%)
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                            {dataDistribucion.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                    {dataDistribucion.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div 
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {item.value} ({item.porcentaje}%)
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <div className="text-6xl mb-4">📊</div>
                                <p>No hay datos para mostrar</p>
                            </div>
                        )}
                    </div>

                    {/* Gráfico 2: Participación por Curso */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">📚 Participación por Curso</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Porcentaje de estudiantes activos en cada curso
                            </p>
                        </div>

                        {participacion.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={Math.max(300, participacion.length * 60)}>
                                    <BarChart data={dataParticipacion} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis dataKey="name" type="category" width={120} />
                                        <Tooltip 
                                            content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                            <p className="font-semibold">{data.name}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {data.activos}/{data.total} estudiantes activos
                                                            </p>
                                                            <p className="text-sm font-semibold text-purple-600">
                                                                {data.porcentaje}% participación
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="porcentaje" fill="#9333ea" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="mt-6 overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-gray-600">Curso</th>
                                                <th className="px-4 py-2 text-center font-medium text-gray-600">Activos</th>
                                                <th className="px-4 py-2 text-center font-medium text-gray-600">Total</th>
                                                <th className="px-4 py-2 text-center font-medium text-gray-600">Participación</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {participacion.map((curso, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">{curso.name}</td>
                                                    <td className="px-4 py-2 text-center">{curso.activos}</td>
                                                    <td className="px-4 py-2 text-center">{curso.total}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className={`font-semibold ${
                                                            curso.porcentaje >= 80 ? 'text-green-600' :
                                                            curso.porcentaje >= 60 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                            {curso.porcentaje}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <div className="text-6xl mb-4">📚</div>
                                <p>No tienes cursos asignados</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: POR CURSO */}
            {activeTab === 'curso' && (
                <div className="space-y-8">
                    
                    {/* Selector de curso */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selecciona un curso:
                        </label>
                        <select
                            value={selectedCurso}
                            onChange={(e) => handleCursoChange(e.target.value)}
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">-- Selecciona un curso --</option>
                            {cursos.map(curso => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {datosPorCurso && datosPorCurso.estudiantes.length > 0 ? (
                        <>
                            {/* Gráfico: Progreso Individual */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">📊 Progreso por Estudiante</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Porcentaje de actividades completadas
                                    </p>
                                </div>

                                <ResponsiveContainer width="100%" height={Math.max(400, datosPorCurso.estudiantes.length * 40)}>
                                    <BarChart data={datosPorCurso.estudiantes} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis dataKey="name" type="category" width={150} />
                                        <Tooltip />
                                        <Bar dataKey="progreso" fill="#9333ea" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Gráfico: Promedio por Estudiante */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">📈 Promedio por Estudiante</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Porcentaje de rendimiento promedio
                                    </p>
                                </div>

                                <ResponsiveContainer width="100%" height={Math.max(400, datosPorCurso.estudiantes.length * 40)}>
                                    <BarChart data={datosPorCurso.estudiantes} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis dataKey="name" type="category" width={150} />
                                        <Tooltip />
                                        <Bar dataKey="promedio" fill="#16a34a" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    ) : selectedCurso ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-600">No hay estudiantes en este curso</p>
                        </div>
                    ) : null}
                </div>
            )}

            {/* TAB 3: INDIVIDUAL */}
            {activeTab === 'individual' && (
                <div className="space-y-8">
                    
                    {/* Selector de estudiante */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selecciona un estudiante:
                        </label>
                        <select
                            value={selectedEstudiante}
                            onChange={(e) => handleEstudianteChange(e.target.value)}
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">-- Selecciona un estudiante --</option>
                            {todosEstudiantes.map(estudiante => (
                                <option key={estudiante.id} value={estudiante.id}>
                                    {estudiante.name} ({estudiante.curso})
                                </option>
                            ))}
                        </select>
                    </div>

                    {datosIndividuales && datosIndividuales.evolucion.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    📈 Evolución de {datosIndividuales.estudiante.name}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Progreso a través del tiempo
                                </p>
                            </div>

                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={datosIndividuales.evolucion}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="intento" label={{ value: 'Intento', position: 'insideBottom', offset: -5 }} />
                                    <YAxis domain={[0, 100]} label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="porcentaje" stroke="#9333ea" strokeWidth={3} dot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : selectedEstudiante ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-gray-600">Este estudiante aún no ha completado ninguna actividad</p>
                        </div>
                    ) : null}
                </div>
            )}
        </DashboardLayout>
    );
}