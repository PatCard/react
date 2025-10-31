import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Bienvenido - Aprendiendo a Leer con Chocolate" />

            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
                <div className="max-w-6xl w-full">
                    
                    {/* Header con logo y título */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center text-4xl">
                                🐶
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                            Aprendiendo a Leer
                        </h1>
                        <h2 className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                            con Chocolate
                        </h2>
                        <p className="text-xl text-gray-600">
                            ¡Bienvenidos a nuestra plataforma de aprendizaje! 📚
                        </p>
                    </div>

                    {/* Dos tarjetas de acceso */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        
                        {/* Tarjeta Estudiantes */}
                        <Link href="/login_estudiante">
                            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-4 border-blue-200">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🎒</div>
                                    <h3 className="text-3xl font-bold text-blue-600 mb-3">
                                        Soy Estudiante
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Ingresa con tu código especial
                                    </p>
                                    <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-semibold inline-block">
                                        Entrar →
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Tarjeta Profesores */}
                        <Link href="/login_profesor">
                            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-4 border-purple-200">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">👩‍🏫</div>
                                    <h3 className="text-3xl font-bold text-purple-600 mb-3">
                                        Soy Profesor/a
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Acceso para docentes
                                    </p>
                                    <div className="bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-semibold inline-block">
                                        Entrar →
                                    </div>
                                </div>
                            </div>
                        </Link>

                    </div>

                    {/* Footer */}
                    <div className="text-center mt-12 text-gray-500">
                        <p>🐾 Con amor, Chocolate el perrito 🐾</p>
                    </div>

                </div>
            </div>
        </>
    );
}