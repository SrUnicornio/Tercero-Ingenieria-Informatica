/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Mixed Juices exercise
 *   The problem is to calculate preparation times, lime cutting, and remaining orders
 *   for a juice bar based on juice types, lime sizes, and available time.
 * @see {@link https://exercism.org/tracks/javascript/exercises/mixed-juices}
 */

/**
 * Determines how long it takes to prepare a certain juice.
 *
 * @param {string} name
 * @returns {number} time in minutes
 */
const timeToMixJuice = (name) => {
  switch (name) {
    case 'Pure Strawberry Joy':
      return 0.5;
    case 'Energizer':
    case 'Green Garden':
      return 1.5;
    case 'Tropical Island':
      return 3;
    case 'All or Nothing':
      return 5;
    default:
      return 2.5;
  }
};

/**
 * Calculates the number of limes that need to be cut
 * to reach a certain supply.
 *
 * @param {number} wedgesNeeded
 * @param {string[]} limes
 * @returns {number} number of limes cut
 */
const limesToCut = (wedgesNeeded, limes) => {
  let limesCut = 0;
  let wedgesCut = 0;

  while (wedgesCut < wedgesNeeded && limesCut < limes.length) {
    const lime = limes[limesCut];
    switch (lime) {
      case 'small':
        wedgesCut += 6;
        break;
      case 'medium':
        wedgesCut += 8;
        break;
      case 'large':
        wedgesCut += 10;
        break;
    }
    limesCut++;
  }

  return limesCut;
};

/**
 * Determines which juices still need to be prepared after the end of the shift.
 *
 * @param {number} timeLeft
 * @param {string[]} orders
 * @returns {string[]} remaining orders after the time is up
 */
const remainingOrders = (timeLeft, orders) => {
  let timeUsed = 0;
  let index = 0;

  while (index < orders.length && timeUsed < timeLeft) {
    timeUsed += timeToMixJuice(orders[index]);
    index++;
  }

  return orders.slice(index);
};

export { timeToMixJuice, limesToCut, remainingOrders };