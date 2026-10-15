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
 * Calculates the number of steps required to reach 1 following the Collatz conjecture.
 * @param {number} numberToProcess - the starting positive integer
 * @returns {number} - the number of steps to reach 1
 */
const steps = (numberToProcess) => {
  if (numberToProcess <= 0) {
    throw new Error('Only positive integers are allowed');
  }

  let stepsCount = 0;
  while (numberToProcess !== 1) {
    numberToProcess = numberToProcess % 2 === 0 ? numberToProcess / 2 : 
        3 * numberToProcess + 1;
    stepsCount++;
  }
  return stepsCount;
};

export { steps };
