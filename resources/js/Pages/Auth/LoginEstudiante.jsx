import { useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function LoginEstudiante({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
    });

    const inputRefs = useRef([]);

    useEffect(() => {
        return () => {
            reset('code');
        };
    }, []);

    useEffect(() => {
        // Auto-focus en el primer input al cargar
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        if (data.code.length === 6) {
            post(route('estudiante.login'));
        }
    };

    const handleChange = (index, value) => {
        // Solo permitir letras y números
        const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (sanitized.length > 0) {
            const newCode = data.code.split('');
            newCode[index] = sanitized[0];
            const finalCode = newCode.join('').substring(0, 6);
            setData('code', finalCode);

            // Auto-avanzar al siguiente campo
            if (index < 5 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Retroceder con backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newCode = data.code.split('');
            
            if (newCode[index]) {
                // Si hay valor en el campo actual, borrarlo
                newCode[index] = '';
                setData('code', newCode.join(''));
            } else if (index > 0) {
                // Si no hay valor, ir al campo anterior y borrarlo
                newCode[index - 1] = '';
                setData('code', newCode.join(''));
                inputRefs.current[index - 1].focus();
            }
        }
        
        // Permitir navegación con flechas
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const code = pastedData.substring(0, 6);
        setData('code', code);
        
        // Focus en el último campo completado o el primero vacío
        const nextIndex = Math.min(code.length, 5);
        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    return (
        <>
            <Head title="Acceso Estudiantes" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
                    
                    {/* Panel izquierdo - Formulario */}
                    <div className="p-6 md:p-12">
                        
                        {/* Icono superior */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                                <div className="w-10 h-10 bg-orange-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-orange-400 -ml-2 mt-4" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3">
                            ¡Hola de nuevo!
                        </h1>
                        <p className="text-gray-600 text-center mb-8">
                            Ingresa tu código secreto de 6 caracteres
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            {/* Campos de código individuales */}
                            <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={data.code[index] || ''}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-10 h-14 md:w-12 md:h-16 border-2 border-gray-300 rounded-xl text-center text-xl md:text-2xl font-bold text-gray-700 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none uppercase"
                                    />
                                ))}
                            </div>

                            {errors.code && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm">
                                    {errors.code}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing || data.code.length !== 6}
                                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-lg font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                            >
                                {processing ? '🔄 Ingresando...' : (
                                    <>
                                        Entrar 🚀
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <a href="#" className="text-gray-500 text-sm hover:text-gray-700">
                                {/*❓ ¿Necesitas ayuda?*/}
                            </a>
                        </div>
                    </div>

                    {/* Panel derecho - Chocolate el perrito */}
                    <div className="hidden md:flex bg-gradient-to-br from-amber-100 to-orange-100 items-center justify-center p-12">
                        <div className="text-9xl "> {/* animate-bounce */}
                            🐶
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}