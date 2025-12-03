import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Cursos({ courses }) {
    const [showModal, setShowModal] = useState(false);
    const { errors } = usePage().props;
    
    const { data, setData, post, processing, reset } = useForm({
        level: '',
        section: '',
        year: 2025,
    });
    const { delete: destroy } = useForm();

    console.log('Errores recibidos:', errors);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.cursos.store'), {
            onSuccess: () => {
                reset();
                setShowModal(false);
            }
        });
    };

    const handleDelete = (courseId, courseName) => {
        if (confirm(`¿Estás seguro de eliminar el curso ${courseName}? Esta acción no se puede deshacer.`)) {
            destroy(route('admin.cursos.destroy', courseId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Gestión de Cursos" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                                ← Volver
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
                                <p className="text-sm text-gray-500">Administra los cursos del colegio</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                            >
                                <span>+</span>
                                Crear Curso
                            </button>
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
                    </div>
                </div>
            </div>

            {/* Mostrar errores de eliminación */}
            {errors?.delete && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⚠️</span>
                            <p className="text-red-800 font-medium">{errors.delete}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Cursos Creados ({courses.length})</h2>
                    </div>
                    
                    {courses.length === 0 ? (
                        /* Estado vacío */
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No hay cursos creados
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Comienza creando el primer curso del colegio
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                Crear Primer Curso
                            </button>
                        </div>
                    ) : (
                        /* Lista de cursos */
                        <div className="divide-y divide-gray-200">
                            {courses.map((course) => (
                                <div key={course.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">📚</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{course.name}</h3>
                                            <p className="text-sm text-gray-500">Año {course.year}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            Activo
                                        </span>
                                        <button
                                            onClick={() => handleDelete(course.id, course.name)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de crear curso */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Curso</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nivel
                                </label>
                                <select 
                                    value={data.level}
                                    onChange={e => setData('level', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar nivel</option>
                                    <option value="3° Básico">3° Básico</option>
                                    <option value="4° Básico">4° Básico</option>
                                </select>
                                {errors.level && <div className="text-red-600 text-sm mt-1">{errors.level}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sección
                                </label>
                                <select 
                                    value={data.section}
                                    onChange={e => setData('section', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar sección</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                </select>
                                {errors.section && <div className="text-red-600 text-sm mt-1">{errors.section}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Año Escolar
                                </label>
                                <input
                                    type="number"
                                    value={data.year}
                                    onChange={e => setData('year', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.year && <div className="text-red-600 text-sm mt-1">{errors.year}</div>}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {processing ? 'Creando....' : 'Crear Curso'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}