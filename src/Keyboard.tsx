/**
 * Componente Keyboard - Teclado personalizable
 *
 * Renderiza un teclado completamente personalizable con layout dinámico.
 * Se puede usar múltiples instancias con diferentes configuraciones.
 * Solo se muestra cuando está activo según KeyboardProvider.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useKeyboardContext } from './KeyboardProvider';

type KeyboardProps = {
  /** Identificador único del teclado (debe coincidir con keyboardName de InputKeyboard) */
  name: string;
  /** Matriz de strings que define la disposición de las teclas */
  layout: string[][];
  /** Callback que se ejecuta al presionar una tecla */
  onKeyPress?: (key: string) => void;
  /** Altura de cada tecla en píxeles (default: 56) */
  keyHeight?: number;
  /** Altura total del contenedor del teclado (default: auto según contenido) */
  containerHeight?: number;
  /** Color de fondo del contenedor del teclado (default: heredado de KeyboardHost) */
  containerBackgroundColor?: string;
  /** Color de las teclas en estado normal (default: '#222') */
  keyColor?: string;
  /** Color de las teclas al ser presionadas (default: '#333') */
  keyPressedColor?: string;
  /** Color del texto de las teclas (default: '#fff') */
  textColor?: string;
  /** Tamaño de fuente del texto de las teclas (default: 18) */
  fontSize?: number;
};

export const Keyboard: React.FC<KeyboardProps> = ({
  name,
  layout,
  onKeyPress,
  keyHeight = 56,
  containerHeight,
  containerBackgroundColor,
  keyColor = '#222',
  keyPressedColor = '#333',
  textColor = '#fff',
  fontSize = 18,
}) => {
  const { activeKeyboard } = useKeyboardContext();

  // Solo renderizar si este teclado está activo
  if (activeKeyboard !== name) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        containerHeight !== undefined && { height: containerHeight },
        containerBackgroundColor !== undefined && {
          backgroundColor: containerBackgroundColor,
        },
      ]}
      pointerEvents="box-none"
    >
      {layout.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => {
            // Renderizar espacio vacío para alineación
            if (key === '') {
              return (
                <View
                  key={keyIndex}
                  style={[styles.key, { height: keyHeight }]}
                />
              );
            }

            // Detectar si es barra espaciadora
            const isSpace = key === ' ';
            // Mostrar símbolo visual para el espacio
            const displayText = isSpace ? '␣' : key;

            return (
              <Pressable
                key={keyIndex}
                style={({ pressed }) => [
                  styles.key,
                  isSpace && styles.spaceKey, // La barra espaciadora es 3x más ancha
                  {
                    height: keyHeight,
                    backgroundColor: pressed ? keyPressedColor : keyColor,
                  },
                ]}
                onPressIn={() => onKeyPress?.(key)}
              >
                <Text style={[styles.keyText, { color: textColor, fontSize }]}>
                  {displayText}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  key: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceKey: {
    flex: 3,
  },
  keyText: {
    fontWeight: '600',
  },
});
