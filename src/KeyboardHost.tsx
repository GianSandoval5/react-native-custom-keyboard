/**
 * KeyboardHost - Contenedor animado para teclados personalizados
 *
 * Este componente:
 * - Maneja la animación de entrada/salida del teclado
 * - Gestiona el safe area automáticamente (Android/iOS)
 * - Renderiza solo el teclado activo según el contexto
 * - Se posiciona en la parte inferior de la pantalla
 *
 * Debe colocarse FUERA del ScrollView principal, típicamente
 * al final del árbol de componentes dentro de KeyboardProvider.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useKeyboardContext } from './KeyboardProvider';

/** Altura base del teclado en píxeles */
const KEYBOARD_HEIGHT = 280;

/**
 * Componente interno que maneja la lógica del teclado
 * Requiere estar dentro de SafeAreaProvider
 */
const KeyboardHostContent: React.FC<{
  children: React.ReactNode;
  height?: number;
  backgroundColor?: string;
}> = ({ children, height = KEYBOARD_HEIGHT, backgroundColor = '#111' }) => {
  const { activeKeyboard } = useKeyboardContext();
  const insets = useSafeAreaInsets(); // Obtiene safe area del dispositivo
  const totalHeight = height + insets.bottom; // Altura total incluyendo safe area
  const [translateY] = useState(new Animated.Value(totalHeight)); // Estado de animación

  // Encontrar el hijo (Keyboard) que coincida con el nombre activo
  const activeChild = useMemo(() => {
    return React.Children.toArray(children).find((child) => {
      if (
        React.isValidElement(child) &&
        (child.props as any).name === activeKeyboard
      ) {
        return true;
      }
      return false;
    });
  }, [children, activeKeyboard]);

  // Obtener altura personalizada del Keyboard activo si existe
  const activeKeyboardHeight = useMemo(() => {
    if (
      React.isValidElement(activeChild) &&
      (activeChild.props as any).containerHeight
    ) {
      return (activeChild.props as any).containerHeight;
    }
    return height;
  }, [activeChild, height]);

  // Recalcular altura total cuando cambia el teclado activo
  const dynamicTotalHeight = activeKeyboardHeight + insets.bottom;

  // Animar entrada/salida del teclado cuando cambia el estado activo
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: activeKeyboard ? 0 : dynamicTotalHeight, // 0 = visible, totalHeight = oculto
      duration: 250, // Duración de la animación en ms
      useNativeDriver: true, // Usar driver nativo para mejor performance
    }).start();
  }, [activeKeyboard, translateY, dynamicTotalHeight]);

  return (
    <Animated.View
      style={[
        styles.keyboardContainer,
        {
          transform: [{ translateY }], // Animación de deslizamiento vertical
          height: dynamicTotalHeight, // Altura dinámica según Keyboard activo + safe area
          backgroundColor, // Color de fondo personalizable
        },
      ]}
    >
      {/* Contenedor del teclado */}
      <View style={{ flex: 1 }}>{activeChild}</View>
      {/* Espaciador para safe area en dispositivos con notch/gestures */}
      <View style={{ height: insets.bottom }} />
    </Animated.View>
  );
};

/**
 * Componente público que envuelve todo con SafeAreaProvider
 * El usuario no necesita agregar SafeAreaProvider manualmente
 */
export const KeyboardHost: React.FC<{
  children: React.ReactNode;
  /** Altura del teclado en píxeles (default: 280) */
  height?: number;
  /** Color de fondo del teclado (default: '#111') */
  backgroundColor?: string;
}> = ({ children, height, backgroundColor }) => {
  return (
    <SafeAreaProvider>
      <KeyboardHostContent height={height} backgroundColor={backgroundColor}>
        {children}
      </KeyboardHostContent>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // backgroundColor se aplica dinámicamente via props
  },
});
