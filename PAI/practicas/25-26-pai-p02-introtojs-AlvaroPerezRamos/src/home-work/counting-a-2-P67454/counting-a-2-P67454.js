/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Counting a 2.
 *  The program counts the sequence of characters and prints the number of letters ‘a’ in the sequence before the first period
 * 
 * @link https://jutge.org/problems/P67454_en
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
    if (text[i] === '.') return count;
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