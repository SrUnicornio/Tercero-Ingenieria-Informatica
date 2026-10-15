/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * Two-fer (two-fer).
 *
 * @see https://exercism.org/tracks/typescript/exercises/two-fer
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Returns a string with the format "One for X, one for me.", where X is the given name or "you" if no name is provided.
 * @param name The name to include in the returned string. Defaults to "you" if not provided.
 * @returns A string formatted as "One for X, one for me." where X is the provided name or "you".
 */
export function twoFer(name: string = "you"): string {
  return `One for ${name}, one for me.`;
}
