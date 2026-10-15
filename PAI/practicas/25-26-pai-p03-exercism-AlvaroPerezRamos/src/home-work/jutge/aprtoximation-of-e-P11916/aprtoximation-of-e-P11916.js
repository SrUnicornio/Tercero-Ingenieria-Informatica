/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Write a program that, for every given natural number n, prints the approximation of e that we get by adding the n first terms of the series above.
 * @see {@link https://jutge.org/problems/P11916_en}
 */
'use strict';

let input = '';

/**
 * @description Function that calculates the approximation of e by adding the n first terms of the series.
 * @param {number} number - The number of terms to add.
 * @returns {number} The approximation of e.
 */
const approximationOfE = (number) => {
  let approximation = 0;
  let factorial = 1;
  for (let i = 0; i < number; i++) {
    if (i > 0) {
      factorial *= i;
    }
    approximation += 1 / factorial;
  }
  return approximation;
};

/**
 * @description Main function that reads the input and prints the approximation of e for each number.
 * @returns {void}
 */
const main = () => {
  const lines = input.trim().toString().split('\n');
  for (const line of lines) {
    const number = parseInt(line, 10);
    if (isNaN(number) || number < 0) continue;
    const result = approximationOfE(number);
    console.log(`With ${number} term(s) we get ${result.toFixed(10)}.`);
  }
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', () => {
  main();
});