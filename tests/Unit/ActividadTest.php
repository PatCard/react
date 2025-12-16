<?php

/**
 * Test del 4 al 5
 * PRUEBAS UNITARIAS: VALIDACIÓN DE ACTIVIDADES PEDAGÓGICAS
 * 
 * Test-04: Validar actividad Descubrir requiere mínimo 3 palabras (4 iteraciones)
 *          - 3 palabras (válido)
 *          - 2 palabras (inválido)
 *          - 1 palabra (inválido)
 *          - 0 palabras (inválido)
 * 
 * Test-05: Validar actividad Ordenar requiere mínimo 3 oraciones (4 iteraciones)
 *          - 3 oraciones (válido)
 *          - 2 oraciones (inválido)
 *          - 1 oración (inválido)
 *          - 0 oraciones (inválido)
 * 
 * Total: 8 validaciones
 */

namespace Tests\Unit;

use Tests\TestCase;
use App\Helpers\ActividadValidator;

class ActividadTest extends TestCase
{
    /**
     * Test-04: Validar mínimo 3 palabras en Descubrir (4 iteraciones)
     * @dataProvider palabrasProvider
     */
    public function test_04_validar_minimo_palabras(array $config, bool $esperado, string $caso): void
    {
        $resultado = ActividadValidator::validarMinimoPalabras($config);
        $this->assertEquals($esperado, $resultado, "Falló caso: {$caso}");
    }

    public static function palabrasProvider(): array
    {
        return [
            '3 palabras (válido)' => [
                ['words' => [
                    ['word' => 'perro', 'definition' => 'Animal'],
                    ['word' => 'gato', 'definition' => 'Animal'],
                    ['word' => 'casa', 'definition' => 'Lugar'],
                ]],
                true,
                '3 palabras (mínimo válido)'
            ],
            '2 palabras (inválido)' => [
                ['words' => [
                    ['word' => 'perro', 'definition' => 'Animal'],
                    ['word' => 'gato', 'definition' => 'Animal'],
                ]],
                false,
                '2 palabras (menos del mínimo)'
            ],
            '1 palabra (inválido)' => [
                ['words' => [
                    ['word' => 'perro', 'definition' => 'Animal'],
                ]],
                false,
                '1 palabra'
            ],
            '0 palabras (inválido)' => [
                ['words' => []],
                false,
                'array vacío'
            ],
        ];
    }

    /**
     * Test-05: Validar mínimo 3 oraciones en Ordenar (4 iteraciones)
     * @dataProvider oracionesProvider
     */
    public function test_05_validar_minimo_oraciones(array $config, bool $esperado, string $caso): void
    {
        $resultado = ActividadValidator::validarMinimoOraciones($config);
        $this->assertEquals($esperado, $resultado, "Falló caso: {$caso}");
    }

    public static function oracionesProvider(): array
    {
        return [
            '3 oraciones (válido)' => [
                ['sentences' => [
                    'El zorro estaba hambriento.',
                    'Vio uvas en la parra.',
                    'Intentó alcanzarlas.'
                ]],
                true,
                '3 oraciones (mínimo válido)'
            ],
            '2 oraciones (inválido)' => [
                ['sentences' => [
                    'El zorro estaba hambriento.',
                    'Vio uvas en la parra.',
                ]],
                false,
                '2 oraciones (menos del mínimo)'
            ],
            '1 oración (inválido)' => [
                ['sentences' => [
                    'El zorro estaba hambriento.',
                ]],
                false,
                '1 oración'
            ],
            '0 oraciones (inválido)' => [
                ['sentences' => []],
                false,
                'array vacío'
            ],
        ];
    }
}