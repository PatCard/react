import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line, LabelList } from 'recharts';

export default function Progreso({ 
    distribucion, 
    participacion, 
    totalEstudiantes,
    rendimientoPorTipo,
    tiempoPromedioPorTipo,
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

    // Auto-refresh SOLO para Vista General cada 3 minutos
    useEffect(() => {
        // Solo activar si estamos en el tab general
        if (activeTab !== 'general') return;
        
        const interval = setInterval(() => {
            console.log('🔄 Auto-actualizando Vista General...');
            
            router.reload({ 
                only: ['distribucion', 'participacion', 'rendimientoPorTipo', 'tiempoPromedioPorTipo', 'totalEstudiantes'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 180000); //180000 3 minutos 10000 10 seg
        
        return () => clearInterval(interval);
    }, [activeTab]);

    // Función para formatear segundos a minutos:segundos
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
    console.log('🔍 datosIndividuales:', datosIndividuales);
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
                                        <Bar dataKey="porcentaje" fill="#9333ea" radius={[0, 8, 8, 0]}>
                                            <LabelList 
                                                dataKey="porcentaje" 
                                                position="inside" 
                                                fill="#ffffff" 
                                                fontWeight="bold" 
                                                fontSize={14}
                                                formatter={(value) => `${value}%`}
                                            />
                                        </Bar>
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

                    {/* Gráfico 3: Rendimiento por Tipo de Actividad - NUEVO */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">📊 Rendimiento por Tipo de Actividad</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Promedio de desempeño según el tipo de actividad
                            </p>
                        </div>

                        {rendimientoPorTipo && (rendimientoPorTipo.discover > 0 || rendimientoPorTipo.story_order > 0) ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart 
                                        data={[
                                            { 
                                                name: '🔍 Descubrir Palabras', 
                                                promedio: rendimientoPorTipo.discover,
                                                fill: '#3b82f6'
                                            },
                                            { 
                                                name: '📚 Ordenar Historia', 
                                                promedio: rendimientoPorTipo.story_order,
                                                fill: '#10b981'
                                            }
                                        ]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} label={{ value: 'Promedio (%)', angle: -90, position: 'insideLeft' }} />

                                        <Bar dataKey="promedio" radius={[8, 8, 0, 0]}>
                                            <LabelList 
                                                dataKey="promedio" 
                                                position="top" 
                                                fill="#000000" 
                                                fontWeight="bold" 
                                                fontSize={16}
                                                formatter={(value) => `${value}%`}
                                            />
                                            {[
                                                { name: '🔍 Descubrir Palabras', promedio: rendimientoPorTipo.discover, fill: '#3b82f6' },
                                                { name: '📚 Ordenar Historia', promedio: rendimientoPorTipo.story_order, fill: '#10b981' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                                {/* Tabla comparativa */}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">🔍</span>
                                            <span className="font-semibold text-blue-900">Descubrir Palabras</span>
                                        </div>
                                        <div className="text-3xl font-bold text-blue-600">
                                            {rendimientoPorTipo.discover}%
                                        </div>
                                        <div className="text-xs text-blue-700 mt-1">
                                            {rendimientoPorTipo.discover >= 80 ? '🟢 Excelente' : 
                                             rendimientoPorTipo.discover >= 60 ? '🟡 Bien' : 
                                             rendimientoPorTipo.discover > 0 ? '🔴 Necesita apoyo' : '⚪ Sin datos'}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">📚</span>
                                            <span className="font-semibold text-green-900">Ordenar Historia</span>
                                        </div>
                                        <div className="text-3xl font-bold text-green-600">
                                            {rendimientoPorTipo.story_order}%
                                        </div>
                                        <div className="text-xs text-green-700 mt-1">
                                            {rendimientoPorTipo.story_order >= 80 ? '🟢 Excelente' : 
                                             rendimientoPorTipo.story_order >= 60 ? '🟡 Bien' : 
                                             rendimientoPorTipo.story_order > 0 ? '🔴 Necesita apoyo' : '⚪ Sin datos'}
                                        </div>
                                    </div>
                                </div>

                                {/* Insight pedagógico */}
                                {rendimientoPorTipo.discover > 0 && rendimientoPorTipo.story_order > 0 && (
                                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <p className="text-sm text-purple-900">
                                            <strong>💡 Insight:</strong> {
                                                Math.abs(rendimientoPorTipo.discover - rendimientoPorTipo.story_order) < 5
                                                    ? 'El rendimiento es equilibrado en ambos tipos de actividades.'
                                                    : rendimientoPorTipo.discover > rendimientoPorTipo.story_order
                                                    ? `Los estudiantes tienen mejor desempeño en "Descubrir Palabras" (${(rendimientoPorTipo.discover - rendimientoPorTipo.story_order).toFixed(1)}% más). Considera reforzar la comprensión de secuencias narrativas.`
                                                    : `Los estudiantes tienen mejor desempeño en "Ordenar Historia" (${(rendimientoPorTipo.story_order - rendimientoPorTipo.discover).toFixed(1)}% más). Considera reforzar vocabulario y definiciones.`
                                            }
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <div className="text-6xl mb-4">📊</div>
                                <p>No hay datos suficientes para comparar tipos de actividades</p>
                            </div>
                        )}
                    </div>



                    {/* Gráfico 4: Tiempo Promedio por Tipo de Actividad - NUEVO */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">⏱️ Tiempo Promedio por Tipo de Actividad</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Tiempo promedio que toman los estudiantes en completar cada tipo
                            </p>
                        </div>

                        {tiempoPromedioPorTipo && (tiempoPromedioPorTipo.discover > 0 || tiempoPromedioPorTipo.story_order > 0) ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart 
                                        data={[
                                            { 
                                                name: '🔍 Descubrir Palabras', 
                                                tiempo: tiempoPromedioPorTipo.discover,
                                                fill: '#3b82f6'
                                            },
                                            { 
                                                name: '📚 Ordenar Historia', 
                                                tiempo: tiempoPromedioPorTipo.story_order,
                                                fill: '#10b981'
                                            }
                                        ]}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" label={{ value: 'Segundos', position: 'insideBottom', offset: -5 }} />
                                        <YAxis dataKey="name" type="category" width={180} />
                                        <Tooltip 
                                            content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                            <p className="font-semibold">{data.name}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Tiempo promedio: {formatTime(data.tiempo)}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                ({data.tiempo} segundos)
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="tiempo" radius={[0, 8, 8, 0]}>
                                            <LabelList 
                                                dataKey="tiempo" 
                                                position="inside" 
                                                fill="#ffffff" 
                                                fontWeight="bold" 
                                                fontSize={16}
                                                formatter={(value) => formatTime(value)}
                                            />
                                            {[
                                                { name: '🔍 Descubrir Palabras', tiempo: tiempoPromedioPorTipo.discover, fill: '#3b82f6' },
                                                { name: '📚 Ordenar Historia', tiempo: tiempoPromedioPorTipo.story_order, fill: '#10b981' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                                {/* Tabla comparativa */}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">🔍</span>
                                            <span className="font-semibold text-blue-900">Descubrir Palabras</span>
                                        </div>
                                        <div className="text-3xl font-bold text-blue-600">
                                            {formatTime(tiempoPromedioPorTipo.discover)}
                                        </div>
                                        <div className="text-xs text-blue-700 mt-1">
                                            Promedio: {tiempoPromedioPorTipo.discover} segundos
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">📚</span>
                                            <span className="font-semibold text-green-900">Ordenar Historia</span>
                                        </div>
                                        <div className="text-3xl font-bold text-green-600">
                                            {formatTime(tiempoPromedioPorTipo.story_order)}
                                        </div>
                                        <div className="text-xs text-green-700 mt-1">
                                            Promedio: {tiempoPromedioPorTipo.story_order} segundos
                                        </div>
                                    </div>
                                </div>

                                {/* Análisis de tiempos */}
                                {tiempoPromedioPorTipo.discover > 0 && tiempoPromedioPorTipo.story_order > 0 && (
                                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <p className="text-sm text-purple-900">
                                            <strong>⏱️ Análisis:</strong> {
                                                Math.abs(tiempoPromedioPorTipo.discover - tiempoPromedioPorTipo.story_order) < 30
                                                    ? 'Los tiempos son similares en ambos tipos de actividades.'
                                                    : tiempoPromedioPorTipo.discover > tiempoPromedioPorTipo.story_order
                                                    ? `"Descubrir Palabras" toma ${Math.round((tiempoPromedioPorTipo.discover - tiempoPromedioPorTipo.story_order) / 60 * 10) / 10} minutos más que "Ordenar Historia". Los estudiantes podrían necesitar más tiempo para leer y comprender definiciones.`
                                                    : `"Ordenar Historia" toma ${Math.round((tiempoPromedioPorTipo.story_order - tiempoPromedioPorTipo.discover) / 60 * 10) / 10} minutos más que "Descubrir Palabras". La secuenciación narrativa requiere más tiempo de análisis.`
                                            }
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <div className="text-6xl mb-4">⏱️</div>
                                <p>No hay datos suficientes para comparar tiempos</p>
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
                        
                        {/* Botón de descarga del reporte */}
                        {selectedEstudiante && datosIndividuales && (
                            <a
                                href={route('profesor.reportes.estudiante', {
                                    course: todosEstudiantes.find(e => e.id == selectedEstudiante)?.course_id,
                                    student: selectedEstudiante
                                })}
                                target="_blank"
                                className="mt-4 ml-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                            >
                                📄 Descargar Reporte Individual (PDF)
                            </a>
                        )}
                    </div>

                    {datosPorCurso && datosPorCurso.estudiantes.length > 0 ? (
                        <>
                            {/* Tarjeta de Tiempo Promedio del Curso - NUEVO */}
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">⏱️ Tiempo Promedio del Curso</h3>
                                        <p className="text-sm text-purple-100">
                                            Tiempo que tardan los estudiantes en completar actividades
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold">
                                            {formatTime(datosPorCurso.tiempo_promedio || 0)}
                                        </div>
                                        <div className="text-sm text-purple-100 mt-1">
                                            ({datosPorCurso.tiempo_promedio || 0} segundos)
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Análisis del tiempo */}
                                <div className="mt-4 pt-4 border-t border-purple-400">
                                    <p className="text-sm">
                                        {datosPorCurso.tiempo_promedio === 0 
                                            ? '⚪ No hay datos de tiempo disponibles'
                                            : datosPorCurso.tiempo_promedio < 120
                                            ? '🟢 Los estudiantes completan las actividades rápidamente'
                                            : datosPorCurso.tiempo_promedio < 240
                                            ? '🟡 Tiempo promedio normal (2-4 minutos)'
                                            : '🔴 Los estudiantes toman más tiempo del esperado. Considera revisar la dificultad de las actividades.'
                                        }
                                    </p>
                                </div>
                            </div>

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
                                        <Tooltip 
                                            formatter={(value) => `${value}%`}
                                            labelFormatter={(label) => `Estudiante: ${label}`}
                                        />
                                        <Bar dataKey="progreso" fill="#9333ea" radius={[0, 8, 8, 0]}>
                                            <LabelList 
                                                dataKey="progreso" 
                                                position="inside" 
                                                fill="#ffffff" 
                                                fontWeight="bold" 
                                                fontSize={14}
                                                formatter={(value) => `${value}%`}
                                            />
                                        </Bar>
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
                                        <Tooltip 
                                            formatter={(value) => `${value}%`}
                                            labelFormatter={(label) => `Estudiante: ${label}`}
                                        />
                                        <Bar dataKey="promedio" fill="#16a34a" radius={[0, 8, 8, 0]}>
                                            <LabelList 
                                                dataKey="promedio" 
                                                position="inside" 
                                                fill="#ffffff" 
                                                fontWeight="bold" 
                                                fontSize={14}
                                                formatter={(value) => `${value}%`}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>





                            {/* Gráfico 3: Aciertos y Errores por Estudiante */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        ✅ Aciertos y Errores por Estudiante
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Cantidad de aciertos y errores por tipo de actividad
                                    </p>
                                </div>

                                {(() => {
                                    // Transformar datos: cada estudiante tiene 2 filas (Descubrir y Ordenar)
                                    const datosTransformados = datosPorCurso.estudiantes.flatMap(estudiante => [
                                        {
                                            estudiante: estudiante.name,
                                            actividad: 'Descubrir',
                                            label: `${estudiante.name} - 🔍 Descubrir`,
                                            aciertos: estudiante.aciertos_discover,
                                            errores: estudiante.errores_discover,
                                        },
                                        {
                                            estudiante: estudiante.name,
                                            actividad: 'Ordenar',
                                            label: `${estudiante.name} - 📚 Ordenar`,
                                            aciertos: estudiante.aciertos_story_order,
                                            errores: estudiante.errores_story_order,
                                        }
                                    ]);

                                    return (

                                            <ResponsiveContainer width="100%" height={Math.max(400, datosTransformados.length * 35)}>
                                                <BarChart 
                                                    data={datosTransformados}
                                                    layout="vertical"
                                                    margin={{ top: 5, right: 200, left: 50, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" />
                                                    <YAxis 
                                                        dataKey="label" 
                                                        type="category" 
                                                        width={300}
                                                        tick={{ fontSize: 12 }}
                                                    />
                                                    {/*<Tooltip 
                                                        content={({ payload }) => {
                                                            if (payload && payload.length) {
                                                                const data = payload[0].payload;
                                                                return (
                                                                    <div className="bg-white p-3 border-2 border-gray-300 rounded-lg shadow-xl">
                                                                        <p className="font-bold text-base mb-2">{data.estudiante}</p>
                                                                        <p className="text-sm font-semibold mb-1">
                                                                            {data.actividad === 'Descubrir' ? '🔍 Descubrir Palabras' : '📚 Ordenar Historia'}
                                                                        </p>
                                                                        <p className="text-sm">
                                                                            ✅ {data.aciertos} aciertos  |  ❌ {data.errores} errores
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />*/}
                                                    <Legend 
                                                        wrapperStyle={{ paddingTop: '20px' }}
                                                        formatter={(value) => {
                                                            return value === 'aciertos' ? '✅ Aciertos' : '❌ Errores';
                                                        }}
                                                    />
                                                    <Bar dataKey="errores" stackId="a" fill="#ef4444" name="errores">
                                                        <LabelList 
                                                            dataKey="errores" 
                                                            position="center" 
                                                            fill="#ffffff" 
                                                            fontWeight="bold" 
                                                            fontSize={12}
                                                            formatter={(value) => value > 0 ? value : ''}
                                                        />
                                                    </Bar>
                                                    <Bar dataKey="aciertos" stackId="a" fill="#10b981" name="aciertos">
                                                        <LabelList 
                                                            dataKey="aciertos" 
                                                            position="center" 
                                                            fill="#ffffff" 
                                                            fontWeight="bold" 
                                                            fontSize={12}
                                                            formatter={(value) => value > 0 ? value : ''}
                                                        />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>

                                    );
                                })()}

                                {/* Resumen estadístico */}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="text-sm text-blue-700 mb-1">🔍 Descubrir Palabras</div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {datosPorCurso.estudiantes.reduce((sum, e) => sum + e.aciertos_discover, 0)}
                                                </span>
                                                <span className="text-sm text-green-700 ml-1">aciertos</span>
                                            </div>
                                            <div>
                                                <span className="text-2xl font-bold text-red-600">
                                                    {datosPorCurso.estudiantes.reduce((sum, e) => sum + e.errores_discover, 0)}
                                                </span>
                                                <span className="text-sm text-red-700 ml-1">errores</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="text-sm text-green-700 mb-1">📚 Ordenar Historia</div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {datosPorCurso.estudiantes.reduce((sum, e) => sum + e.aciertos_story_order, 0)}
                                                </span>
                                                <span className="text-sm text-green-700 ml-1">aciertos</span>
                                            </div>
                                            <div>
                                                <span className="text-2xl font-bold text-red-600">
                                                    {datosPorCurso.estudiantes.reduce((sum, e) => sum + e.errores_story_order, 0)}
                                                </span>
                                                <span className="text-sm text-red-700 ml-1">errores</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                        
                        {/* Botón de descarga del reporte */}
                        {selectedEstudiante && datosIndividuales && (
                            <a
                                href={route('profesor.reportes.estudiante', {
                                    course: todosEstudiantes.find(e => e.id == selectedEstudiante)?.course_id,
                                    student: selectedEstudiante
                                })}
                                target="_blank"
                                className="mt-4 ml-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                            >
                                📄 Descargar Reporte Individual (PDF)
                            </a>
                        )}
                    </div>

                    {datosIndividuales && datosIndividuales.evolucion.length > 0 ? (
                        <>
                            {/* Tarjeta de Tiempo Promedio del Estudiante */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">⏱️ Tiempo Promedio</h3>
                                        <p className="text-sm text-indigo-100">
                                            {datosIndividuales.estudiante.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold">
                                            {formatTime(datosIndividuales.tiempo_promedio)}
                                        </div>
                                        <div className="text-sm text-indigo-100 mt-1">
                                            ({datosIndividuales.tiempo_promedio} segundos)
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Análisis del tiempo */}
                                <div className="mt-4 pt-4 border-t border-indigo-400">
                                    <p className="text-sm">
                                        {datosIndividuales.tiempo_promedio < 30
                                            ? '⚡ Estudiante muy rápido. Verifica que esté comprendiendo bien las actividades.'
                                            : datosIndividuales.tiempo_promedio < 120
                                            ? '🟢 Tiempo adecuado. El estudiante toma el tiempo necesario para pensar.'
                                            : datosIndividuales.tiempo_promedio < 240
                                            ? '🟡 Tiempo moderadamente alto. Puede necesitar más práctica.'
                                            : '🔴 Tiempo muy alto. El estudiante podría tener dificultades de comprensión.'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Gráfico: Evolución de Rendimiento */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        📈 Evolución del Rendimiento
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Progreso en porcentaje a través del tiempo
                                    </p>
                                </div>

                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={datosIndividuales.evolucion}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="intento" 
                                            label={{ value: 'Intento', position: 'insideBottom', offset: -5 }} 
                                        />
                                        <YAxis 
                                            domain={[0, 100]} 
                                            label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }} 
                                        />
                                        <Tooltip />
                                        <Line 
                                            type="monotone" 
                                            dataKey="porcentaje" 
                                            stroke="#9333ea" 
                                            strokeWidth={3} 
                                            dot={{ r: 6 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Gráfico: Evolución del Tiempo */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        ⏱️ Evolución del Tiempo
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Tiempo empleado en cada intento (segundos)
                                    </p>
                                </div>

                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={datosIndividuales.evolucion_tiempo}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="intento" 
                                            label={{ value: 'Intento', position: 'insideBottom', offset: -5 }} 
                                        />
                                        <YAxis 
                                            label={{ value: 'Tiempo (segundos)', angle: -90, position: 'insideLeft' }} 
                                        />
                                        <Tooltip 
                                            content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                            <p className="font-semibold">Intento #{data.intento}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Tiempo: {formatTime(data.tiempo)}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Fecha: {data.fecha}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="tiempo" 
                                            stroke="#3b82f6" 
                                            strokeWidth={3} 
                                            dot={{ r: 6 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>

                                {/* Análisis de la evolución del tiempo */}
                                {datosIndividuales.evolucion_tiempo.length > 1 && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-900">
                                            <strong>💡 Análisis:</strong> {
                                                (() => {
                                                    const primerTiempo = datosIndividuales.evolucion_tiempo[0].tiempo;
                                                    const ultimoTiempo = datosIndividuales.evolucion_tiempo[datosIndividuales.evolucion_tiempo.length - 1].tiempo;
                                                    const diferencia = primerTiempo - ultimoTiempo;
                                                    
                                                    if (Math.abs(diferencia) < 5) {
                                                        return 'El estudiante mantiene un tiempo consistente en sus intentos.';
                                                    } else if (diferencia > 0) {
                                                        return `El estudiante ha mejorado su velocidad en ${diferencia} segundos. Está ganando confianza.`;
                                                    } else {
                                                        return `El estudiante está tomando ${Math.abs(diferencia)} segundos más. Puede estar siendo más cuidadoso o enfrentando mayor dificultad.`;
                                                    }
                                                })()
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
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