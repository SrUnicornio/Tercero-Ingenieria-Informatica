/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Elements
 *   El agua (A) vence a la piedra (P) que a su vez vence al viento (V) que vence al agua. 
 *   Di quien gana el enfrentamiento, o si se produce un empate.
 *   Escribe una línea con el número 1 si vence el primero, el número 2 si vence el segundo, o un guión (‘-’) si se produce un empate.
 * 
 * @link https://jutge.org/problems/P51352_es
 */
'use strict';

let inputValues = '';

/**
 * Determines the winner between two elements.
 * @param {string} firstElement
 * @param {string} secondElement
 * @returns {string}
 */
const determineWinner = (firstElement, secondElement) => {
  if (firstElement === secondElement) {
    return '-';
  }

  if (
    (firstElement === 'A' && secondElement === 'P') ||
    (firstElement === 'P' && secondElement === 'V') ||
    (firstElement === 'V' && secondElement === 'A')
  ) {
    return '1';
  }

  return '2';
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const [firstElement, secondElement] = inputValues.trim().split(' ');
  console.log(determineWinner(firstElement, secondElement));
};

process.stdin.on('data', (data) => {
  inputValues = data.toString();
});

process.stdin.on('end', main);