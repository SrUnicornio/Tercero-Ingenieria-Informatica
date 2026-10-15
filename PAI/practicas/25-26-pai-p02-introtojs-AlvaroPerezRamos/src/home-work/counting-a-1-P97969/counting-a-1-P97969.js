/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Counting a.
 *  The program counts the occurrences of a specific character in a given string.
 * 
 * @link https://jutge.org/problems/P97969_en
 */
'use strict';

let inputLines = '';

/**
 * Counts the occurrences of a specific character in a string.
 * @param {string} text
 * @param {string} charToCount
 * @returns {number} - Number of occurrences
 */
const countCharacter = (text, charToCount) => {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === charToCount) {
      count++;
    }
  }
  return count;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const text = inputLines.trim();
  const result = countCharacter(text, 'a');
  console.log(result);
};

process.stdin.on('data', (data) => {
  inputLines += data.toString();
});

process.stdin.on('end', main);