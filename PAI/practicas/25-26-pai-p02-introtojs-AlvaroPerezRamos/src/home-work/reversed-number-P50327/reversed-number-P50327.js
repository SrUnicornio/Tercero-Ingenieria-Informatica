/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Reversed number.
 *   The program reverses a given number.
 * @link https://jutge.org/problems/P50327_en
 */
'use strict';

let inputNumber = '';

/**
 * Reverses the digits of a number.
 * @param {number} number
 * @returns {number} - Reversed number
 */
const reverseNumber = (number) => {
  let reversed = '';
  for (let i = number.length - 1; i >= 0; i--) {
    reversed += number[i];
  }
  return reversed;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const result = reverseNumber(inputNumber);
  console.log(result);
};

process.stdin.on('data', (data) => {
  inputNumber = data.toString().trim();
});

process.stdin.on('end', main);