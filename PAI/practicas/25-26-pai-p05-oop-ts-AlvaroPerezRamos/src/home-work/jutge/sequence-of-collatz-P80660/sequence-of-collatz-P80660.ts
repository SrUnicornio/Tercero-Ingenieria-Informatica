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
 * @author Álvaro Pérez Ramos
 * @since 2026-06-30
 * @see {@link https://jutge.org/problems/P80660_en}
 */

import * as fichero from 'fs';

/**
 * Computes the number of steps required to reach 1
 * following the Collatz sequence rules.
 */
export function collatzSteps(value: number): number {
  let current = value;
  let steps = 0;

  while (current > 1) {
    current =
      current % 2 === 0
        ? current / 2
        : current * 3 + 1;

    steps++;
  }

  return steps;
}

/**
 * Validates that the input value is a positive integer.
 * 
 * @param value - The number to validate as a positive integer.
 * @returns True if the value is a positive integer, false otherwise.
 */
export function isValidInput(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Parses the input into an array of numbers, filtering out invalid inputs.
 * 
 * @param input - Raw input string from stdin
 * @returns An array of numbers parsed from the input, filtered to include only valid inputs.
 */
function parseInput(input: string): number[] {
  if (input.trim() === '') return [];

  return input
    .trim()
    .split('\n')
    .map((line) => Number(line))
    .filter(isValidInput);
}

function main(): void {
  const input = fichero.readFileSync(0, 'utf8');
  const numbers = parseInput(input);

  for (const value of numbers) {
    console.log(collatzSteps(value));
  }
}

if (require.main === module) {
  main();
}