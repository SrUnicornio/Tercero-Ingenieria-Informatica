/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Sum of digits.
 *    Write a program that reads several numbers and prints the sum of the digits of each one.
 * 
 * @link https://jutge.org/problems/P33829_en
 */
'use strict';

let inputValues = '';

/**
 * Calculates sum of digits
 * @param {number} number
 * @returns {number} - The sum of digits
 */
const sumOfDigits = (number) => {
  let sum = 0;
  while (number > 0) {
    sum += number % 10;
    number = Math.floor(number / 10);
  }
  return sum;
};


/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const tokens = input.trim().split(/\s+/).map(Number);

  for(let i = 0; i < tokens.length(); i++) {
    const result = sumOfDigits(tokens[i]);
    console.log(`The sum of the digits of ${tokens[i]} is ${result}.`);
  }
};
process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
