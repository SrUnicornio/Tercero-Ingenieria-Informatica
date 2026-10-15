/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * nucleotide-count.ts - Nucleotide Count
 * 
 * @description
 * This module provides a function to compute the count of each nucleotide in a given DNA string. 
 * The function takes a DNA string as input and returns an object with the counts of each nucleotide (A, C, G, T). 
 * If the input string contains any invalid characters (not A, C, G, T), the function throws an error.
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 * @see https://exercism.org/tracks/typescript/exercises/nucleotide-count
 */ 

/**
 * Computes the count of each nucleotide in a given DNA string.
 * @param dna - A string representing the DNA sequence, consisting of characters 'A', 'C', 'G', and 'T'.
 * @return An object with the counts of each nucleotide (A, C, G, T) or an error message if the input is invalid.
 */
export function nucleotideCounts(dna: string): { [nucleotide: string]: number } | string {
  if (!/^[ACGT]*$/.test(dna)) {
    throw new Error('Invalid nucleotide in strand');
  }

  const counts: { [nucleotide: string]: number } = { A: 0, C: 0, G: 0, T: 0 };
  for (const nucleotide of dna) {
    counts[nucleotide]++;
  }
  return counts;
}
