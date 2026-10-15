/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 *
 * Leap (leap).
 *
 * @see https://exercism.org/tracks/typescript/exercises/leap
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Determines if a given year is a leap year.
 * @param year The year to check.
 * @returns {boolean} True if the year is a leap year, false otherwise.
 */
export function isLeap(year: number): boolean {
  if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    return true;
  }
  return false;
}
