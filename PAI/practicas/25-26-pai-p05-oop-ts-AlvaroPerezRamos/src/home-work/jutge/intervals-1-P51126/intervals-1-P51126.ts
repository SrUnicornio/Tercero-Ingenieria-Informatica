/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Intervals 1.
 *    The program that, given two intervals, give de intersection between them.
 * 
 * @link https://jutge.org/problems/P51126_en
 */
import * as fichero from 'fs';

/**
 * Represents a closed interval [start, end].
 */
export interface Interval {
  readonly start: number;
  readonly end: number;
}

/**
 * Returns the intersection between two intervals.
 */
export function intersection(a: Interval, b: Interval): string {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);

  return start <= end ? `[${start},${end}]` : '[]';
}

/**
 * Parses the input into two intervals.
 * 
 * @param input - Raw input string from stdin 
 * @returns A tuple containing the two parsed intervals.
 */
function parseInput(input: string): [Interval, Interval] {
  const [a1, a2, b1, b2] = input.trim().split(/\s+/).map(Number);

  return [
    { start: a1, end: a2 },
    { start: b1, end: b2 },
  ];
}

function main(): void {
  const input = fichero.readFileSync(0, 'utf-8');
  const [i1, i2] = parseInput(input);

  console.log(intersection(i1, i2));
}

if (require.main === module) main();