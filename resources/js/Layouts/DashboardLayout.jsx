import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Inicio', href: '/dashboard', icon: '🏠' },
        { name: 'Estudiantes', href: '/estudiantes', icon: '👥' },
        { name: 'Actividades', href: '/actividades', icon: '📚' },
        { name: 'Progreso', href: '/progreso', icon: '📊' },
        { name: 'Configuración', href: '/configuracion', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0 px-6 mb-8">
                        <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-2xl mr-3">
                            🐶
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Chocolate</h1>
                            <p className="text-xs text-gray-500">Plataforma</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <span className="text-xl mr-3">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User info */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                    {auth.user.name.charAt(0)}
                                </span>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                <p className="text-xs text-gray-500">Profesor/a</p>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-gray-400 hover:text-gray-600"
                            >
                                🚪
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}