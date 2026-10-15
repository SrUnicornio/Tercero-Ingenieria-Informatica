/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Resistor Color exercise
 *   The problem is to determine the numeric value of a resistor based on its color bands.
 * @see {@link https://exercism.org/tracks/javascript/exercises/resistor-color}
 */

export const colorCode = (color) => {
  const index = COLORS.indexOf(color);
  if (index === -1) {
    throw new Error('Invalid color');
  }
  return index;
};

export const COLORS = [
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "grey",
  "white"
];