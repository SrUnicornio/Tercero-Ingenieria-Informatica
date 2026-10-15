/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Numbers in an interval.
 *  The program shows all the numbers in an interval [n, m] (both included) in increasing order.
 * 
 * @link https://jutge.org/problems/P97156_en
 */
'use strict';

let inputLines = [];

/**
 * Generates an array of numbers in the interval [n, m].
 * @param {number} n - Start of the interval
 * @param {number} m - End of the interval
 * @returns {number[]} - Array of numbers in the interval
 */
const numbersInInterval = (n, m) => {
  const numbers = [];
  for (let i = n; i <= m; i++) {
    numbers.push(i);
  }
  return numbers;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const [n, m] = inputLines;
  const result = numbersInInterval(n, m);
  console.log(result.join(','));
};

process.stdin.on('data', (data) => {
  inputLines = data.toString().trim().split(' ').map(Number);
});

process.stdin.on('end', main);