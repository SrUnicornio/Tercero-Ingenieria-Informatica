/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 *
 * Sum of fractions (P76024).
 *
 * For each input line containing three natural numbers a, b and c,
 * this program computes:
 *
 *   1/a + 1/(a + c) + 1/(a + 2c) + ... ≤ b
 *
 * The result is printed with exactly four decimal places.
 *
 * @see https://jutge.org/problems/P76024_en
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-05
 */

import * as fichero from 'fs';

/**
 * Computes the sum of fractions from a starting value up to a limit.
 *
 * @param start Initial denominator.
 * @param limit Maximum allowed denominator.
 * @param step Increment added at each iteration.
 * @returns Sum of the generated fractions.
 */
function sumOfFractions(
    start: number,
    limit: number,
    step: number,
): number {
  let sum = 0;
  let current = start;

  while (current <= limit) {
    sum += 1 / current;
    current += step;
  }

  return sum;
}

/**
 * Program entry point.
 *
 * Reads all input from standard input, processes each test case
 * and prints the result with four decimal digits.
 */
function main(): void {
  const input = fichero.readFileSync(0, 'utf8').trim();

  if (input === '') {
    return;
  }

  const lines = input.split('\n');

  for (const line of lines) {
    const [start, limit, step] =
      line.trim().split(/\s+/).map(Number);

    const result = sumOfFractions(start, limit, step);
    console.log(result.toFixed(4));
  }
}

main();
