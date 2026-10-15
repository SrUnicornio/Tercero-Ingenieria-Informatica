/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Alvaro Perez Ramos
 * @since Jun 30 2026
 * @desc First numbers
 *       The program ask for a number n, and prints all numbers between 0 and n.

 * @see {@link https://jutge.org/problems/P37500_en}
 */

'use strict';

let inputNumbers = [];

/**
 * Program entry point.
 * @returns {void}
 */
const main = () => {
  const limit = Number.parseInt(inputNumbers[0], 10);

  if (Number.isNaN(limit) || limit < 0) {
    return;
  }

  const output = [];
  for (let i = 0; i <= limit; i++) {
    output.push(i);
  }

  console.log(output.join('\n'));
};

process.stdin.on('data', (data) => {
  inputNumbers = data.toString().trim().split(/\s+/);
});

process.stdin.on('end', main);
