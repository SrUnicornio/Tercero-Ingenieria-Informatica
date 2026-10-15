/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Avarage of a sequence of numbers
 * 
 * @link https://jutge.org/problems/P78142
 */
'use strict';

let input = '';

/**
 * Calculates the average of an array of numbers.
 * @param {number[]} numbers - An array of numbers
 * @returns {number} - The average of the numbers
 */
const calculateAverage = (numbers) => {
  let sum = 0;
  for (const n of numbers) sum += n;
  return sum / numbers.length;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const numbers = input.trim().split(/\s+/).map(Number);
  if (numbers.length === 0) return;

  const avg = calculateAverage(numbers);
  console.log(avg.toFixed(2));
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
