/**
 * Layouts predefinidos para teclados personalizados
 *
 * Cada layout es una matriz de strings donde:
 * - Cada array interno representa una fila de teclas
 * - '' (string vacío) representa un espacio vacío
 * - ' ' (espacio) representa la barra espaciadora
 * - '⌫' representa la tecla de borrar
 */

/**
 * Layout numérico estándar (3x4)
 * Incluye números 0-9 y tecla de borrar
 */
export const NUMERIC_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

/**
 * Layout alfabético completo (QWERTY español)
 * Incluye:
 * - Números 0-9 en la primera fila
 * - Letras A-Z + Ñ
 * - Signos de puntuación: . , @ ;
 * - Barra espaciadora (␣)
 * - Tecla de borrar (⌫)
 */
export const ALPHA_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ['.', ',', ' ', '@', ';'],
];
