import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            {/* Header con nombre y botón salir */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        ¡Bienvenida, {auth.user.name}!
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

            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

            {/* Sección de bienvenida */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">¡Empecemos!</h2>
                <p className="mb-4">Comienza agregando tus cursos y estudiantes para empezar a usar la plataforma.</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Agregar Estudiantes
                </button>
            </div>
        </DashboardLayout>
    );
}