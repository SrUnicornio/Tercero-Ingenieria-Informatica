/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Upper to lower case letter. 
 *    Cambia una letra mayúscula a minúscula y viceversa.
 * @link https://jutge.org/problems/P98960_en
 */

'use strict';

let inputString = '';

/**
 * Clasifica un carácter como mayúscula o minúscula.
 * @param {String} character
 * @returns {String} - carácter convertido
 */
const isUpperCase = (character) => {
  return character === character.toUpperCase() ? character.toLowerCase() : character.toUpperCase()
};

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const character = inputString.trim();
  const convertedCharacter = isUpperCase(character);

  console.log(convertedCharacter);
};

process.stdin.on('data', (data) => {
  inputString = data.toString();
});

process.stdin.on('end', main);