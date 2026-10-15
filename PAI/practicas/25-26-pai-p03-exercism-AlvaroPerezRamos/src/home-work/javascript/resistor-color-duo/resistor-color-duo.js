/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Resistor Color Duo exercise
 *   The problem is to determine the numeric value of a resistor based on its color bands.
 * @see {@link https://exercism.org/tracks/javascript/exercises/resistor-color-duo}
 */


export const decodedValue = (colors) => {
  if (colors.length < 2) {
    throw new Error('At least two colors are required');
  }
  const firstColor = colors[0];
  const secondColor = colors[1];
  if (!(firstColor in COLORS) || !(secondColor in COLORS)) {
    throw new Error('Invalid color');
  }
  return COLORS[firstColor] * 10 + COLORS[secondColor];
};

const COLORS = {
  black: 0,
  brown: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  green: 5,
  blue: 6,
  violet: 7,
  grey: 8,
  white: 9
};