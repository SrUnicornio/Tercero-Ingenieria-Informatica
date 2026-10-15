/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Comparison of words.
 *   The program compares two words and determines their lexicographical order.
 * @link https://jutge.org/problems/P90226_en
 */
'use strict';

let words = [];

/**
 * Compara dos palabras lexicográficamente.
 * @param {String} word1
 * @param {String} word2
 * @returns {String} - a < b, a > b, a = b
*/
const compareWords = (word1, word2) => {
  if (word1 < word2) {
    return `${word1} < ${word2}`;
  } else if (word1  > word2) {
    return `${word1} > ${word2}`;
  } else {
    return `${word1} = ${word2}`;
  }
};

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const [word1, word2] = words;
  const result = compareWords(word1, word2);
  console.log(result);
};

process.stdin.on('data', (data) => {
  words = data.toString().trim().split(' ');
});

process.stdin.on('end', main);