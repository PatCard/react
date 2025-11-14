import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Panel de Administración" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-2xl mr-3">
                                🐶
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                                <p className="text-sm text-gray-500">Chocolate - Sistema de Lectura</p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Bienvenido, Administrador
                    </h2>
                    <p className="text-gray-600">
                        Gestiona cursos, profesores y estudiantes del sistema
                    </p>
                </div>

                {/* Cards de gestión */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Gestión de Cursos */}
                    <Link href="/admin/cursos">
                        <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión de Cursos</h3>
                            <p className="text-gray-600 mb-4">Crear y administrar cursos del colegio</p>
                            <div className="text-blue-600 font-semibold">Ir a Cursos →</div>
                        </div>
                    </Link>

                    {/* Gestión de Estudiantes - NUEVA */}
                    <Link href="/admin/estudiantes">
                        <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
                            <div className="text-5xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión de Estudiantes</h3>
                            <p className="text-gray-600 mb-4">Administrar estudiantes y asignar cursos</p>
                            <div className="text-green-600 font-semibold">Ir a Estudiantes →</div>
                        </div>
                    </Link>

                    {/* Gestión de Profesores */}
                    <Link href="/admin/profesores">
                        <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
                            <div className="text-5xl mb-4">👩‍🏫</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión de Profesores</h3>
                            <p className="text-gray-600 mb-4">Asignar cursos a profesores</p>
                            <div className="text-purple-600 font-semibold">Ir a Profesores →</div>
                        </div>
                    </Link>

                    {/* Reportes */}
                    <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200">
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Reportes Generales</h3>
                        <p className="text-gray-600 mb-4">Estadísticas del sistema</p>
                        <div className="text-gray-400 font-semibold">Próximamente</div>
                    </div>
                </div>
            </div>
        </div>
    );
}