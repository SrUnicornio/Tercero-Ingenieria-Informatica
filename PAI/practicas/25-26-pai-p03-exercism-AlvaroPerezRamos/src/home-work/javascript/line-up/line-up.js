/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Line Up exercise
 *   The problem is to format a list of names into a specific string format.
 * @see {@link https://exercism.org/tracks/javascript/exercises/line-up}
 */

/**
 * Formats a customer's name and their position in the line.
 * @param {string} name - The customer's name.
 * @param {number} position - The customer's position in the line.
 * @returns {string} A formatted string with the customer's name and position.
 */
export const format = (name, position) => {
  const ordinalSuffix = getOrdinalSuffix(position);
  return `${name}, you are the ${position}${ordinalSuffix} customer we serve today. Thank you!`;
};

/**
 * Returns the ordinal suffix for a given number.
 * @param {number} number - The number to get the ordinal suffix for.
 * @returns {string} The ordinal suffix for the given number.
 */
const getOrdinalSuffix = (number) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }

  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};
