/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * Sequence of Collatz (P80660).
 *
 * This program reads a sequence of natural numbers from standard input
 * and prints, for each of them, the number of steps required to reach 1
 * following the Collatz conjecture.
 *
 * Problem statement:
 * https://jutge.org/problems/P80660_en
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-06-30
 */

import * as fs from 'fs';

/**
 * Computes the number of steps needed to reach 1 in the Collatz sequence.
 *
 * The Collatz sequence is defined as follows:
 * - If the current value is even, divide it by 2.
 * - If the current value is odd, multiply it by 3 and add 1.
 *
 * The function assumes that the input value is a strictly positive integer.
 *
 * @param value Initial natural number of the sequence.
 * @returns Number of steps required to reach 1.
 */
function collatzSteps(value: number): number {
  let steps = 0;
  let current = value;

  while (current > 1) {
    if (current % 2 === 0) {
      current /= 2;
    } else {
      current = current * 3 + 1;
    }
    steps++;
  }

  return steps;
}

/**
 * Program entry point.
 *
 * Reads all input values from standard input, one number per line,
 * and prints the number of Collatz steps corresponding to each value.
 */
function main(): void {
  const input = fs.readFileSync(0, 'utf8').trim();

  if (input === '') {
    return;
  }

  const numbers = input.split('\n').map((line) => Number(line));

  for (const value of numbers) {
    console.log(collatzSteps(value));
  }
}

main();
