import { Head } from '@inertiajs/react';
import confetti from 'canvas-confetti';

export default function ConfettiTest() {
    
    const launchConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Head title="Test Confeti" />
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-6">Prueba de Confeti</h1>
                
                <button
                    onClick={launchConfetti}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-lg"
                >
                    🎉 Lanzar Confeti
                </button>
            </div>
        </div>
    );
}