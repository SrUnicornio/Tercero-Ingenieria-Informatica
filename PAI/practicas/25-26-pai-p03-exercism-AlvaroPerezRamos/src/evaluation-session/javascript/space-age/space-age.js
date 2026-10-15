/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 09 2026
 * @desc Space age.
 *  Determine the sum of all the unique multiples of particular numbers up to but not including a given number.
 *  determine the moment when someone has lived for 10^9 seconds.
 * @see {@link https://exercism.org/tracks/javascript/exercises/space-age}
 */

'use strict';

// Orbital periods of planets in Earth years
const ORBITAL_PERIODS = {
  Mercury: 0.2408467,
  Venus: 0.61519726,
  Earth: 1.0,
  Mars: 1.8808158,
  Jupiter: 11.862615,
  Saturn: 29.447498,
  Uranus: 84.016846,
  Neptune: 164.79132,
};

/**
 * Determines the age of a person on a given planet based on their age in seconds.
 * @param {string} planet - The name of the planet.
 * @param {number} seconds - The age of the person in seconds.
 * @returns {number} The age of the person on the given planet, rounded to two decimal places.
 */
export const age = (planet, seconds) => {
  const secondsInEarthYear = 31557600;
  
  switch (planet.toLowerCase()) {
    case 'mercury': {
      const ageOnMercury = seconds / (ORBITAL_PERIODS.Mercury * secondsInEarthYear);
      return parseFloat(ageOnMercury.toFixed(2));
    }
    case 'venus': {
      const ageOnvenus = seconds / (ORBITAL_PERIODS.Venus * secondsInEarthYear);
      return parseFloat(ageOnvenus.toFixed(2));
    }
    case 'earth': {
      const ageOnEarth = seconds / (ORBITAL_PERIODS.Earth * secondsInEarthYear);
      return parseFloat(ageOnEarth.toFixed(2));
    }
    case 'mars': {
      const ageOnMars = seconds / (ORBITAL_PERIODS.Mars * secondsInEarthYear);
      return parseFloat(ageOnMars.toFixed(2));
    }
    case 'jupiter': {
      const ageOnjupiter = seconds / (ORBITAL_PERIODS.Jupiter * secondsInEarthYear);
      return parseFloat(ageOnjupiter.toFixed(2));
    }
    case 'saturn': {
      const ageOnSaturn = seconds / (ORBITAL_PERIODS.Saturn * secondsInEarthYear);
      return parseFloat(ageOnSaturn.toFixed(2));
    }
    case 'uranus': {
      const ageOnUranus = seconds / (ORBITAL_PERIODS.Uranus * secondsInEarthYear);
      return parseFloat(ageOnUranus.toFixed(2));
    }
    case 'neptune': {
      const ageOnNeptune = seconds / (ORBITAL_PERIODS.Neptune * secondsInEarthYear);
      return parseFloat(ageOnNeptune.toFixed(2));
    }
    default:
      throw new Error('not a planet');
  }
};