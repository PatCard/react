import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Profesores({ professors, courses }) {
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);

    // Form para asignar curso
    const { data: assignData, setData: setAssignData, post: postAssign, processing: processingAssign, errors: assignErrors, reset: resetAssign } = useForm({
        course_id: '',
    });
    
    // Form para crear profesor
    const { data: createData, setData: setCreateData, post: postCreate, processing: processingCreate, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    
    // Form para editar profesor
    const { data: editData, setData: setEditData, patch, processing: processingEdit, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    
    // Form para confirmar reasignación (nuevo)
const { data: confirmReassignData, setData: setConfirmReassignData, post: postConfirmReassign, processing: processingConfirm } = useForm({
    course_id: '',
});

    const { delete: destroy } = useForm();

    // Asignar curso
    const handleAssignCourse = (e) => {
        e.preventDefault();
        console.log('Asignando a profesor ID:', selectedProfessor?.id, 'Curso ID:', assignData.course_id);
        
        postAssign(route('admin.profesores.assign', selectedProfessor.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.requiresConfirmation) {
                    const conf = page.props.requiresConfirmation;
                    setConfirmationData({
                        courseId: conf.courseId,
                        newProfessorId: conf.newProfessorId,
                        currentProfessor: conf.currentProfessor,
                    });
                    setShowConfirmModal(true);
                    setShowAssignModal(false);
                } else {
                    resetAssign();
                    setShowAssignModal(false);
                    setSelectedProfessor(null);
                }
            },
            onError: (errors) => {
                console.error('Errores:', errors);
            }
        });
    };

    // Confirmar reasignación — usando router.post para evitar recarga
    const handleConfirmReassign = () => {
        router.post(
            route('admin.profesores.confirm-reassign', confirmationData.newProfessorId),
            {
                course_id: confirmationData.courseId,
            },
            {
                onSuccess: () => {
                    setShowConfirmModal(false);
                    setConfirmationData(null);
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Errores:', errors);
                    alert('Error al reasignar');
                }
            }
        );
    };

    // Crear profesor
    const handleCreateProfessor = (e) => {
        e.preventDefault();
        postCreate(route('admin.profesores.store'), {
            onSuccess: () => {
                resetCreate();
                setShowCreateModal(false);
            },
            onError: (errors) => {
                console.error('Errores:', errors);
            }
        });
    };

    // Editar profesor
    const handleEditProfessor = (e) => {
    e.preventDefault();
    console.log('Editando profesor ID:', selectedProfessor.id);
    console.log('Datos a enviar:', editData);
    console.log('Ruta:', route('admin.profesores.update', selectedProfessor.id));

    patch(route('admin.profesores.update', selectedProfessor.id), {
        onSuccess: () => {
            console.log('Edición exitosa');
            resetEdit();
            setShowEditModal(false);
            setSelectedProfessor(null);
        },
        onError: (errors) => {
            console.log('Errores al editar:', errors);
        }
    });
    };

    // Eliminar profesor
    const handleDeleteProfessor = (professorId, professorName) => {
        if (confirm(`¿Estás seguro de eliminar al profesor ${professorName}? Esta acción no se puede deshacer.`)) {
            destroy(route('admin.profesores.destroy', professorId));
        }
    };

    // Remover curso
    const handleRemoveCourse = (professorId, courseId) => {
        if (confirm('¿Estás seguro de remover este curso del profesor?')) {
            destroy(route('admin.profesores.remove-course', [professorId, courseId]), {
                onSuccess: () => {
                    // Aquí puedes refrescar la página o actualizar el estado
                    window.location.reload();
                }
            });
        }
    };

    // Abrir modales
    const openAssignModal = (professor) => {
        setSelectedProfessor(professor);
        setShowAssignModal(true);
        resetAssign();
    };

    const openEditModal = (professor) => {
        setSelectedProfessor(professor);
        setEditData({
            name: professor.name,
            email: professor.email,
            password: '',
            password_confirmation: '',
        });
        setShowEditModal(true);
    };

    const { flash } = usePage().props;

    // Detectar requiresConfirmation desde flash (fallback si onSuccess no lo captura)
    useEffect(() => {
        if (flash?.requiresConfirmation && !confirmationData) {
            setConfirmationData(flash.requiresConfirmation);
            setShowConfirmModal(true);
            setShowAssignModal(false);
            // Intentar recuperar selectedProfessor por ID si se perdió
            const prof = professors.find(p => p.id === flash.requiresConfirmation.newProfessorId);
            if (prof && !selectedProfessor) {
                setSelectedProfessor(prof);
            }
        }
    }, [flash, professors]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Gestión de Profesores" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                                ← Volver
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h1>
                                <p className="text-sm text-gray-500">Crear, editar y asignar cursos a profesores</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
                        >
                            + Crear Profesor
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Profesores ({professors.length})</h2>
                    </div>
                    
                    {professors.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">👩‍🏫</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No hay profesores registrados
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Crea el primer profesor para comenzar
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
                            >
                                + Crear Profesor
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {professors.map((professor) => (
                                <div key={professor.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                <span className="text-purple-600 font-semibold text-lg">
                                                    {professor.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">{professor.name}</h3>
                                                <p className="text-sm text-gray-500">{professor.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openAssignModal(professor)}
                                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                                            >
                                                + Asignar Curso
                                            </button>
                                            <button
                                                onClick={() => openEditModal(professor)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProfessor(professor.id, professor.name)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cursos asignados */}
                                    <div className="ml-16">
                                        <p className="text-sm font-medium text-gray-700 mb-3">
                                            Cursos asignados ({professor.courses?.length || 0})
                                        </p>
                                        {professor.courses?.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {professor.courses.map((course) => (
                                                    <div
                                                        key={course.id}
                                                        className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full"
                                                    >
                                                        <span className="font-medium">{course.name}</span>
                                                        <button
                                                            onClick={() => handleRemoveCourse(professor.id, course.id)}
                                                            className="hover:text-purple-900 font-bold"
                                                            title="Remover curso"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">Sin cursos asignados</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Crear profesor */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Profesor</h2>
                        
                        <form onSubmit={handleCreateProfessor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={createData.name}
                                    onChange={e => setCreateData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ej: María González"
                                />
                                {createErrors.name && <div className="text-red-600 text-sm mt-1">{createErrors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={createData.email}
                                    onChange={e => setCreateData('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="profesor@colegio.cl"
                                />
                                {createErrors.email && <div className="text-red-600 text-sm mt-1">{createErrors.email}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={createData.password}
                                    onChange={e => setCreateData('password', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Mínimo 8 caracteres"
                                />
                                {createErrors.password && <div className="text-red-600 text-sm mt-1">{createErrors.password}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={createData.password_confirmation}
                                    onChange={e => setCreateData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetCreate();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingCreate}
                                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50"
                                >
                                    {processingCreate ? 'Creando...' : 'Crear Profesor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Editar profesor */}
            {showEditModal && selectedProfessor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Profesor</h2>
                        
                        <form onSubmit={handleEditProfessor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={e => setEditData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {editErrors.name && <div className="text-red-600 text-sm mt-1">{editErrors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={e => setEditData('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {editErrors.email && <div className="text-red-600 text-sm mt-1">{editErrors.email}</div>}
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-3">Dejar en blanco para mantener la contraseña actual</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nueva Contraseña (opcional)
                                        </label>
                                        <input
                                            type="password"
                                            value={editData.password}
                                            onChange={e => setEditData('password', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Mínimo 8 caracteres"
                                        />
                                        {editErrors.password && <div className="text-red-600 text-sm mt-1">{editErrors.password}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={editData.password_confirmation}
                                            onChange={e => setEditData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedProfessor(null);
                                        resetEdit();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingEdit}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {processingEdit ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Asignar curso */}
            {showAssignModal && selectedProfessor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Asignar Curso</h2>
                        <p className="text-gray-600 mb-6">Profesor: {selectedProfessor.name}</p>
                        
                        <form onSubmit={handleAssignCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar Curso
                                </label>
                                <select 
                                    value={assignData.course_id}
                                    onChange={e => setAssignData('course_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar curso</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} - {course.year}
                                        </option>
                                    ))}
                                </select>
                                {assignErrors.course_id && <div className="text-red-600 text-sm mt-1">{assignErrors.course_id}</div>}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedProfessor(null);
                                        resetAssign();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingAssign}
                                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50"
                                >
                                    {processingAssign ? 'Asignando...' : 'Asignar Curso'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Confirmar reasignación */}
            {showConfirmModal && confirmationData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">
                                {confirmationData.currentProfessor === 'Sin profesor' ? '✅' : '⚠️'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {confirmationData.currentProfessor === 'Sin profesor' 
                                    ? 'Curso Disponible' 
                                    : 'Confirmar Reasignación'}
                            </h2>
                        </div>
                        
                        <div className={`border rounded-lg p-4 mb-6 ${
                            confirmationData.currentProfessor === 'Sin profesor' 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-yellow-50 border-yellow-200'
                        }`}>
                            {confirmationData.currentProfessor === 'Sin profesor' ? (
                                <p className="text-gray-800">
                                    Este curso está <strong>disponible</strong>.<br />
                                    ¿Deseas asignarlo a <strong>{selectedProfessor?.name || 'este profesor'}</strong>?
                                </p>
                            ) : (
                                <p className="text-gray-800">
                                    Este curso ya está asignado a <strong>{confirmationData.currentProfessor}</strong>.<br />
                                    ¿Deseas reasignarlo a <strong>{selectedProfessor?.name || 'este profesor'}</strong>?
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmationData(null);
                                    setShowAssignModal(true); // Volver al modal de asignación
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmReassign}
                                disabled={processingConfirm}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                                    confirmationData.currentProfessor === 'Sin profesor'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-yellow-500 hover:bg-yellow-600'
                                } text-white disabled:opacity-50`}
                            >
                                {processingConfirm 
                                    ? 'Procesando...' 
                                    : confirmationData.currentProfessor === 'Sin profesor' 
                                        ? 'Sí, Asignar' 
                                        : 'Sí, Reasignar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}