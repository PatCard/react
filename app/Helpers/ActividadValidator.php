<?php

namespace App\Helpers;

class ActividadValidator
{
    /**
     * Validar que actividad Descubrir tenga mínimo 3 palabras
     */
    public static function validarMinimoPalabras(array $config): bool
    {
        if (!isset($config['words']) || !is_array($config['words'])) {
            return false;
        }
        
        return count($config['words']) >= 3;
    }

    /**
     * Validar que actividad Ordenar tenga mínimo 3 oraciones
     */
    public static function validarMinimoOraciones(array $config): bool
    {
        if (!isset($config['sentences']) || !is_array($config['sentences'])) {
            return false;
        }
        
        return count($config['sentences']) >= 3;
    }
}