import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { handleError } from '@/Utils/errorHandler'; 


export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onError: (errors) => {
                handleError(errors);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
                    
                    {/* Panel izquierdo - Formulario */}
                    <div className="p-12">
                        <div className="w-12 h-12 bg-blue-400 rounded-lg mb-8"></div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            ¡Hola de nuevo, Profesor!
                        </h1>
                        <p className="text-gray-500 mb-8">Acceso para Profesores</p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Usuario o Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    placeholder="Ingrese su usuario o correo"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ingrese su contraseña"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>

                            {/*{canResetPassword && ( Si da el tiempo se realiza
                                <Link
                                    href={route('password.request')}
                                    className="block text-center text-blue-500 text-sm mt-4 hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}*/}
                        </form>
                    </div>

                    {/* Panel derecho - Ilustración */}
                    <div className="hidden md:flex bg-gradient-to-br from-blue-100 to-cyan-100 p-12 items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="relative">
                                <div className="w-48 h-48 bg-orange-200 rounded-full"></div>
                                <div className="absolute top-8 left-8 w-32 h-32 bg-white rounded-full"></div>
                                <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-300 rounded-full"></div>
                                <div className="absolute -top-8 right-12">
                                    <div className="w-20 h-20 bg-orange-400 rounded-tr-3xl transform rotate-45"></div>
                                </div>
                                <div className="absolute bottom-12 left-12 w-24 h-16 bg-gray-700 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}