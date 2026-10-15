/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * the-most-frequent-element-P66257.ts 
 * @description
 * Given two sequences of numbers, each sorted nondecreasingly, compute which number occurs more times in total in both sequences, and how many times it occurs.
 * Input: consists of several cases, each one with two sequences sorted in nondecreasing order. 
 *  Every sequence starts with its number of items n, followed by the n elements, all between 0 and 10e9. Suppose that every n is between 0 and 105, 
 *  and that at least one of the two sequences is not empty.
 * Output: For every case, print which number occurs more times (the largest in the event of a tie), and how many times it occurs
 *  
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 * P63414 - Common numbers
 * @see https://exercism.org/tracks/typescript/exercises/all-your-base
 */

import * as fichero from 'fs';

/**
 * Reads the input from a file, processes each case, and prints the results.
 */
function readLine(): void {
  let input = fichero.readFileSync(0, 'utf8').trim();
  if (input === '') {
    return;
  }
  main(input);
}

/**
 * Main function that processes the input and computes the required output for each case.
 */
function main(input: string): void {
  const lines = input.split('\n').map(line => line.trim()).filter(line => line !== '');
  let index = 0;

  while (index < lines.length) {
    const sequenceA = parseSequence(lines[index++]);
    const sequenceB = parseSequence(lines[index++]);
    
    const result = computeMostFrequent(sequenceA, sequenceB);
    console.log(result);
  }
}

/**
 * Parses a line of input into a sequence of numbers, ignoring the first number which indicates the count.
 * @param line A string representing a sequence of numbers, where the first number is the count of subsequent numbers.
 * @return An array of numbers representing the sequence.
 */
function parseSequence(line: string): number[] {
  const parts = line.split(' ').map(Number);
  return parts.slice(3);
}

/**
 * Computes which number occurs more times in total in both sequences, and how many times it occurs.
 * @param sequenceA The first sequence of numbers.
 * @param sequenceB The second sequence of numbers.
 * @return A string indicating the number that occurs most frequently and its count.
 */
function computeMostFrequent(sequenceA: number[], sequenceB: number[]): string {
  const countMap: Map<number, number> = new Map();
  for (const number of sequenceA) {
    countMap.set(number, (countMap.get(number) || 0) + 1);
  }
  for (const number of sequenceB) {
    countMap.set(number, (countMap.get(number) || 0) + 1);
  }

  let mostFrequentNumber: [number, number] = [0, 0];
  countMap.forEach((count, number) => {
    if (count > mostFrequentNumber[1]) {
      mostFrequentNumber = [number, count];
    }
  });
  return `${mostFrequentNumber[0]} ${mostFrequentNumber[1]}`;
}

readLine();