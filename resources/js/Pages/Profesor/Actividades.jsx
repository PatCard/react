import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Actividades({ activities, courses }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [words, setWords] = useState([
        { word: '', definition: '' },
        { word: '', definition: '' },
        { word: '', definition: '' },
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'discover',
        difficulty: 'medium',
        content: '',
        course_ids: [],
        due_date: '',
        config: { words: [] }
    });

    const { delete: destroy } = useForm();

    const addWord = () => {
        if (words.length < 12) {
            setWords([...words, { word: '', definition: '' }]);
        }
    };

    const removeWord = (index) => {
        if (words.length > 3) {
            setWords(words.filter((_, i) => i !== index));
        }
    };

    const updateWord = (index, field, value) => {
        const newWords = [...words];
        newWords[index][field] = value;
        setWords(newWords);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar que las palabras estén completas
        const validWords = words.filter(w => w.word && w.definition);
        
        if (validWords.length < 3) {
            alert('Debes agregar al menos 3 palabras con sus definiciones');
            return;
        }

        // Preparar todos los datos incluyendo config
        const formData = {
            title: data.title,
            type: data.type,
            difficulty: data.difficulty,
            content: data.content,
            course_ids: data.course_ids,
            due_date: data.due_date,
            config: {
                words: validWords,
                max_time: 300,
                points_per_word: 20
            }
        };

        console.log('📤 Enviando:', formData);

        // Usar router.post en lugar de useForm.post
        router.post(route('profesor.actividades.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('✅ Actividad creada');
                reset();
                setWords([
                    { word: '', definition: '' },
                    { word: '', definition: '' },
                    { word: '', definition: '' },
                ]);
                setShowCreateModal(false);
            },
            onError: (errors) => {
                console.log('❌ Errores:', errors);
            }
        });
    };

    const handleDelete = (activityId, activityTitle) => {
        if (confirm(`¿Estás seguro de eliminar la actividad "${activityTitle}"?`)) {
            destroy(route('profesor.actividades.destroy', activityId));
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const badges = {
            easy: { color: 'bg-green-100 text-green-700', text: '⭐ Fácil', stars: 1 },
            medium: { color: 'bg-yellow-100 text-yellow-700', text: '⭐⭐ Medio', stars: 2 },
            hard: { color: 'bg-red-100 text-red-700', text: '⭐⭐⭐ Difícil', stars: 3 },
        };
        return badges[difficulty] || badges.medium;
    };

    return (
        <DashboardLayout>
            <Head title="Mis Actividades" />

            {/* Header con navegación */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Actividades</h1>
                        <p className="text-gray-600 mt-2">
                            Crea y gestiona actividades de lectura para tus estudiantes
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                    >
                        <span>+</span>
                        Crear Actividad
                    </button>
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
                        className="pb-4 px-2 border-b-2 border-purple-500 text-purple-600 font-medium"
                    >
                        🎯 Actividades
                    </Link>
                    <button
                        disabled
                        className="pb-4 px-2 border-b-2 border-transparent text-gray-400 font-medium cursor-not-allowed"
                    >
                        👥 Estudiantes (próximamente)
                    </button>
                </div>
            </div>

            {/* Lista de actividades */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Actividades Creadas ({activities.length})
                    </h2>
                </div>

                {activities.length === 0 ? (
                    /* Estado vacío */
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay actividades creadas
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Crea tu primera actividad de lectura para tus estudiantes
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            + Crear Primera Actividad
                        </button>
                    </div>
                ) : (
                    /* Lista de actividades */
                    <div className="divide-y divide-gray-200">
                        {activities.map((activity) => {
                            const badge = getDifficultyBadge(activity.difficulty);
                            return (
                                <div key={activity.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {activity.title}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                                                    {badge.text}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span>📚 {activity.config.words.length} palabras</span>
                                                <span>👥 {activity.attempts_count || 0} intentos</span>
                                                {activity.due_date && (
                                                    <span>📅 Vence: {new Date(activity.due_date).toLocaleDateString('es-CL')}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {activity.courses.map((course) => (
                                                    <span
                                                        key={course.id}
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                                    >
                                                        {course.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <Link
                                                href={route('profesor.actividades.show', activity.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                                            >
                                                📊 Ver Resultados
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(activity.id, activity.title)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal: Crear actividad */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="sticky top-0 bg-white pb-4 mb-4 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">
                                🐶 Crear "Descubriendo las palabras con Chocolate"
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Título */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título de la Actividad
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ej: Encuentra las palabras del cuento 'Caperucita Roja'"
                                />
                                {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                            </div>

                            {/* Dificultad - Radio buttons compactos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nivel de Dificultad
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value="easy"
                                            checked={data.difficulty === 'easy'}
                                            onChange={e => setData('difficulty', e.target.value)}
                                            className="text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm">⭐ Fácil (5 palabras)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value="medium"
                                            checked={data.difficulty === 'medium'}
                                            onChange={e => setData('difficulty', e.target.value)}
                                            className="text-yellow-600 focus:ring-yellow-500"
                                        />
                                        <span className="text-sm">⭐⭐ Medio (8 palabras)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value="hard"
                                            checked={data.difficulty === 'hard'}
                                            onChange={e => setData('difficulty', e.target.value)}
                                            className="text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm">⭐⭐⭐ Difícil (12 palabras)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Texto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto Completo
                                </label>
                                <textarea
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    placeholder="Escribe o pega aquí el cuento, fábula o texto que usarás..."
                                />
                                {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
                            </div>

                            {/* Palabras y definiciones - Más compacto */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Palabras Clave ({words.filter(w => w.word && w.definition).length} completas)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addWord}
                                        disabled={words.length >= 12}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium disabled:opacity-50"
                                    >
                                        + Agregar
                                    </button>
                                </div>
                                
                                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {words.map((wordItem, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <span className="text-xs text-gray-500 w-4">{index + 1}</span>
                                            <input
                                                type="text"
                                                value={wordItem.word}
                                                onChange={e => updateWord(index, 'word', e.target.value)}
                                                placeholder="Palabra"
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={wordItem.definition}
                                                onChange={e => updateWord(index, 'definition', e.target.value)}
                                                placeholder="Definición"
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            {words.length > 3 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeWord(index)}
                                                    className="text-red-600 hover:text-red-700 text-xl w-6"
                                                    title="Eliminar"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Mínimo 3 palabras requeridas</p>
                            </div>

                            {/* Cursos - Más compacto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Asignar a Cursos ({data.course_ids.length} seleccionados)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {courses.map(course => (
                                        <label key={course.id} className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input
                                                type="checkbox"
                                                checked={data.course_ids.includes(course.id)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setData('course_ids', [...data.course_ids, course.id]);
                                                    } else {
                                                        setData('course_ids', data.course_ids.filter(id => id !== course.id));
                                                    }
                                                }}
                                                className="rounded text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="truncate">{course.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.course_ids && <div className="text-red-600 text-sm mt-1">{errors.course_ids}</div>}
                            </div>

                            {/* Fecha límite */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha Límite (opcional)
                                </label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        reset();
                                        setWords([
                                            { word: '', definition: '' },
                                            { word: '', definition: '' },
                                            { word: '', definition: '' },
                                        ]);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50"
                                >
                                    {processing ? 'Creando...' : '🐶 Crear Actividad'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}