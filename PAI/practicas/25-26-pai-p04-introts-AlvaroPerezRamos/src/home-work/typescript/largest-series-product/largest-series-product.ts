/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * Largest Series Product.
 *
 * This module provides a function to compute the largest product
 * of a contiguous sequence of digits in a numeric string.
 *
 * @see https://exercism.org/tracks/typescript/exercises/largest-series-product
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Computes the largest product of a contiguous digit sequence.
 *
 * @param digits String containing only numeric characters.
 * @param span Length of the digit sequence.
 * @returns Largest product found.
 * @throws Error if the input is invalid.
 */
export function largestProduct(digits: string, span: number): number {
  if (span < 0) {
    throw new Error('Span must not be negative');
  }
  if (span > digits.length) {
    throw new Error('Span must be smaller than string length');
  }
  if (!/^[0-9]*$/.test(digits)) {
    throw new Error('Digits input must only contain digits');
  }
  if (span === 0) {
    return 1;
  }

  let maxProduct = 0;

  for (let index = 0; index <= digits.length - span; index++) {
    let product = 1;

    for (let offset = 0; offset < span; offset++) {
      product *= Number(digits[index + offset]);
    }
    
    if (product > maxProduct) {
      maxProduct = product;
    }
  }

  return maxProduct;
}
