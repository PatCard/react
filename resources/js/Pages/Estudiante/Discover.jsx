import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Discover({ activity, attempts }) {
    const [gamePhase, setGamePhase] = useState('instructions'); // instructions, finding, matching, results
    const [foundWords, setFoundWords] = useState([]);
    const [matches, setMatches] = useState({});
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [bones, setBones] = useState(0);
    const [precision, setPrecision] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);

    const words = activity.config.words;
    const maxTime = activity.config.max_time || 300;

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
        setGamePhase('finding');
        setIsRunning(true);
        setTimer(0);
        setFoundWords([]);
        setMatches({});
        setScore(0);
        setBones(0);
        setPrecision(0);
        setCorrectAnswers([]);
        setIncorrectAnswers([]);
    };

    // Marcar palabra en el texto
    const handleWordClick = (word) => {
        if (!foundWords.includes(word)) {
            const newFoundWords = [...foundWords, word];
            setFoundWords(newFoundWords);
            setBones(newFoundWords.length);

            // Si encontró todas las palabras, pasar a fase de matching
            if (newFoundWords.length === words.length) {
                setTimeout(() => {
                    setGamePhase('matching');
                }, 500);
            }
        }
    };

    // Hacer match de palabra con definición
    const handleMatch = (word, definition) => {
        setMatches({
            ...matches,
            [word]: definition
        });
    };

    // Lanzar confeti y reproducir sonido
    const launchConfetti = () => {
        // Confeti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        
        // Sonido
        const audio = new Audio('/sounds/victoria.mp3');
        audio.volume = 0.5;
        audio.play().catch(error => {
            console.log('Error al reproducir audio:', error);
        });
    };

    // Finalizar juego
    const finishGame = () => {
        setIsRunning(false);
        
        // Calcular puntaje y separar correctas de incorrectas
        let correctMatches = 0;
        const correctAnswersTemp = [];
        const incorrectAnswersTemp = [];

        words.forEach(item => {
            if (matches[item.word] === item.definition) {
                correctMatches++;
                correctAnswersTemp.push({
                    word: item.word,
                    definition: item.definition
                });
            } else {
                incorrectAnswersTemp.push({
                    word: item.word,
                    correctDefinition: item.definition,
                    studentAnswer: matches[item.word] || 'Sin respuesta'
                });
            }
        });

        const pointsPerWord = activity.config.points_per_word || 20;
        const baseScore = correctMatches * pointsPerWord;
        
        // Bonus por velocidad
        let speedBonus = 0;
        if (timer < 120) speedBonus = 40;
        else if (timer < 240) speedBonus = 20;

        const finalScore = baseScore + speedBonus;
        const maxPossibleScore = words.length * pointsPerWord + 40;
        const calculatedPrecision = Math.round((finalScore / maxPossibleScore) * 100);
        
        setScore(finalScore);
        setPrecision(calculatedPrecision);
        setCorrectAnswers(correctAnswersTemp);
        setIncorrectAnswers(incorrectAnswersTemp);
        
        // Si logró 100%, lanzar confeti
        if (calculatedPrecision === 100) {
            setTimeout(() => {
                launchConfetti();
            }, 300);
        }
        
        // Guardar intento
        saveAttempt(finalScore, correctMatches);
        
        setGamePhase('results');
    };

    // Guardar intento en BD
    const saveAttempt = (finalScore, correctMatches) => {
        const maxScore = words.length * (activity.config.points_per_word || 20) + 40;
        
        router.post(route('estudiante.actividades.intentos.store', activity.id), {
            score: finalScore,
            time_spent: timer,
            answers: {
                found_words: foundWords,
                matches: matches,
                correct_matches: correctMatches
            },
            completed: true
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    // Resaltar palabras en el texto
    const highlightText = (text) => {
        let highlightedText = text;
        
        words.forEach(item => {
            const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
            const isFound = foundWords.includes(item.word);
            
            highlightedText = highlightedText.replace(regex, (match) => {
                return `<span class="word-highlight ${isFound ? 'found' : ''}" data-word="${item.word}">${match}</span>`;
            });
        });
        
        return highlightedText;
    };

    // Agregar event listener para clicks en palabras
    useEffect(() => {
        if (gamePhase === 'finding') {
            const handleClick = (e) => {
                if (e.target.classList.contains('word-highlight')) {
                    const word = e.target.dataset.word;
                    handleWordClick(word);
                }
            };
            
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [gamePhase, foundWords]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Head title={activity.title} />

            <style>{`
                .word-highlight {
                    background-color: #fef3c7;
                    padding: 2px 4px;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .word-highlight:hover {
                    background-color: #fde047;
                    transform: scale(1.05);
                }
                .word-highlight.found {
                    background-color: #86efac;
                    cursor: default;
                }
            `}</style>

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
                                🔍 Descubriendo Palabras
                            </span>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h2 className="font-bold text-lg mb-4 text-gray-900">
                                🐶 ¡Hola! Soy Chocolate y necesito tu ayuda
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">1️⃣</span>
                                    <span><strong>Lee el texto</strong> con mucha atención</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">2️⃣</span>
                                    <span><strong>Encuentra y haz click</strong> en las {words.length} palabras especiales</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">3️⃣</span>
                                    <span><strong>Arrastra cada palabra</strong> a su definición correcta</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-xl">🦴</span>
                                    <span>¡Por cada palabra correcta ganaré un <strong>hueso</strong>!</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6 text-center text-sm">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-2xl mb-1">📚</div>
                                <div className="font-medium">{words.length} palabras</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-2xl mb-1">⏱️</div>
                                <div className="font-medium">{Math.floor(maxTime / 60)} minutos</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-2xl mb-1">🏆</div>
                                <div className="font-medium">Hasta {words.length * 20 + 40} pts</div>
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

            {/* FASE 2: ENCONTRAR PALABRAS */}
            {gamePhase === 'finding' && (
                <div className="max-w-4xl mx-auto p-4 py-8">
                    {/* Header con timer y progreso */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl">⏱️</div>
                                <div>
                                    <div className="text-sm text-gray-600">Tiempo</div>
                                    <div className="text-xl font-bold">{formatTime(timer)}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="text-sm text-gray-600 text-right">Huesos encontrados</div>
                                    <div className="text-xl font-bold text-purple-600">
                                        🦴 {bones}/{words.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Texto con palabras resaltadas */}
                    <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            🔍 Encuentra las palabras haciendo click en ellas:
                        </h3>
                        <div 
                            className="text-lg leading-relaxed text-gray-800"
                            dangerouslySetInnerHTML={{ __html: highlightText(activity.content) }}
                        />
                    </div>

                    {/* Lista de palabras a encontrar */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-bold mb-3 text-gray-900">Palabras a encontrar:</h4>
                        <div className="flex flex-wrap gap-2">
                            {words.map((item, index) => (
                                <span
                                    key={index}
                                    className={`px-4 py-2 rounded-full font-medium transition ${
                                        foundWords.includes(item.word)
                                            ? 'bg-green-100 text-green-700 line-through'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {foundWords.includes(item.word) ? '✓ ' : ''}{item.word}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* FASE 3: HACER MATCHES */}
            {gamePhase === 'matching' && (
                <div className="max-w-4xl mx-auto p-4 py-8">
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    🐶 ¡Genial! Ahora arrastra cada palabra a su definición
                                </h2>
                            </div>
                            <div className="text-xl font-bold">⏱️ {formatTime(timer)}</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <div className="space-y-4">
                            {words.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="font-bold text-purple-600 mb-3 text-lg">
                                        {item.word}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {/* Mezclar definiciones para que no estén en orden */}
                                        {[...words].sort(() => Math.random() - 0.5).map((def, defIndex) => (
                                            <button
                                                key={defIndex}
                                                onClick={() => handleMatch(item.word, def.definition)}
                                                className={`p-3 rounded-lg border-2 transition text-left ${
                                                    matches[item.word] === def.definition
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                            >
                                                {matches[item.word] === def.definition && '✓ '}
                                                {def.definition}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={finishGame}
                            disabled={Object.keys(matches).length !== words.length}
                            className="w-full mt-6 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {Object.keys(matches).length === words.length ? '✅ Finalizar' : `Completa todas (${Object.keys(matches).length}/${words.length})`}
                        </button>
                    </div>
                </div>
            )}

            {/* FASE 4: RESULTADOS */}
            {gamePhase === 'results' && (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
                        <img 
                            src="/images/mascota.png" 
                            alt="Chocolate feliz" 
                            className="w-40 h-40 mx-auto mb-4"
                        />
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {precision === 100 
                                ? '¡Felicitaciones!' 
                                : precision >= 80 
                                ? '¡Muy bien!' 
                                : precision >= 60
                                ? '¡Buen trabajo!'
                                : '¡Sigue practicando! '}
                        </h1>
                        
                        <div className="text-6xl font-bold text-purple-600 mb-6">
                            {score} puntos
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-3xl mb-2">🦴</div>
                                <div className="font-bold text-2xl">{bones}</div>
                                <div className="text-sm text-gray-600">Huesos</div>
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
                                <div className="font-bold text-2xl">
                                    {precision}%
                                </div>
                                <div className="text-sm text-gray-600">Precisión</div>
                            </div>
                        </div>

                        {/* Resumen de respuestas */}
                        {precision < 100 && incorrectAnswers.length > 0 && (
                            <div className="mb-8 text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                    📝 Resumen de tus respuestas:
                                </h3>
                                
                                {/* Respuestas correctas */}
                                {correctAnswers.length > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                        <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                            <span>✅</span>
                                            <span>Correctas ({correctAnswers.length})</span>
                                        </h4>
                                        <div className="space-y-2">
                                            {correctAnswers.map((item, index) => (
                                                <div key={index} className="flex items-start gap-2 text-sm">
                                                    <span className="font-semibold text-green-700">{item.word}:</span>
                                                    <span className="text-gray-700">{item.definition}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Respuestas incorrectas */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                                        <span>❌</span>
                                        <span>Para mejorar ({incorrectAnswers.length})</span>
                                    </h4>
                                    <div className="space-y-3">
                                        {incorrectAnswers.map((item, index) => (
                                            <div key={index} className="text-sm">
                                                <div className="font-semibold text-red-700 mb-1">{item.word}</div>
                                                <div className="pl-4">
                                                    <div className="text-red-600">
                                                        Tu respuesta: <span className="italic">"{item.studentAnswer}"</span>
                                                    </div>
                                                    <div className="text-green-600 font-medium">
                                                        ✓ Correcto: <span>"{item.correctDefinition}"</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800 text-center">
                                        🐶 <strong>Chocolate dice:</strong> "¡Revisa las respuestas incorrectas y vuelve a intentarlo!"
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Link
                                href="/estudiante/actividades"
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
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