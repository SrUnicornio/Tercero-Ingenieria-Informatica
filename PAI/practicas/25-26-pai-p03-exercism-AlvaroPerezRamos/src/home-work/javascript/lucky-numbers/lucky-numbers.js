/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Collatz Conjecture exercise
 *   The problem is to calculate the number of steps required to reach 1
 *   following the Collatz conjecture rules for a given positive integer.
 * @see {@link https://exercism.org/tracks/javascript/exercises/collatz-conjecture}
 */

/**
 * Calculates the sum of the two input arrays.
 *
 * @param {number[]} array1
 * @param {number[]} array2
 * @returns {number} sum of the two arrays
 */
const twoSum = (array1, array2) => {
  let numberOfArray1 = parseInt(array1.join(''), 10);
  let numberOfArray2 = parseInt(array2.join(''), 10);
  return numberOfArray1 + numberOfArray2;
};

/**
 * Checks whether a number is a palindrome.
 *
 * @param {number} value
 * @returns {boolean} whether the number is a palindrome or not
 */
const luckyNumber = (value) => {
  const strValue = value.toString();
  return strValue === strValue.split('').reverse().join('');
};

/**
 * Determines the error message that should be shown to the user
 * for the given input value.
 *
 * @param {string|null|undefined} input
 * @returns {string} error message
 */
const errorMessage = (input) => {
  if (input === '' || input === null || input === undefined) {
    return 'Required field';
  }
  const trimmedInput = input.trim();
  if (trimmedInput === '' || isNaN(trimmedInput) || Number(trimmedInput) === 0) {
    return 'Must be a number besides 0';
  }
  return '';
};

export { twoSum, luckyNumber, errorMessage };