/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Sum of digits.
 *    Write a program that reads several numbers and prints the sum of the digits of each one.
 * 
 * @link https://jutge.org/problems/P33829_en
 */

import * as fichero from 'fs';

/**
 * Computes the sum of the digits of a given number.
 * 
 * @param numberToSumDigits - The number for which to compute the sum of digits.
 * @returns The sum of the digits of the input number.
 */
export function sumOfDigits(numberToSumDigits: number): number {
  let value = Math.abs(numberToSumDigits);
  let sum = 0;

  while (value > 0) {
    sum += value % 10;
    value = Math.floor(value / 10);
  }

  return sum;
}

/**
 * Formats the result string for a given number and its sum of digits.
 * @param numberToSumDigits - The original number for which the sum of digits was calculated.
 * @param result 
 * @returns 
 */
export function formatResult(numberToSumDigits: number, result: number): string {
  return `The sum of the digits of ${numberToSumDigits} is ${result}.`;
}

/**
 * Parses the input into an array of numbers.
 * 
 * @param input - Raw input string from stdin
 * @returns An array of numbers parsed from the input.
 */
function parseInput(input: string): number[] {
  return input.trim().split(/\s+/).map(Number);
}

function main(): void {
  const input = fichero.readFileSync(0, 'utf-8');
  const numbers = parseInput(input);

  for (const n of numbers) {
    console.log(formatResult(n, sumOfDigits(n)));
  }
}

if (require.main === module) {
  main();
}