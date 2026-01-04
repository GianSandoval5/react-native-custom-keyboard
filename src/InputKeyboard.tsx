/**
 * InputKeyboard - TextInput con teclado personalizado integrado
 *
 * Este componente:
 * - Se comporta como un TextInput estándar de React Native
 * - Automáticamente muestra/oculta el teclado personalizado al hacer focus/blur
 * - Desactiva el teclado nativo del sistema
 * - Se registra en el InputRegistry para comunicación con el Keyboard
 *
 * Inspirado en la API de Flutter para máxima simplicidad de uso.
 */

import React, { useRef, useEffect, useImperativeHandle } from 'react';
import type { TextInput, TextInputProps } from 'react-native';
import { TextInput as RNTextInput } from 'react-native';
import { inputRegistry } from './InputRegistry';
import { useKeyboard } from './useKeyboard';

export interface InputKeyboardProps extends Omit<TextInputProps, 'onKeyPress'> {
  /** Identificador del teclado a mostrar (debe coincidir con el name del Keyboard) */
  keyboardName: string;
  /** Callback que se ejecuta al presionar una tecla en el teclado personalizado */
  onCustomKeyPress?: (key: string) => void;
}

/**
 * Uso básico:
 *
 * <InputKeyboard
 *   keyboardName="numeric"
 *   value={amount}
 *   onChangeText={setAmount}
 *   onCustomKeyPress={(key) => {
 *     // Manejar tecla presionada
 *     if (key === '⌫') {
 *       // Lógica de borrar
 *     } else {
 *       // Agregar tecla al valor
 *     }
 *   }}
 * />
 */
export const InputKeyboard = React.forwardRef<TextInput, InputKeyboardProps>(
  (
    { keyboardName, onCustomKeyPress, onFocus, onBlur, ...textInputProps },
    ref
  ) => {
    const internalRef = useRef<any>(null);
    // Flag para evitar que el blur cierre el teclado al presionar teclas
    const isKeyboardPress = useRef(false);

    // Exponer la ref interna para que el parent pueda llamar .focus()
    useImperativeHandle(ref, () => internalRef.current);
    const { showKeyboard, hideKeyboard } = useKeyboard();

    // Registrar este input en el sistema al montarse
    useEffect(() => {
      const input = internalRef.current;
      if (input) {
        // Asociar input con su teclado y callback
        inputRegistry.register(input, {
          keyboardName,
          onKeyPress: onCustomKeyPress,
        });
      }

      // Limpiar registro al desmontarse
      return () => {
        if (input) {
          inputRegistry.unregister(input);
        }
      };
    }, [keyboardName, onCustomKeyPress]);

    /**
     * Manejar focus del input
     * - Marca este input como activo en el registry
     * - Muestra el teclado personalizado correspondiente
     */
    const handleFocus = (e: any) => {
      const input = internalRef.current;
      if (input) {
        inputRegistry.setCurrentInput(input);
        showKeyboard(keyboardName);
      }
      onFocus?.(e);
    };

    /**
     * Manejar blur del input
     * - Oculta el teclado solo si no fue causado por presionar una tecla
     * - El flag isKeyboardPress evita cerrar el teclado accidentalmente
     */
    const handleBlur = (e: any) => {
      // No cerrar el teclado si es un blur por presionar una tecla
      if (!isKeyboardPress.current) {
        hideKeyboard();
        inputRegistry.setCurrentInput(null);
      }
      isKeyboardPress.current = false;
      onBlur?.(e);
    };

    return (
      <RNTextInput
        ref={internalRef}
        {...textInputProps}
        showSoftInputOnFocus={false} // Desactivar teclado nativo del sistema
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }
);

InputKeyboard.displayName = 'InputKeyboard';
