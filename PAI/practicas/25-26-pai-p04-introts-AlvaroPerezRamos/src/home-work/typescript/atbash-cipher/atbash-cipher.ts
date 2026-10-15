/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * Atbash Cipher.
 *
 * This module implements the Atbash cipher, providing functions
 * to encode and decode text using a reversed alphabet mapping.
 *
 * @see https://exercism.org/tracks/typescript/exercises/atbash-cipher
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Alphabet used for the cipher.
 */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Reversed alphabet used for substitution.
 */
const REVERSED_ALPHABET = ALPHABET.split('')
  .reverse()
  .join('');

/**
 * Encodes a plain text string using the Atbash cipher.
 *
 * Non-alphanumeric characters are removed and the output
 * is grouped in blocks of five characters.
 *
 * @param plainText Text to encode.
 * @returns Encoded cipher text.
 */
export function encode(plainText: string): string {
  const normalizedText =
    plainText
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  let encodedText = '';

  for (let index = 0; index < normalizedText.length; index++) {
    if (index > 0 && index % 5 === 0) {
      encodedText += ' ';
    }

    const character = normalizedText[index];
    const alphabetIndex = ALPHABET.indexOf(character);

    encodedText +=
      alphabetIndex === -1 ?
        character :
        REVERSED_ALPHABET[alphabetIndex];
  }

  return encodedText;
}

/**
 * Decodes a cipher text string encoded with the Atbash cipher.
 *
 * Spaces are ignored during decoding.
 *
 * @param cipherText Text to decode.
 * @returns Decoded plain text.
 */
export function decode(cipherText: string): string {
  const normalizedText = cipherText.replace(/ /g, '');
  let decodedText = '';

  for (let index = 0; index < normalizedText.length; index++) {
    const character = normalizedText[index];
    const alphabetIndex = REVERSED_ALPHABET.indexOf(character);

    decodedText +=
      alphabetIndex === -1 ?
        character :
        ALPHABET[alphabetIndex];
  }

  return decodedText;
}
