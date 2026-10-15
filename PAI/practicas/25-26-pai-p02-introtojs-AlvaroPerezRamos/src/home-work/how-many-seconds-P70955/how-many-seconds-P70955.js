/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc How many seconds. 
 *    Calcula cuántos segundos hay en un número dado de anio, dias, horas, minutos y segundos.
 * @link https://jutge.org/problems/P70955_en
 */
'use strict';

let inputValues = [];

/**
 * Calcula el total de segundos.
 * @param {number} years
 * @param {number} days
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 * @returns {number}
 */
const computeTotalSeconds = (years, days, hours, minutes, seconds) => {
  const SECONDS_IN_A_MINUTE = 60;
  const SECONDS_IN_AN_HOUR = 3600; // 60 * 60
  const SECONDS_IN_A_DAY = 86400; // 24 * 3600
  const SECONDS_IN_A_YEAR = 31536000; // 365 * 86400

  return (years * SECONDS_IN_A_YEAR) +
         (days * SECONDS_IN_A_DAY) +
         (hours * SECONDS_IN_AN_HOUR) +
         (minutes * SECONDS_IN_A_MINUTE) +
         seconds;
};

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const [years, days, hours, minutes, seconds] = inputValues;

  const totalSeconds = computeTotalSeconds(years, days, hours, minutes, seconds);
  console.log(totalSeconds);
};

process.stdin.on('data', (data) => {
  inputValues = data
    .toString()
    .trim()
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10));
});

process.stdin.on('end', main);