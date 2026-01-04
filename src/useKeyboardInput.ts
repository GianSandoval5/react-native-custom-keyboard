/**
 * Hook useKeyboardInput - Maneja la lógica común de input para teclados personalizados
 *
 * Este hook proporciona:
 * - Estado para el valor del input
 * - Handler para procesar teclas (agregar caracteres, borrar, etc.)
 * - Setter para actualizar el valor programáticamente
 *
 * Uso:
 * ```tsx
 * const [amount, handleAmountKey, setAmount] = useKeyboardInput();
 *
 * <InputKeyboard
 *   value={amount}
 *   onChangeText={setAmount}
 *   onCustomKeyPress={handleAmountKey}
 * />
 * ```
 */

import { useState, useCallback } from 'react';

export function useKeyboardInput(
  initialValue: string = ''
): [string, (key: string) => void, (value: string) => void] {
  const [value, setValue] = useState(initialValue);

  /**
   * Handler que procesa las teclas presionadas
   * - '⌫' (backspace): Elimina el último carácter
   * - Cualquier otro: Agrega el carácter al final
   */
  const handleKeyPress = useCallback((key: string) => {
    setValue((prev) => {
      if (key === '⌫') {
        // Borrar último carácter
        return prev.slice(0, -1);
      }
      // Agregar carácter
      return prev + key;
    });
  }, []);

  return [value, handleKeyPress, setValue];
}
