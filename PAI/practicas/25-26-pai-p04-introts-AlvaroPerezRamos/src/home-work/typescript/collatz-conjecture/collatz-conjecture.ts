/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * Collatz Conjecture.
 *
 * This module provides a function to calculate the number of steps required
 * to reach 1 in the Collatz sequence for a given positive integer.
 *
 * @see https://exercism.org/tracks/typescript/exercises/collatz-conjecture
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Calculates the number of steps required to reach 1 in the Collatz sequence.
 *
 * @param value Positive integer to analyze.
 * @returns Number of steps needed to reach 1.
 * @throws Error if the input is not a positive integer.
 */
export function steps(value: number): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('Only positive integers are allowed');
  }

  let stepsCount = 0;
  let current = value;

  while (current !== 1) {
    if (current % 2 === 0) {
      current = current / 2;
    } else {
      current = current * 3 + 1;
    }

    stepsCount++;
  }

  return stepsCount;
}
