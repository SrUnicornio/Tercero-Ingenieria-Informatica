/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 09 2026
 * @desc Prime Factors - Exercism JavaScript Track Exercise
 *   The prime factors of a natural number are the prime numbers that divide that number exactly, without leaving a remainder.
 * @see {@link https://exercism.org/tracks/javascript/exercises/prime-factors}
 */

'use strict';

/**
 * Returns the prime factors of a given natural number.
 * @param {number} numberCandidate - The natural number to factorize.
 * @return {number[]} An array containing the prime factors of the input number.
 */
export const primeFactors = (numberCandidate) => {
  const factors = [];
  let divisor = 2;

  while (numberCandidate >= 2) {
    if (numberCandidate % divisor === 0) {
      factors.push(divisor);
      numberCandidate /= divisor;
    } else {
      divisor++;
    }
  }
  
  return factors;
};