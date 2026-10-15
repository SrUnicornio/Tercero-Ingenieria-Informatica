// @ts-check
/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Bird Watcher exercise
 *   The problem is to calculate the total bird count, determine the number of birds seen in a specific week,
 *   and fix a counting mistake by increasing the bird count for every second day.
 * @see {@link https://exercism.org/tracks/javascript/exercises/bird-watcher}
 */

/**
 * Calculates the total bird count.
 *
 * @param {number[]} birdsPerDay
 * @returns {number} total bird count
 */
const totalBirdCount = (birdsPerDay) => {
  let totalBirds = 0;
  for (let i = 0; i < birdsPerDay.length; i++) {
    totalBirds += birdsPerDay[i];
  }
  return totalBirds;
};

/**
 * Calculates the total number of birds seen in a specific week.
 *
 * @param {number[]} birdsPerDay
 * @param {number} week
 * @returns {number} birds counted in the given week
 */
const birdsInWeek = (birdsPerDay, week) => {
  const daysInWeek = 7;
  const startIndex = (week - 1) * daysInWeek;
  const endIndex = startIndex + daysInWeek;
  let birdsCount = 0;
  for (let i = startIndex; i < endIndex; i++) {
    birdsCount += birdsPerDay[i] || 0; // Handle cases where the index might be out of bounds
  }

  return birdsCount;
};

/**
 * Fixes the counting mistake by increasing the bird count
 * by one for every second day.
 *
 * @param {number[]} birdsPerDay
 * @returns {void} should not return anything
 */
const fixBirdCountLog = (birdsPerDay) => {
  let day = 0;
  for (let i = 0; i < birdsPerDay.length; i++) {
    if (day % 2 === 0) {
      birdsPerDay[i] += 1;
    }
    day++;
  }
};

export { totalBirdCount, birdsInWeek, fixBirdCountLog };
