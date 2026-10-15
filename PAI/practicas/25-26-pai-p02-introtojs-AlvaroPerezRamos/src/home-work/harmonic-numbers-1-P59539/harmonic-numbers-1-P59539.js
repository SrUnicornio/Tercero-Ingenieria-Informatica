/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
* @desc Harmonic numbers.
*  The program calculates the nth harmonic number for a given positive integer n.
 * 
 * @link https://jutge.org/problems/P59539_en
 */
'use strict';

let inputLines = 0;

/**
 * Calculates the nth harmonic number.
 * @param {number} denominatorNumber - A positive integer
 * @returns {number} - The nth harmonic number
 */
const harmonicNumber = (denominatorNumber) => {
  let result = 0;
  if (denominatorNumber === 0) return result;
  for (let i = 1; i <= denominatorNumber; i++) {
    result += 1 / i;
  }
  return result;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const denominatorNumber = inputLines;
  if (denominatorNumber < 0) {
    console.log('Denominator number must be a positive integer.');
    return;
  }
  const result = harmonicNumber(denominatorNumber);
  console.log(result.toFixed(4));
};

process.stdin.on('data', (data) => {
  inputLines = parseInt(data.toString().trim(), 10);
});

process.stdin.on('end', main);