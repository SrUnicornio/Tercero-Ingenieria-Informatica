/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Sum of squares.
 *   The program read a natural number n and computes the sum of the squares from 1 to n.
 * @link https://jutge.org/problems/P36668_en
 */
'use strict';

let inputNumber = 0;

/**
 * Calcula la suma de los cuadrados desde 1 hasta n.
 * @param {number} n
 * @returns {number} - Suma de los cuadrados
 */
const sumOfSquares = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i * i;
  }
  return sum;
};

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const result = sumOfSquares(inputNumber);
  console.log(result);
};

process.stdin.on('data', (data) => {
  inputNumber = Number.parseInt(data.toString().trim(), 10);
});

process.stdin.on('end', main);