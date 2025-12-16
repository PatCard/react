<?php

/**
 * Tests del 1 al 3
 * PRUEBAS UNITARIAS: VALIDACIÓN DE CÓDIGOS DE ESTUDIANTE
 * 
 * Test-01: Validar formato de código (5 iteraciones)
 * Test-02: Normalizar código a mayúsculas (4 iteraciones)
 * Test-03: Código generado tiene formato válido (3 iteraciones)
 * 
 * Total: 12 validaciones
 */

namespace Tests\Unit;

use Tests\TestCase;
use App\Helpers\CodigoHelper;

class CodigoTest extends TestCase
{
    /**
     * Test-01: Validar formato de código (5 iteraciones)
     * @dataProvider codigosFormatoProvider
     */
    public function test_01_validar_formato_codigo(string $codigo, bool $esperado, string $caso): void
    {
        $resultado = CodigoHelper::validarFormato($codigo);
        $this->assertEquals($esperado, $resultado, "Falló caso: {$caso}");
    }

    public static function codigosFormatoProvider(): array
    {
        return [
            'código válido' => ['ABC123', true, 'código válido'],
            'muy corto' => ['AB12', false, 'muy corto (4 caracteres)'],
            'muy largo' => ['ABC1234', false, 'muy largo (7 caracteres)'],
            'con caracteres especiales' => ['AB@123', false, 'contiene @ (especial)'],
            'con minúsculas' => ['abc123', false, 'contiene minúsculas'],
        ];
    }

    /**
     * Test-02: Normalizar código (4 iteraciones)
     * @dataProvider codigosNormalizarProvider
     */
    public function test_02_normalizar_codigo(string $input, string $esperado, string $caso): void
    {
        $resultado = CodigoHelper::normalizar($input);
        $this->assertEquals($esperado, $resultado, "Falló caso: {$caso}");
    }

    public static function codigosNormalizarProvider(): array
    {
        return [
            'con espacios' => ['  abc123  ', 'ABC123', 'espacios inicio y fin'],
            'minúsculas' => ['abc123', 'ABC123', 'todo minúsculas'],
            'mixto' => ['AbC123', 'ABC123', 'mayúsculas y minúsculas'],
            'ya normalizado' => ['ABC123', 'ABC123', 'ya está en mayúsculas'],
        ];
    }

    /**
     * Test-03: Código generado tiene formato válido (3 iteraciones)
     */
    public function test_03_codigo_generado_formato_valido(): void
    {
        // Iteración 1: Verificar longitud
        $codigo = CodigoHelper::generar();
        $this->assertEquals(6, strlen($codigo), 'El código debe tener 6 caracteres');

        // Iteración 2: Verificar que solo contiene alfanuméricos válidos
        $this->assertMatchesRegularExpression(
            '/^[A-Z0-9]{6}$/', 
            $codigo,
            'El código solo debe contener letras mayúsculas y números'
        );

        // Iteración 3: Generar múltiples códigos y verificar que todos son válidos
        for ($i = 0; $i < 5; $i++) {
            $codigoNuevo = CodigoHelper::generar();
            $this->assertTrue(
                CodigoHelper::validarFormato($codigoNuevo),
                "El código generado #{$i} no tiene formato válido: {$codigoNuevo}"
            );
        }
    }
}