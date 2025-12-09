import { Head, Link } from '@inertiajs/react';

export default function Actividades({ activities }) {
    const getDifficultyBadge = (difficulty) => {
        const badges = {
            easy: { color: 'bg-green-100 text-green-700', text: '⭐ Fácil' },
            medium: { color: 'bg-yellow-100 text-yellow-700', text: '⭐⭐ Medio' },
            hard: { color: 'bg-red-100 text-red-700', text: '⭐⭐⭐ Difícil' },
        };
        return badges[difficulty] || badges.medium;
    };

    const getActivityType = (type) => {
        const types = {
            discover: { icon: '🔍', name: 'Descubiendo Palabras' },
            story_order: { icon: '📖', name: 'Ordena la Historia' },
            error_hunter: { icon: '✏️', name: 'Cazador de Errores' },
            story_creator: { icon: '🎨', name: 'Creador de Cuentos' },
        };
        return types[type] || types.discover;
    };

    const getStars = (attempt) => {
        if (!attempt) return '';
        const percentage = (attempt.score / attempt.max_score) * 100;
        if (percentage >= 90) return '⭐⭐⭐';
        if (percentage >= 70) return '⭐⭐';
        if (percentage >= 50) return '⭐';
        return '';
    };

    const isPastDue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Head title="Mis Actividades" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href="/estudiante/dashboard" className="text-gray-600 hover:text-gray-900">
                                ← Volver
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mis Actividades</h1>
                                <p className="text-sm text-gray-500">Actividades de lectura asignadas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {activities.length === 0 ? (
                    /* Estado vacío */
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">🐶</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay actividades asignadas
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Tu profesor aún no ha creado actividades para tu curso
                        </p>
                        <Link
                            href="/estudiante/dashboard"
                            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                ) : (
                    /* Lista de actividades */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity) => {
                            const badge = getDifficultyBadge(activity.difficulty);
                            const pastDue = isPastDue(activity.due_date);
                            const hasAttempts = activity.total_attempts > 0;
                            const bestAttempt = activity.best_attempt;

                            return (
                                <div key={activity.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                    {/* Header de la tarjeta */}
                                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-3xl">🐶</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                                                {badge.text}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight">
                                            {activity.title}
                                        </h3>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-4">
                                        <div className="space-y-3 mb-4">
                                            {/* Tipo de actividad */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                    {getActivityType(activity.type).icon} {getActivityType(activity.type).name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span>📚</span>
                                                <span>
                                                    {activity.type === 'discover' 
                                                        ? `${activity.config.words?.length || 0} palabras para encontrar`
                                                        : `${activity.config.sentences?.length || 0} oraciones para ordenar`
                                                    }
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span>⏱️</span>
                                                <span>Tiempo límite: {Math.floor((activity.config.max_time || 300) / 60)} minutos</span>
                                            </div>
                                            
                                            {activity.due_date && (
                                                <div className={`flex items-center gap-2 text-sm ${pastDue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                                    <span>📅</span>
                                                    <span>
                                                        {pastDue ? 'Venció: ' : 'Vence: '}
                                                        {new Date(activity.due_date).toLocaleDateString('es-CL', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                            )}

                                            {hasAttempts && (
                                                <div className="pt-3 border-t border-gray-200">
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="text-gray-600">🏆 Tu mejor puntaje:</span>
                                                        <span className="font-bold text-purple-600">
                                                            {bestAttempt.score}/{bestAttempt.max_score} {getStars(bestAttempt)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">🔄 Intentos realizados:</span>
                                                        <span className="font-medium text-gray-900">{activity.total_attempts}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                        <div 
                                                            className="bg-purple-600 h-2 rounded-full transition-all"
                                                            style={{ width: `${(bestAttempt.score / bestAttempt.max_score) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Botón de acción */}
                                        <Link
                                            href={route('estudiante.actividades.show', activity.id)}
                                            className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                                                hasAttempts
                                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                                            }`}
                                        >
                                            {hasAttempts ? '🔄 Intentar de Nuevo' : '🎯 Comenzar Actividad'}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}