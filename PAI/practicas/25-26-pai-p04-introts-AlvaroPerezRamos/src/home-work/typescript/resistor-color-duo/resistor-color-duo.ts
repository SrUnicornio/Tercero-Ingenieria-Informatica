/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 *
 * Resistor Color Duo (resistor-color-duo).
 *
 * @see https://exercism.org/tracks/typescript/exercises/resistor-color-duo
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Decodes the value of a resistor based on its color bands.
 * @param color An array of color names representing the resistor's bands.
 * @returns The numeric value of the resistor.
 */
export const decodedValue = (color: string[]) : number =>  {
  const firstDigit = COLORS.indexOf(color[0]);
  const secondDigit = COLORS.indexOf(color[1]);
  return firstDigit * 10 + secondDigit;
}

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