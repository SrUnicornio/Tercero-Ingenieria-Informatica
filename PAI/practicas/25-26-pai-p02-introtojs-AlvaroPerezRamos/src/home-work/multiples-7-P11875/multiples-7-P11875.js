/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Calcula múltiplos de 7 a partir de todas las permutaciones de unos dígitos dados.
 * @link https://jutge.org/problems/P11875_en
 */

'use strict';

let inputDigits = [];

const isMultipleOfSeven = (value) => value % 7 === 0;

/**
 * Intercambia dos elementos en un array.
 * @param {number[]} array
 * @param {number} i
 * @param {number} j
 * @returns {void}
 */
const swap = (array, i, j) => {
  [array[i], array[j]] = [array[j], array[i]];
};

/**
 * Generar permutaciones y recopilar múltiplos de 7.
 * @param {number[]} digits
 * @param {number} position
 * @param {Set<number>} result
 * @returns {void}
 */
const generatePermutations = (digits, position, result) => {
  if (position === digits.length) {
    const number = Number.parseInt(digits.join(''), 10);
    if (isMultipleOfSeven(number)) {
      result.add(number);
    }
    return;
  }

  for (let i = position; i < digits.length; i++) {
    swap(digits, position, i);
    generatePermutations(digits, position + 1, result);
    swap(digits, position, i); 
  }
};

/**
 * Calcula múltiplos de 7 a partir de todas las permutaciones.
 * @param {number[]} digits
 * @returns {number[]}
 */
const computeMultiplesOf7 = (digits) => {
  const result = new Set();
  generatePermutations(digits, 0, result);
  return Array.from(result);
};

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const numberOfDigits = Number.parseInt(inputDigits[0], 10);
  const digits = inputDigits
    .slice(1, numberOfDigits + 1)
    .map((digitNumber) => Number.parseInt(digitNumber, 10));

  const multiples = computeMultiplesOf7(digits);

  if (multiples.length === 0) {
    console.log('-');
  } else {
    console.log(multiples.join('\n'));
  }
};

process.stdin.on('data', (data) => {
  inputDigits = data.toString().trim().split(/\s+/);
});

process.stdin.on('end', main);
