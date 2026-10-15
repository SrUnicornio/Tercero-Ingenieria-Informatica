/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 09 2026
 * @desc Gigasecond
 *  The gigasecond is an interval of 10^9 (1,000,000,000) seconds. Given a particular moment, 
 *  determine the moment when someone has lived for 10^9 seconds.
 * @see {@link https://exercism.org/tracks/javascript/exercises/elyses-destructured-enchantments}
 */

const GIGASECOND = 1e9;

/**
 * Determines the moment when someone has lived for 10^9 seconds.
 * @param {Date} moment - The moment to calculate the gigasecond anniversary from.
 * @return {Date} The moment when someone has lived for 10^9 seconds.
 */
export const gigasecond = (date) => {
  const gigasecondDate = new Date(date.getTime());
  gigasecondDate.setSeconds(gigasecondDate.getSeconds() + GIGASECOND);
  
  return gigasecondDate;
};
