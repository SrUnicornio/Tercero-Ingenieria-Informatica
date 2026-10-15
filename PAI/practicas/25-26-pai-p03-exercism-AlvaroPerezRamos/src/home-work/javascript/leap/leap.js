/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Leap exercise
 *   The problem is to determine if a given year is a leap year based on specific rules.
 * @see {@link https://exercism.org/tracks/javascript/exercises/leap}
 */

/**
 * Determines if a given year is a leap year.
 *
 * @param {number} year
 * @returns {boolean} true if leap year, false otherwise
 */
export const isLeap = (year) => {
  if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    return true;
  }
  return false;
};
