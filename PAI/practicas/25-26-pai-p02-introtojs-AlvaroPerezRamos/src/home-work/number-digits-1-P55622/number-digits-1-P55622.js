/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Counting digits.
 *  The program counts the number of digits in a given non-negative integer.
 * 
 * @link https://jutge.org/problems/P55622_en
 */
'use strict';

let inputLines = '';

/**
 * Counts the number of digits in a non-negative integer.
 * @param {string} numberString
 * @returns {number} - Number of digits
 */
const countDigits = (numberString) => {
  return numberString.length;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const numberString = inputLines.trim();
  const result = countDigits(numberString);
  console.log(`The number of digits of ${numberString} is ${result}.`);
};

process.stdin.on('data', (data) => {
  inputLines += data.toString();
});

process.stdin.on('end', main);
