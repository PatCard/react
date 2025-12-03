import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
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
                            Aquí tienes un resumen de la actividad de tu clase.
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
                    <button
                        disabled
                        className="pb-4 px-2 border-b-2 border-transparent text-gray-400 font-medium cursor-not-allowed"
                    >
                        👥 Estudiantes (próximamente)
                    </button>
                </div>
            </div>

            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Estudiantes */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Estudiantes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
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
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                        </div>
                    </div>
                </div>

                {/* Progreso Promedio */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Progreso Promedio</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0%</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}