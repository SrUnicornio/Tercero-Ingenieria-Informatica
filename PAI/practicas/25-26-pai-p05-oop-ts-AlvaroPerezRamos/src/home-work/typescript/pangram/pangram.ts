/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Pangram
 *   A pangram is a sentence that contains every single letter of the alphabet at least once. For example, 
 *   the sentence "The quick brown fox jumps over the lazy dog" is a pangram, because it uses the letters 
 *   A-Z at least once (case is irrelevant).
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 * @see {@link https://exercism.org/tracks/typescript/exercises/pangram}
 */

/**
 * Checks if a sentence is a pangram, which means it contains every letter of the alphabet at least once.
 * 
 * @param sentence - The sentence to check
 * @return true if the sentence is a pangram, false otherwise
 */
export function isPangram(sentence: string): boolean {
  let alphabet: string = '\[a-z\]'
  let regex: RegExp = new RegExp(alphabet, 'gi')
  let letters: string[] = sentence.match(regex) || []
  let uniqueLetters: Set<string> = new Set(letters.map(letter => letter.toLowerCase()))
  return uniqueLetters.size === 26
}
