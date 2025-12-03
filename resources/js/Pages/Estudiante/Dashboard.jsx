import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Head title="Mi Espacio" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-2xl">
                                🐶
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    ¡Hola, {auth.user.name}!
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {auth.user.course?.name || 'Sin curso asignado'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-gray-600 hover:text-gray-900 text-lg"
                        >
                            🚪 Salir
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    {/* Mascota Chocolate SIN fondo blanco */}
                    <div className="mb-6 flex justify-center">
                        <img 
                            src="/images/mascota.png" 
                            alt="Chocolate te da la bienvenida" 
                            className="w-48 h-48 object-contain animate-bounce drop-shadow-lg"
                        />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        ¡Bienvenido a tu espacio de aprendizaje!
                    </h2>
                    <p className="text-xl text-gray-600">
                        Aquí podrás practicar lectura con Chocolate 🐶
                    </p>
                </div>

                {/* Tarjetas de actividades (placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href="/estudiante/actividades"
                        className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
                    >
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Mis Actividades</h3>
                        <p className="text-gray-600">Ver actividades asignadas</p>
                    </Link>

                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow opacity-50">
                        <div className="text-6xl mb-4">⭐</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Mi Progreso</h3>
                        <p className="text-gray-600">Próximamente</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow opacity-50">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Mis Logros</h3>
                        <p className="text-gray-600">Próximamente</p>
                    </div>
                </div>
            </div>
        </div>
    );
}