/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 09 2026
 * @desc Isbn Verifier - Exercism JavaScript Track Exercise
 *  The ISBN-10 verification process is used to validate book identification numbers. 
 *  These numbers are ten digits long (hence the name), and usually contain dashes to make them easier to read. 
 *  The last digit is a check digit, which can be any value from 0 to 10. If the check digit is 10, it is represented by an X.
 * 
 *  (d₁ * 10 + d₂ * 9 + d₃ * 8 + d₄ * 7 + d₅ * 6 + d₆ * 5 + d₇ * 4 + d₈ * 3 + d₉ * 2 + d₁₀ * 1) mod 11
 * @see {@link https://exercism.org/tracks/javascript/exercises/isbn-verifier}
 */

'use strict';

/**
 * Checks whether a given string is a valid ISBN-10 number.
 * @param {string} isbn - The ISBN-10 number to validate.
 * @return {boolean} True if the input is a valid ISBN-10 number, false otherwise.
 */
export const isValid = (isbn) => {
  const cleanedIsbn = isbn.replace(/-/g, '');
  let sumIsbnDigits = 0;
  
  if (cleanedIsbn.length !== 10) {
    return false;
  }
  
  for (let i = 0; i < 10; i++) {
    const char = cleanedIsbn[i];
    
    if (i === 9 && char === 'X') {
      sumIsbnDigits += 10;
    } else if (char >= '0' && char <= '9') {
      sumIsbnDigits += (char - '0') * (10 - i);
    } else {
      return false;
    }
  }
  return sumIsbnDigits % 11 === 0;
};
