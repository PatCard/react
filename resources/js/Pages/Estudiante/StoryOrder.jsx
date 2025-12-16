import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente de oración arrastrable
function SortableItem({ id, sentence, index }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-3 cursor-move hover:border-purple-500 hover:shadow-md transition"
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                </div>
                <div className="text-gray-800 text-base">{sentence.text}</div>
                <div className="ml-auto text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function StoryOrder({ activity, attempts }) {
    const [gamePhase, setGamePhase] = useState('instructions');
    const [sentences, setSentences] = useState([]);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [precision, setPrecision] = useState(0);
    const [results, setResults] = useState([]);

    const originalSentences = activity.config.sentences;
    const maxTime = activity.config.max_time || 300;

    // Sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Cronómetro
    useEffect(() => {
        let interval;
        if (isRunning && timer < maxTime) {
            interval = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timer, maxTime]);

    // Formatear tiempo
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Iniciar juego
    const startGame = () => {
        // Desordenar las oraciones
        const shuffled = [...originalSentences]
            .map(sentence => ({ ...sentence, tempId: `sentence-${sentence.id}` }))
            .sort(() => Math.random() - 0.5);
        
        setSentences(shuffled);
        setGamePhase('playing');
        setIsRunning(true);
        setTimer(0);
        setScore(0);
        setPrecision(0);
        setResults([]);
    };

    // Manejar el drag & drop
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSentences((items) => {
                const oldIndex = items.findIndex(item => item.tempId === active.id);
                const newIndex = items.findIndex(item => item.tempId === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Lanzar confeti
    const launchConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    // Reproducir sonido
    const playVictorySound = () => {
        const audio = new Audio('/sounds/victoria.mp3');
        audio.volume = 0.5;
        audio.play().catch(error => {
            console.log('Error al reproducir audio:', error);
        });
    };

    // Verificar el orden
    const checkOrder = () => {
        setIsRunning(false);
        
        // Comparar el orden actual con el correcto
        const resultsArray = sentences.map((sentence, index) => {
            const isCorrect = sentence.order === (index + 1);
            return {
                sentence: sentence.text,
                isCorrect,
                studentOrder: index + 1,
                correctOrder: sentence.order,
            };
        });

        setResults(resultsArray);

        // Calcular puntaje
        const correctCount = resultsArray.filter(r => r.isCorrect).length;
        const totalSentences = sentences.length;
        
        const pointsPerSentence = activity.config.points_per_sentence || 20;
        const baseScore = correctCount * pointsPerSentence;
        
        // Bonus por velocidad
        let speedBonus = 0;
        if (timer < 60 && correctCount === totalSentences) speedBonus = 40;
        else if (timer < 120 && correctCount === totalSentences) speedBonus = 20;

        const finalScore = baseScore + speedBonus;
        const maxPossibleScore = totalSentences * pointsPerSentence + 40;
        const calculatedPrecision = Math.round((finalScore / maxPossibleScore) * 100);
        
        setScore(finalScore);
        setPrecision(calculatedPrecision);
        
        // Si logró 100%, lanzar confeti y sonido
        if (calculatedPrecision === 100) {
            setTimeout(() => {
                launchConfetti();
                playVictorySound();
            }, 300);
        }
        
        // Guardar intento
        saveAttempt(finalScore, correctCount, maxPossibleScore);
        
        setGamePhase('results');
    };

    // Guardar intento en BD
    const saveAttempt = (finalScore, correctCount, maxPossibleScore) => {
        router.post(route('estudiante.actividades.intentos.store', activity.id), {
            score: finalScore,
            max_score: maxPossibleScore,
            time_spent: timer,
            answers: {
                student_order: sentences.map((s, idx) => ({ sentence: s.text, position: idx + 1 })),
                correct_count: correctCount,
                total: sentences.length,
            },
            completed: true
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    // Obtener mensaje según el resultado
    const getResultMessage = () => {
        if (precision === 100) {
            return {
                title: "¡PERFECTO! 🏆",
                message: "¡Increíble! ¡Ordenaste toda la historia correctamente! Chocolate está súper orgulloso de ti 🐶✨",
                color: "text-yellow-500"
            };
        } else if (precision >= 80) {
            return {
                title: "¡Excelente trabajo!",
                message: "¡Muy bien! Casi lo logras perfecto. Chocolate te aplaude 🐶👏",
                color: "text-green-500"
            };
        } else if (precision >= 60) {
            return {
                title: "¡Buen intento!",
                message: "Chocolate dice: '¡Vas por buen camino! Sigue practicando' 🐶💪",
                color: "text-blue-500"
            };
        } else {
            return {
                title: "¡Sigue adelante!",
                message: "Chocolate te anima: '¡No te rindas! Cada intento te hace mejor' 🐶❤️",
                color: "text-purple-500"
            };
        }
    };

    const resultMessage = gamePhase === 'results' ? getResultMessage() : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Head title={activity.title} />

            {/* FASE 1: INSTRUCCIONES */}
            {gamePhase === 'instructions' && (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
                        <div className="text-center mb-6">
                            <img 
                                src="/images/mascota.png" 
                                alt="Chocolate" 
                                className="w-32 h-32 mx-auto mb-4 animate-bounce"
                            />
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {activity.title}
                            </h1>
                            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">
                                📚 Ordenar la Historia
                            </span>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h2 className="font-bold text-lg mb-4 text-gray-900">
                                🐶 ¡Hola! Soy Chocolate y la historia se desordenó
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">1️⃣</span>
                                    <span><strong>Lee todas las oraciones</strong> con atención</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">2️⃣</span>
                                    <span><strong>Arrastra las oraciones</strong> para ordenar la historia</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">3️⃣</span>
                                    <span><strong>Ordénalas de arriba hacia abajo:</strong> Inicio → Desarrollo → Final</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">4️⃣</span>
                                    <span>Cuando estés seguro, presiona <strong>"Verificar Orden"</strong></span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6 text-center text-sm">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-2xl mb-1">📖</div>
                                <div className="font-medium">{originalSentences.length} oraciones</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-2xl mb-1">⏱️</div>
                                <div className="font-medium">{Math.floor(maxTime / 60)} minutos</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-2xl mb-1">🏆</div>
                                <div className="font-medium">Hasta {originalSentences.length * 20 + 40} pts</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href="/estudiante/actividades"
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 text-center"
                            >
                                ← Volver
                            </Link>
                            <button
                                onClick={startGame}
                                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
                            >
                                🎯 ¡Comenzar!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FASE 2: JUGANDO */}
            {gamePhase === 'playing' && (
                <div className="max-w-4xl mx-auto p-4 py-8">
                    {/* Header con timer */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    📚 Arrastra las oraciones para ordenar la historia
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    La primera oración va arriba, la última abajo
                                </p>
                            </div>
                            <div className="text-xl font-bold">⏱️ {formatTime(timer)}</div>
                        </div>
                        
                        {/* Pistas (si existen) */}
                        {activity.content && (
                            <div className="mt-4 p-1 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="text-lg">💡</div>
                                    <div className="flex-1">

                                        <div className="text-sm text-blue-800 whitespace-pre-line">
                                            {activity.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Área de drag & drop */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sentences.map(s => s.tempId)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sentences.map((sentence, index) => (
                                    <SortableItem
                                        key={sentence.tempId}
                                        id={sentence.tempId}
                                        sentence={sentence}
                                        index={index}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Botón verificar */}
                    <button
                        onClick={checkOrder}
                        className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-lg"
                    >
                        ✅ Verificar Orden
                    </button>
                </div>
            )}

            {/* FASE 3: RESULTADOS */}
            {gamePhase === 'results' && resultMessage && (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8">
                        <div className="text-center mb-6">
                            <img 
                                src="/images/mascota.png" 
                                alt="Chocolate feliz" 
                                className="w-40 h-40 mx-auto mb-4"
                            />
                            
                            <h1 className={`text-4xl font-bold mb-2 ${resultMessage.color}`}>
                                {resultMessage.title}
                            </h1>
                            
                            <p className="text-lg text-gray-600 mb-4">
                                {resultMessage.message}
                            </p>
                            
                            <div className="text-6xl font-bold text-purple-600 mb-6">
                                {score} puntos
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-3xl mb-2">📖</div>
                                    <div className="font-bold text-2xl">
                                        {results.filter(r => r.isCorrect).length}/{results.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Correctas</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-3xl mb-2">⏱️</div>
                                    <div className="font-bold text-2xl">{formatTime(timer)}</div>
                                    <div className="text-sm text-gray-600">Tiempo</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-3xl mb-2">
                                        {precision === 100 ? '⭐⭐⭐' : precision >= 80 ? '⭐⭐' : '⭐'}
                                    </div>
                                    <div className="font-bold text-2xl">{precision}%</div>
                                    <div className="text-sm text-gray-600">Precisión</div>
                                </div>
                            </div>
                        </div>

                        {/* Resumen de respuestas */}
                        {precision < 100 && (
                            <div className="mb-8 text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                    📝 Revisa el orden correcto:
                                </h3>
                                
                                <div className="space-y-2">
                                    {results.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg border-2 ${
                                                result.isCorrect
                                                    ? 'bg-green-50 border-green-300'
                                                    : 'bg-red-50 border-red-300'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                    result.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                                }`}>
                                                    {result.isCorrect ? '✓' : '✗'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-gray-800">{result.sentence}</div>
                                                    {!result.isCorrect && (
                                                        <div className="text-sm mt-1">
                                                            <span className="text-red-600">Tu orden: #{result.studentOrder}</span>
                                                            <span className="text-gray-400 mx-2">→</span>
                                                            <span className="text-green-600">Correcto: #{result.correctOrder}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800 text-center">
                                        🐶 <strong>Chocolate dice:</strong> "¡Revisa el orden correcto y vuelve a intentarlo!"
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Link
                                href="/estudiante/actividades"
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 text-center"
                            >
                                ← Ver Actividades
                            </Link>
                            <button
                                onClick={startGame}
                                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
                            >
                                🔄 Jugar de Nuevo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}