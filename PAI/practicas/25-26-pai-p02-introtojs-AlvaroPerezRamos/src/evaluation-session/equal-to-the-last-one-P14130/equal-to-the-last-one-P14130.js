/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Equal to the last one.
 *  The program reads a non-empty sequence of integer numbers, and tells how many of them are equal to the last one.
 * 
 *  munber of list elements n >= 1
 *  list elements are integers
 * @link https://jutge.org/problems/P14130_en
 */
'use strict';

let input = '';

/**
 * Counts how many numbers in the array are equal to the last number.
 * @param {number[]} numbers - Array of integers
 * @returns {number} - Count of numbers equal to the last one
 */
const countEqualToLast = (numbers) => {
  const lastNumber = numbers[numbers.length - 1];
  let count = 0;

  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] === lastNumber) {
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
  const tokens = input.trim().split(/\s+/).map(Number);
  const size = tokens[0];
  const numbers = tokens.slice(1, size + 1);

  console.log(countEqualToLast(numbers));
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
