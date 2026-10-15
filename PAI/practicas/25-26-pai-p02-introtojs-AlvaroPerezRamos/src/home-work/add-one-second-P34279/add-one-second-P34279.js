/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Add one second.
 *   The program asks for a time in hours, minutes, and seconds,
 *   adds one second to it, and displays the new time.
 * @link https://jutge.org/problems/P34279_en
 */

'use strict';

let inputNumbers = [];

/**
 * Adds one second to a given time.
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 * @returns {{hours: number, minutes: number, seconds: number}}
 */
const addOneSecond = (hours, minutes, seconds) => {
  const SECONDS_IN_MINUTE = 60;
  const MINUTES_IN_HOUR = 60;
  const HOURS_IN_DAY = 24;
  
  const totalSeconds =
    hours * MINUTES_IN_HOUR * SECONDS_IN_MINUTE +
    minutes * SECONDS_IN_MINUTE +
    seconds +
    1;

  const normalizedSeconds = totalSeconds % (HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE);

  const newHours = Math.floor(
    normalizedSeconds / (MINUTES_IN_HOUR * SECONDS_IN_MINUTE),
  );

  const newMinutes = Math.floor(
    (normalizedSeconds % (MINUTES_IN_HOUR * SECONDS_IN_MINUTE)) / SECONDS_IN_MINUTE,
  );

  const newSeconds = normalizedSeconds % SECONDS_IN_MINUTE;

  return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
};

/**
 * Formato de tiempo con dos dígitos.
 * @param {number} timeUnit
 * @returns {string}
 */
const formatTimeUnit = (timeUnit) => {
  return timeUnit.toString().padStart(2, '0');
};

/**
 * Program entry point.
 * @returns {void}
 */
const main = () => {
  const hours = Number.parseInt(inputNumbers[0], 10);
  const minutes = Number.parseInt(inputNumbers[1], 10);
  const seconds = Number.parseInt(inputNumbers[2], 10);

  const { hours: h, minutes: m, seconds: s } = addOneSecond(hours, minutes, seconds);
  const formattedTime = `${formatTimeUnit(h)}:${formatTimeUnit(m)}:${formatTimeUnit(s)}`;
  console.log(formattedTime);
};

process.stdin.on('data', (data) => {
  inputNumbers = data.toString().trim().split(/\s+/);
});

process.stdin.on('end', main);
