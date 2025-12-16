<?php

namespace App\Helpers;

class CodigoHelper
{
    /**
     * Validar que el código tenga formato correcto (6 caracteres alfanuméricos)
     */
    public static function validarFormato(string $codigo): bool
    {
        // Debe tener exactamente 6 caracteres
        if (strlen($codigo) !== 6) {
            return false;
        }
        
        // Solo debe contener letras mayúsculas y números
        return preg_match('/^[A-Z0-9]{6}$/', $codigo) === 1;
    }

    /**
     * Normalizar código: mayúsculas y sin espacios
     */
    public static function normalizar(string $codigo): string
    {
        return strtoupper(trim($codigo));
    }

    /**
     * Generar un código aleatorio de 6 caracteres
     */
    public static function generar(): string
    {
        $caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $codigo = '';
        
        for ($i = 0; $i < 6; $i++) {
            $codigo .= $caracteres[random_int(0, strlen($caracteres) - 1)];
        }
        
        return $codigo;
    }
}