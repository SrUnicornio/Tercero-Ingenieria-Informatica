/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Collatz pseudo-sequences. Jutge P91173
 *  
 * @see {@link https://jutge.org/problems/P91173_en}
 */

import * as fichero from 'fs';

/**
 * Represents the result of computing a Collatz pseudo-sequence, including the set of terms in the sequence and the term where the cycle starts.
 */
export interface CollatzResult {
  readonly sequence: Set<number>;
  readonly cycleStart: number;
}

/**
 * Computes the Collatz pseudo-sequence until a term repeats.
 * 
 * @param evenOffset - The offset added when the current term is even.
 * @param oddOffset - The offset added when the current term is odd.
 * @param start - The starting term of the sequence.
 * @returns An object containing the set of terms in the sequence and the term where the cycle starts.
 */
export function computeCollatzSequence(
  evenOffset: number,
  oddOffset: number,
  start: number,
): CollatzResult {
  const seen = new Set<number>();
  let current = start;

  while (!seen.has(current)) {
    seen.add(current);

    if (current % 2 === 0) {
      current = current / 2 + evenOffset;
    } else {
      current = 3 * current + oddOffset;
    }
  }

  return {
    sequence: seen,
    cycleStart: current,
  };
}

/**
 * Computes the cycle length or detects overflow (>10^6).
 * 
 * @param sequence - The set of terms in the Collatz pseudo-sequence.
 * @param cycleStart - The term where the cycle starts.
 * @returns The length of the cycle or the first term that exceeds 10^6.
 */
export function computeCycleLength(
  sequence: Set<number>,
  cycleStart: number,
): number {
  const MAX_TERM = 10 ** 6;

  let length = 0;
  let counting = false;

  for (const term of sequence) {
    if (term > MAX_TERM) return term;

    if (term === cycleStart) {
      counting = true;
      length = 0;
    }

    if (counting) length++;
  }

  return length;
}

/**
 * Validates that the input values form a valid triple (evenOffset, oddOffset, start).
 * @param values - An array of numbers to validate as a triple (evenOffset, oddOffset, start).
 * @returns True if the values form a valid triple, false otherwise.
 */
export function isValidTriple(values: number[]): boolean {
  return (
    values.length === 3 &&
    values.every((v) => Number.isInteger(v))
  );
}


/**
 * Represents a valid input triple (evenOffset, oddOffset, start).
 */
interface InputTriple {
  evenOffset: number;
  oddOffset: number;
  start: number;
}

/**
 * Parses the input into an array of triples (evenOffset, oddOffset, start).
 * 
 * @param input - Raw input string from stdin 
 * @returns An array of valid input triples, ignoring invalid lines and stopping at '0 0 0'.
 */
function parseInput(input: string): InputTriple[] {
  const lines = input.trim().split('\n');
  const result: InputTriple[] = [];

  for (const line of lines) {
    if (line === '0 0 0') break;

    const values = line.split(' ').map(Number);

    if (!isValidTriple(values)) continue;

    const [evenOffset, oddOffset, start] = values;

    result.push({ evenOffset, oddOffset, start });
  }

  return result;
}

function main(): void {
  const input = fichero.readFileSync(0, 'utf-8');
  const cases = parseInput(input);

  for (const { evenOffset, oddOffset, start } of cases) {
    const { sequence, cycleStart } =
      computeCollatzSequence(evenOffset, oddOffset, start);

    const result = computeCycleLength(sequence, cycleStart);

    console.log(result);
  }
}

if (require.main === module) {
  main();
}