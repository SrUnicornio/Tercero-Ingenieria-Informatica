/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Trees palabras.
 *   The program reads three words and prints them in reverse order.
 * @link https://jutge.org/problems/P62421_en
 */
'use strict';

let inputLines = '';

/**
 * Reverses the order of three words.
 * @param {string} wordsString - A string containing three words
 * @returns {string} - The three words in reverse order
 */
const reverseWords = (wordsString) => {
  const wordsArray = wordsString.trim().split(' ');
  return `${wordsArray[2]} ${wordsArray[1]} ${wordsArray[0]}`;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const wordsString = inputLines;
  const result = reverseWords(wordsString);
  console.log(result);
};

process.stdin.on('data', (data) => {
  inputLines += data.toString();
});

process.stdin.on('end', main);