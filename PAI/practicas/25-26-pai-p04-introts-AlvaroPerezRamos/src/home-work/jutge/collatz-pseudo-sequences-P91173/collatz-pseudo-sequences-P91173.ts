/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * Collatz pseudo-sequences (P91173).
 *
 * Given parameters evenIncrement and oddIncrement, this program generates
 * Collatz-like sequences starting from a natural number. The process stops
 * when either a previously seen value is reached (cycle detected), or a value
 * strictly greater than 10^6 is produced.
 *
 * Problem statement:
 * https://jutge.org/problems/P91173_en
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-06-30
 */

import * as fichero from 'fs';

const LIMIT = 1_000_000;

/**
 * Computes the result of a Collatz pseudo-sequence.
 *
 * @param evenIncrement Value added when the current number is even.
 * @param oddIncrement Value added when the current number is odd.
 * @param start Initial value of the sequence.
 * @returns Either the cycle length, or the first value exceeding 10^6.
 */
function computePseudoCollatz(
    evenIncrement: number,
    oddIncrement: number,
    start: number
): number {
  const seen = new Map<number, number>();
  let current = start;
  let step = 0;

  while (current <= LIMIT) {
    if (seen.has(current)) {
      const firstIndex = seen.get(current)!;
      return step - firstIndex;
    }

    seen.set(current, step);
    step++;

    if (current % 2 === 0) {
      current = current / 2 + evenIncrement;
    } else {
      current = current * 3 + oddIncrement;
    }
  }
  return current;
}

/**
 * Program entry point.
 *
 * Reads several test cases from standard input. Each line contains three
 * natural numbers: evenIncrement, oddIncrement and the starting value.
 * The input ends with the line "0 0 0".
 */
function main(): void {
  const input = fichero.readFileSync(0, 'utf8').trim();

  if (input === '') {
    return;
  }

  const lines = input.split('\n');

  for (const line of lines) {
    const [evenIncrement, oddIncrement, start] =
      line.split(' ').map(Number);

    if (
      evenIncrement === 0 &&
      oddIncrement === 0 &&
      start === 0
    ) {
      break;
    }

    const result = computePseudoCollatz(
        evenIncrement,
        oddIncrement,
        start
    );

    console.log(result);
  }
}

main();
