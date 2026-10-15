/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Sum of fractions
 *    
 * @see {@link https://jutge.org/problems/P76024_en}
 */

import * as fs from 'fs';

/**
 * Computes:
 * 1/a + 1/(a+d) + 1/(a+2d) ... <= limit
 * 
 * @param start - The starting value 'a' in the sequence.
 * @param limit - The upper limit for the values in the sequence.
 * @param step - The step 'd' to be added to 'a' for each term in the sequence.
 * @returns The sum of the fractions in the sequence that are less than or equal to the limit.
 */
export function sumOfFractions(start: number, limit: number, step: number): number {
  let sum = 0;
  let value = start;

  while (value <= limit) {
    sum += 1 / value;
    value += step;
  }

  return sum;
}

/**
 * Parses the input into an array of cases, where each case is a tuple of [start, limit, step].
 * 
 * @param input - Raw input string from stdin
 * @returns An array of cases parsed from the input.
 */
function parseInput(input: string): number[][] {
  return input
    .trim()
    .split('\n')
    .map((line) => line.trim().split(/\s+/).map(Number));
}

function main(): void {
  const input = fs.readFileSync(0, 'utf-8');
  const cases = parseInput(input);

  for (const [start, limit, step] of cases) {
    console.log(sumOfFractions(start, limit, step).toFixed(4));
  }
}

if (require.main === module) {
  main();
}