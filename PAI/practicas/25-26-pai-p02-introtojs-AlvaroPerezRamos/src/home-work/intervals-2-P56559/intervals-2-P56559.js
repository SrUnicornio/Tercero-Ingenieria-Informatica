/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Intervals 2.
 *    The program that, given two intervals, tells if one is inside the other.
 *    Print ‘=’ if the intervals are equal, ‘1’ if the first is inside the second (but they are not equal), 
 *    ‘2’ if the second is inside the first (but they are not equal), or ‘?’ otherwise.
 * 
 * @link https://jutge.org/problems/P67454_en
 */
'use strict';

let inputValues = [];

/**
 * Determines the relationship between two intervals.
 * @param {number} firstStart
 * @param {number} firstEnd
 * @param {number} secondStart
 * @param {number} secondEnd
 * @returns {string}
 */
const compareIntervals = (firstStart, firstEnd, secondStart, secondEnd) => {
  if (firstStart === secondStart && firstEnd === secondEnd) {
    return '=';
  }

  if (firstStart >= secondStart && firstEnd <= secondEnd) {
    return '1';
  }

  if (
    (firstStart < secondStart && firstEnd >= secondEnd) ||
    (firstStart <= secondStart && firstEnd > secondEnd)
  ) {
    return '2';
  }

  return '?';
};

/**
 * Program entry point.
 * @returns {void}
 */
const main = () => {
  const [
    firstIntervalStart,
    firstIntervalEnd,
    secondIntervalStart,
    secondIntervalEnd,
  ] = inputValues;

  console.log(
    compareIntervals(
      firstIntervalStart,
      firstIntervalEnd,
      secondIntervalStart,
      secondIntervalEnd,
    ),
  );
};

process.stdin.on('data', (data) => {
  inputValues = data.toString().trim().split(/\s+/).map(Number);
});

process.stdin.on('end', main);
