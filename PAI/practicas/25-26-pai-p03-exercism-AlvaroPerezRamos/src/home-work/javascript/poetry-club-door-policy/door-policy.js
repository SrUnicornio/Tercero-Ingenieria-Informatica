/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * 
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Poetry Club Door Policy exercise
 *   The problem is to determine the correct character to respond with at the front or back door based on the line of the poem.
 * @see {@link https://exercism.org/tracks/javascript/exercises/poetry-club-door-policy}
 */

/**
 * Respond with the correct character, given the line of the poem, 
 * if this were said at the front door.
 *
 * @param {string} line the line of the poem to respond to
 * @returns {string} the character to respond with at the front door
 */
const frontDoorResponse = (line) => {
  return line[0];
}

/**
 * Format the password for the front-door, given the response
 * letters.
 *
 * @param {string} word the letters you responded with before
 * @returns {string} the front door password
 */
const frontDoorPassword = (word) => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Respond with the correct character, given the line of the
 * poem, if this were said at the back door.
 *
 * @param {string} line
 * @returns {string}
 */
const backDoorResponse = (line) => {
  return line.trim().slice(-1);
}

/**
 * Format the password for the back door, given the response
 * letters.
 *
 * @param {string} word the letters you responded with before
 * @returns {string} the back door password
 */
const backDoorPassword = (word) => {
  return frontDoorPassword(word) + ', please';
}

export {frontDoorResponse, frontDoorPassword, backDoorResponse, backDoorPassword}