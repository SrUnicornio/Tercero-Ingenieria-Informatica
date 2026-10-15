/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 09 2026
 * @desc Sum of multiples. 
 *  Determine the sum of all the unique multiples of particular numbers up to but not including a given number.
 *  determine the moment when someone has lived for 10^9 seconds.
 * @see {@link https://exercism.org/tracks/javascript/exercises/sum-of-multiples}
 */

'use strict';

/**
 * Determines the sum of all the unique multiples of particular numbers up to but not including a given number.
 * @param {number[]} multiples - The particular numbers to find multiples of.
 * @param {number} limit - The number up to but not including which to find multiples.
 * @return {number} The sum of all the unique multiples of the given numbers up to but not including the limit.
 */
export const sum = (multiples, limit) => {
  const uniqueMultiples = new Set();

  for (const multiple of multiples) {
    if (multiple === 0) continue;

    for (let i = multiple; i < limit; i += multiple) {
      uniqueMultiples.add(i);
    }
  }

  const result = Array.from(uniqueMultiples).reduce((acc, val) => acc + val, 0);
  return result;
}
