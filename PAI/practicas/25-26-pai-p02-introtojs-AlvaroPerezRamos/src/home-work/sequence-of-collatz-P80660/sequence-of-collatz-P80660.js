/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Sequence of Collatz.
 *  The program shows the number of steps in the Collatz sequence for a given number.
 * 
 * @link https://jutge.org/problems/P80660_en
 */
'use strict';

let inputLines = [];

/**
 * Calculates the number of steps in the Collatz sequence for a given number.
 * @param {number} number - The starting number
 * @returns {number} - The Collatz steps count
 */
const collatzSteps = (number) => {
  let steps = 0;
  while (number > 1) {
    number = number % 2 === 0 ? number / 2 : 3 * number + 1;
    steps++;
  }
  return steps;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  for (const number of inputLines) {
    console.log(collatzSteps(number));
  }
};

process.stdin.on('data', (data) => {
  inputLines = data.toString().trim().split(/\s+/).map(Number);
});

process.stdin.on('end', main);