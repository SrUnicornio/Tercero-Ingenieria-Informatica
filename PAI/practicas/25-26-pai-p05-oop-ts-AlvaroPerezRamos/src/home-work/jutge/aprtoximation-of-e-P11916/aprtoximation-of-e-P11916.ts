/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Write a program that, for every given natural number n, prints the approximation of e that we get by adding the n first terms of the series above.
 * @see {@link https://jutge.org/problems/P11916_en}
 */

import * as fichero from 'fs';

/**
 * @description Function that calculates the approximation of e by adding the n first terms of the series.
 * @param {number} number - The number of terms to add.
 * @returns {number} The approximation of e.
 */
export function approximationOfE(terms: number): number {
  let approximation = 0;
  let factorial = 1;

  for (let i = 0; i < terms; i++) {
    if (i > 0) factorial *= i;
    approximation += 1 / factorial;
  }

  return approximation;
}

/**
 * @description Validates that the input value is a non-negative integer.
 * @param value - The value to validate.
 * @returns {boolean} True if the value is a non-negative integer, false otherwise.
 */
export function isValidInput(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

/**
 * @description Formats the result of the approximation of e for a given number of terms.
 * @param terms - The number of terms used in the approximation.
 * @param value - The calculated approximation of e.
 * @returns A formatted string with the result of the approximation.
 */
export function formatResult(terms: number, value: number): string {
  return `With ${terms} term(s) we get ${value.toFixed(10)}.`;
}

/**
 * @description Parses the raw input string into an array of valid numbers representing the number of terms for each approximation.
 * @param input - The raw input string containing the number of terms for each approximation, separated by newlines.
 * @returns An array of valid numbers representing the number of terms for each approximation.
 */
function parseInput(input: string): number[] {
  return input
    .trim()
    .split('\n')
    .map((line) => Number.parseInt(line, 10))
    .filter(isValidInput);
}

/**
 * @description The main function that orchestrates reading input, processing the approximations, and outputting the results.
 * It reads the number of terms for each approximation from standard input, calculates the approximation of e for each, and prints the results.
 */
function main(): void {
  const input = fichero.readFileSync(0, 'utf-8');
  const values = parseInput(input);

  for (const terms of values) {
    const result = approximationOfE(terms);
    console.log(formatResult(terms, result));
  }
}

if (require.main === module) {
  main();
}