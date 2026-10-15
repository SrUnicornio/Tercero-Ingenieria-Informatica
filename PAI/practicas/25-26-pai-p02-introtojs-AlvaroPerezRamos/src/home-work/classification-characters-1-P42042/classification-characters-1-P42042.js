/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Clasificación de caracteres.
 *   Vocals, consonantes, mayusculas, minúsculas.
 * @link https://jutge.org/problems/P42042_en
 */

'use strict';

const VOCALS = 'aeiouAEIOU';

let inputString = '';

/**
 * Clasifica un carácter como vocal o consonante.
 * @param {String} character
 * @returns {String} - 'vowel' o 'consonant'
 */
const isVowel = (character) => {
  return VOCALS.includes(character) ? 'vowel' : 'consonant';
};

/**
 * Clasifica un carácter como mayúscula o minúscula.
 * @param {String} character
 * @returns {String} - 'uppercase' o 'lowercase'
 */
const isUpperCase = (character) => {
  return character === character.toUpperCase() ? 'uppercase' : 'lowercase';
};

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const character = inputString.trim();
  const upperOrLowerCase = isUpperCase(character);
  const vowelOrConsonant = isVowel(character);

  console.log(`${upperOrLowerCase}\n${vowelOrConsonant}`);
};

process.stdin.on('data', (data) => {
  inputString = data.toString();
});

process.stdin.on('end', main);