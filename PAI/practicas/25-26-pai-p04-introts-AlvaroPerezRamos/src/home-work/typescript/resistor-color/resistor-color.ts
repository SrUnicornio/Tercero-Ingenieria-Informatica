/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 *
 * Resistor Color (resistor-color).
 *
 * @see https://exercism.org/tracks/typescript/exercises/resistor-color
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Returns the numerical value of a resistor color code.
 *
 * The function takes an array of two color names representing the first two bands of a resistor.
 * @param code An array of two color names representing the resistor's bands.
 * @returns The numeric value of the resistor based on the color code.
 */
export const colorCode = (code: string) : number => COLORS.indexOf(code);

/**
 * List of colors corresponding to their digit values.
 */
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
