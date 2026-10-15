/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * 
 * @author Alvaro Perez Ramos
 * @since Jun 30 2026
 * @desc Maximum of three diferent numbers
 *    The program asks for three different integers and determines the maximum among them.
 * @link {@link https://jutge.org/problems/P52847_en}
 */
'use strict';

let inputNumbers = [];

/**
 * Comprobar que los tres números son diferentes.
 * @param {number} firstNumber 
 * @param {number} secondNumber 
 * @param {number} thirdNumber 
 * @returns {boolean}
 */
const checkDifferentNumbers = (firstNumber, secondNumber, thirdNumber) => {
  if (firstNumber === secondNumber || firstNumber === thirdNumber || secondNumber === thirdNumber) {
    console.log('Error: Numbers must be different.');
    return false;
  }
  return true;
}

/**
 * Calcula el máximo entre tres números diferentes.
 * @param {number} firstNumber 
 * @param {number} secondNumber 
 * @param {number} thirdNumber 
 * @returns {number}
 */
const computeMaximum = (firstNumber, secondNumber, thirdNumber) => {
  let maximum = firstNumber;
  maximum = (secondNumber > maximum) ? secondNumber : maximum;
  maximum = (thirdNumber > maximum) ? thirdNumber : maximum;
  return maximum;
}

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const firstNumber = Number.parseInt(inputNumbers[0], 10);
  const secondNumber = Number.parseInt(inputNumbers[1], 10);
  const thirdNumber = Number.parseInt(inputNumbers[2], 10);

  if (!checkDifferentNumbers(firstNumber, secondNumber, thirdNumber)) {
    return;
  }

  const maximum = computeMaximum(firstNumber, secondNumber, thirdNumber);
  console.log(maximum);
}

process.stdin.on('data', (data) => {
  inputNumbers = data.toString().trim().split(/\s+/);
});

process.stdin.on('end', main);