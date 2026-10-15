/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Intervals 1.
 *    The program that, given two intervals, give de intersection between them.
 * 
 * @link https://jutge.org/problems/P51126_en
 */
'use strict';

let inputValues = [];

/**
 * Compares two intervals and returns their relationship.
 * @param {number} firstIntervalStart - Start of the first interval
 * @param {number} firstIntervalEnd - End of the first interval
 * @param {number} secondIntervalStart - Start of the second interval
 * @param {number} secondIntervalEnd - End of the second interval
 * @returns {string} - The relationship between the intervals or 'empty set' if they do not intersect
 */
const intersection = (firstIntervalStart, firstIntervalEnd, secondIntervalStart, secondIntervalEnd) => {
  const startMax = Math.max(firstIntervalStart, secondIntervalStart);
  const endMin = Math.min(firstIntervalEnd, secondIntervalEnd);

  if (startMax <= endMin) {
    return `[${startMax},${endMin}]`;
  } else {
    return '[]';
  }
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const [
    firstIntervalStart,
    firstIntervalEnd,    
    secondIntervalStart,
    secondIntervalEnd,
  ] = inputValues;

  const result = intersection(
    firstIntervalStart,
    firstIntervalEnd,
    secondIntervalStart,
    secondIntervalEnd,
  );

  console.log(result);
};

process.stdin.on('data', (data) => {
  inputValues = data.toString().trim().split(/\s+/).map(Number);
});

process.stdin.on('end', main);
