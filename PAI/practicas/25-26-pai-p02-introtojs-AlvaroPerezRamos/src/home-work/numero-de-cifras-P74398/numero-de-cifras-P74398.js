/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
* @desc Number of digits.
*  The program calculates the number of digits of a given positive integer n in different bases 2-16.
 * 
 * @link https://jutge.org/problems/P74398_es
 */
'use strict';

let inputLines = 0;

/**
 * Counts the number of digits of a positive integer in a given base.
 * @param {number} number - A positive integer
 * @param {number} base - An integer between 2 and 16
 * @returns {number} - Number of digits
 */
const countDigitsInBase = (number, base) => {
  let count = 0;
  do {
    number = Math.floor(number / base);
    count++;
  } while (number > 0);
  return count;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const number = inputLines;
  if (number < 0) {
    console.log('Number must be a positive integer.');
    return;
  }
  for (let base = 2; base <= 16; base++) {
    const result = countDigitsInBase(number, base);
    console.log(`Base ${base}: ${result} cifras.`);
  }
};

process.stdin.on('data', (data) => {
  inputLines = parseInt(data.toString().trim(), 10);
});

process.stdin.on('end', main);