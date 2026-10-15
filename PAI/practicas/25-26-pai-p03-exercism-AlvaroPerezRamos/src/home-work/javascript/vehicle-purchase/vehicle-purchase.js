/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Vehicle Purchase exercise
 *   The problem is to determine if a license is needed for a vehicle,
 *   choose between two vehicle options, and calculate the resell price
 *   of a used vehicle based on its original price and age.
 * @see {@link https://exercism.org/tracks/javascript/exercises/vehicle-purchase}
 */

/**
 * Determines whether or not you need a license to operate a certain kind of vehicle.
 *
 * @param {string} kind
 * @returns {boolean} whether a license is required
 */
const needsLicense = (kind) => {
  return kind === 'car' || kind === 'truck';
};

/**
 * Helps choosing between two options by recommending the one that
 * comes first in dictionary order.
 *
 * @param {string} option1
 * @param {string} option2
 * @returns {string} a sentence of advice which option to choose
 */
const chooseVehicle = (option1, option2) => {
  const betterOption = option1 < option2 ? option1 : option2;
  return betterOption + ' is clearly the better choice.';
};

/**
 * Calculates an estimate for the price of a used vehicle in the dealership
 * based on the original price and the age of the vehicle.
 *
 * @param {number} originalPrice
 * @param {number} age
 * @returns {number} expected resell price in the dealership
 */
const calculateResellPrice = (originalPrice, age) => {
  if (age < 3) {
    return originalPrice * 0.8;
  } else if (age > 10) {
    return originalPrice * 0.5;
  } else {
    return originalPrice * 0.7;
  }
};

export { needsLicense, chooseVehicle, calculateResellPrice };
