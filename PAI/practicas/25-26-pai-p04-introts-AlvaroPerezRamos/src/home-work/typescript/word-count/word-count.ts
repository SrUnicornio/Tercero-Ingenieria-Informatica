/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * Word Count.
 *
 * This module provides a function to count the occurrences of each word in a given string.
 *
 * @see https://exercism.org/tracks/typescript/exercises/word-count
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Counts the occurrences of each word in a given string.
 * @param word The input string to analyze.
 * @returns A Map where the keys are words and the values are their respective counts.
 */
export function count(word: string): Map<string, number> {
  const lowerCaseWords = word.toLowerCase();
  const wordArray = lowerCaseWords.match(/\b[\w']+\b/g);
  const wordCount = new Map<string, number>();
  if (wordArray) {
    wordArray.forEach((word) => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
  }
  return wordCount;
}
