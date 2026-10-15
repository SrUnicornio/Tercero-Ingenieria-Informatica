/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Two Fer exercise
 *   The problem is to implement a function that returns a string in the format "One for X, one for me."
 *   where X is a given name or "you" if no name is provided.
 * @see {@link https://exercism.org/tracks/javascript/exercises/two-fer}
 */

/**
 * Returns a string in the format "One for X, one for me." where X is the given name or "you" if no name is provided.
 * @param {string} [name] - The name to include in the string. Defaults to "you".
 * @returns {string} - The formatted string.
 */
const twoFer = (name = "you") => {
  return `One for ${name}, one for me.`;
};

export { twoFer };