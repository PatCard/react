import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index() {
    return (
        <DashboardLayout>
            <Head title="Estudiantes" />

            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Estudiantes</h1>
                    <p className="text-gray-600 mt-2">Gestiona los estudiantes y sus cursos</p>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                    <span>+</span>
                    Agregar Estudiante
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar estudiante
                        </label>
                        <input
                            type="text"
                            placeholder="Nombre del estudiante..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Curso
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Todos los cursos</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium">
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}