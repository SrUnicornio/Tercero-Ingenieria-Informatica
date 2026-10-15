/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Intervals 3.
 *    The program that, given two intervals, tells if one is inside the other.
 *    Print ‘=’ if the intervals are equal, ‘1’ if the first is inside the second (but they are not equal), 
 *    ‘2’ if the second is inside the first (but they are not equal), or ‘?’ otherwise.
 * 
 * @link https://jutge.org/problems/P89265_en
 */
'use strict';

let inputValues = [];

/**
 * An interval represented as an object.
 * @typedef {{start: number, end: number}} Interval
 */

/**
 * Creates an interval object.
 * @param {number} start
 * @param {number} end
 * @returns {Interval}
 */
const createInterval = (start, end) => ({ start, end });

/**
 * Compares two intervals and returns their relationship.
 * @param {Interval} first
 * @param {Interval} second
 * @returns {string}
 */
const compareIntervals = (first, second) => {
  if (first.start === second.start && first.end === second.end) {
    return '=';
  }

  if (first.start >= second.start && first.end <= second.end) {
    return '1';
  }

  if (
    (first.start < second.start && first.end >= second.end) ||
    (first.start <= second.start && first.end > second.end)
  ) {
    return '2';
  }

  return '?';
};

/**
 * Computes the intersection of two intervals.
 * @param {Interval} first
 * @param {Interval} second
 * @returns {string}
 */
const intersectIntervals = (first, second) => {
  const start = Math.max(first.start, second.start);
  const end = Math.min(first.end, second.end);

  return start <= end ? `[${start},${end}]` : '[]';
};

const main = () => {
  const [
    firstStart,
    firstEnd,
    secondStart,
    secondEnd,
  ] = inputValues;

  const firstInterval = createInterval(firstStart, firstEnd);
  const secondInterval = createInterval(secondStart, secondEnd);

  const relation = compareIntervals(firstInterval, secondInterval);
  const intersection = intersectIntervals(firstInterval, secondInterval);

  console.log(`${relation} , ${intersection}`);
};

process.stdin.on('data', (data) => {
  inputValues = data.toString().trim().split(/\s+/).map(Number);
});

process.stdin.on('end', main);
