/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * 
 * @author Alvaro Perez Ramos
 * @since Jun 30 2026
 * @desc Integer division
 *    The program asks for two integers and performs integer division,
 *    displaying the quotient and the remainder.
 * @link {@link https://jutge.org/problems/P48107_en}
 */
'use strict';

let inputNumbers = [];

/**
 * Comprobar que el denominador no es cero.
 * @param {number} denominator 
 * @returns {boolean}
 */
const checkDenominator = (denominator) => {
  if (denominator === 0) {
    console.log('Error: Division by zero is not allowed.');
    return false;
  }
  return true;
}

/**
 * Calcula la división entera entre dos números.
 * @param {number} numerator 
 * @param {number} denominator 
 * @returns {{quotient: number, remainder: number}}
 */
const computeDivision = (numerator, denominator) => {
  const quotient = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  return { quotient, remainder };
}

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const divider = Number.parseInt(inputNumbers[0], 10);
  const divisor = Number.parseInt(inputNumbers[1], 10);

  if (!checkDenominator(divisor)) {
    return;
  }

  const result = computeDivision(divider, divisor);
  console.log(result.quotient, result.remainder);
}

process.stdin.on('data', (data) => {
  inputNumbers = data.toString().trim().split(/\s+/);
});

process.stdin.on('end', main);