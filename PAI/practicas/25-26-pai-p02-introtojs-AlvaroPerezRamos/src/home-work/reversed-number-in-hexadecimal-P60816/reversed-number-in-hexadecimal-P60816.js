/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Reversed Number in Hexadecimal.
 *  Escribe un programa que lea un número natural N y escriba su representación hexadecimal con las cifras en orden inverso.
 * @link https://jutge.org/problems/P60816_en
 */
'use strict';

let input = '';

/**
 * Converts a natural number to its reversed hexadecimal representation.
 * @param {number} number - A natural number N
 * @returns {string} - The reversed hexadecimal representation of N
 */
const reversedHexadecimal = (number) => {
  if (number === 0) return '0';
  let hexString = '';
  while (number > 0) {
    const remainder = number % 16;
    hexString += remainder.toString(16).toUpperCase();
    number = Math.floor(number / 16);
  }
  return hexString;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const number = parseInt(input.trim(), 10);
  const result = reversedHexadecimal(number);
  console.log(result);
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);