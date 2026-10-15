/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Lasagna exercise
 *   The problem is to calculate the remaining minutes in the oven, the preparation time in minutes, and the total time in minutes for a lasagna recipe.
 * @see {@link https://exercism.org/tracks/javascript/exercises/lasagna}
 */

/**
 * The number of minutes it takes to prepare a single layer.
 * @constant {number} EXPECTED_MINUTES_IN_OVEN - The expected number of minutes the lasagna should be in the oven.
 */
export const EXPECTED_MINUTES_IN_OVEN = 40;

/**
 * Calculate the remaining minutes in the oven, by subtracting the actual minutes in the oven from the expected minutes in the oven.
 * @param {number} minutes - the number of minutes the lasagna has been in the oven
 */
const remainingMinutesInOven = (minutes) => {
  return EXPECTED_MINUTES_IN_OVEN - minutes;
}

/**
 * Calculate the preparation time in minutes, by multiplying the number of layers by the preparation time per layer.
 * @param {number} layers - the number of layers in the lasagna
 */
const preparationTimeInMinutes = (layers) => {
  const preparationTimePerLayer = 2;
  return layers * preparationTimePerLayer;
}

/**
 * Calculate the total time in minutes, by adding the preparation time and the actual minutes in the oven.
 * @param {number} numberOfLayers - the number of layers in the lasagna
 * @param {number} actualMinutesInOven - the number of minutes the lasagna has been in the oven
 */
const totalTimeInMinutes = (numberOfLayers, actualMinutesInOven) => {
  return preparationTimeInMinutes(numberOfLayers) + actualMinutesInOven;
}

export { remainingMinutesInOven, preparationTimeInMinutes, totalTimeInMinutes }