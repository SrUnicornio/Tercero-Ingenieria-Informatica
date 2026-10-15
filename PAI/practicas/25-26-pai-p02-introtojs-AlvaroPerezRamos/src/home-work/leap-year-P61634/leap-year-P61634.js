/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Leap year.
 *  The program says whether a given year is a leap year or not.
 * 
 * @link https://jutge.org/problems/P61634_en
 */
'use strict';

let inputLines = 0;

/**
 * Determines if a year is a leap year.
 * @param {number} year - The year to check
 * @returns {boolean} - True if leap year, false otherwise
 */
const isLeapYear = (year) => {
  if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    return true;
  }
  return false;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const year = inputLines;
  const result = isLeapYear(year);
  console.log(result ? 'YES' : 'NO');
};

process.stdin.on('data', (data) => {
  inputLines = parseInt(data.toString().trim(), 10);
});

process.stdin.on('end', main);