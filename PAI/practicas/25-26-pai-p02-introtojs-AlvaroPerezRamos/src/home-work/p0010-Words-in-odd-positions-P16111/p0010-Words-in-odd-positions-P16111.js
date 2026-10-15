/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc P0010 Words in odd positions.
 *  Your task is to write a program that reads a sequence of words ending with a dot and prints, in reverse order, those that are in odd positions
 * 
 * @link https://jutge.org/problems/P16111_en
 */
'use strict';

let inputLines = '';

/**
 * Extracts words in odd positions from the input and returns them in reverse order.
 * @param {string[]} words - Array of words ending with a dot
 * @returns {string[]} - Words in odd positions in reverse order
 */
const getWordsInOddPositionsReversed = (words) => {
  const oddPositionWords = [];
  for (let i = 0; i < words.length; i += 2) {
    oddPositionWords.push(words[i]);
  }
  return oddPositionWords.reverse();
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const tokens = inputLines.trim().split(/\s+/);

  const words = [];
  for (const token of tokens) {
    if (token === '.') break;
    words.push(token);
  }
  if (words.length === 0) return;
  const result = getWordsInOddPositionsReversed(words);
  console.log(result.join('\n'));
};

process.stdin.on('data', (data) => {
  inputLines += data;
});

process.stdin.on('end', main);