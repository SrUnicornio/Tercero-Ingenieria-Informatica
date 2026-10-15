/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Equal to the sum of the rest - P87920
 *   El programa, dada una secuencia de números enteros, indicará si hay algún número igual a la suma del resto.
 *   La entrada contiene varios casos. Cada caso comienza con un número n ≥ 1 seguido de n números enteros.
 *   Para cada caso, el programa indicará si hay algún número igual a la suma del resto.
 *
 * @see {@link https://jutge.org/problems/P87920_en }
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import { ComputeSecuence, checkSizeOfSecuence, sizeMustBePositive } from './ej1';

describe('Ejercicio 1', () => {
  let secuencia: ComputeSecuence;

  beforeEach(() => {
    secuencia = new ComputeSecuence([2, 4, -1, 9]);
  });

  test('Creacion correcta de la clase', () => {
    expect(secuencia).toBeInstanceOf(ComputeSecuence);
  });

  test('checkSizeOfSecuence lanza error si el tamaño no coincide', () => {
    const size = 3;
    expect(() => checkSizeOfSecuence(size, secuencia.getSequence())).
        toThrow(`El tamaño de la secuencia (${secuencia.getSequence().length}) no coincide con el número esperado (${size}).`);
  });

  test('sizeMustBePositive lanza error si el tamaño no es positivo', () => {
    let zeroSize = 0;
    let negativeSize = -5;
    expect(() => sizeMustBePositive(zeroSize)).
        toThrow(`El tamaño de la secuencia debe ser un número positivo. Se recibió: ${zeroSize}`);
    expect(() => sizeMustBePositive(negativeSize)).
        toThrow(`El tamaño de la secuencia debe ser un número positivo. Se recibió: ${negativeSize}`);
  });

  test('Caso 1', () => {
    expect(new ComputeSecuence([3, 4, -1, 2]).isEqualToSumOfRest()).
        toBe('YES');
  });

  test('Caso 2', () => {
    expect(new ComputeSecuence([1, 0, 3, 3, 1, 0, 2]).isEqualToSumOfRest()).
        toBe('NO');
  });

  test('Caso 3', () => {
    expect(new ComputeSecuence([0]).isEqualToSumOfRest()).
        toBe('YES');
  });

  test('Caso 4', () => {
    expect(new ComputeSecuence([-4]).isEqualToSumOfRest()).
      toBe('NO');
  });

  test('Caso 5', () => {
    expect(new ComputeSecuence([-3, -3]).isEqualToSumOfRest()).
      toBe('YES');
  });

  test('Caso 6', () => {
    expect(new ComputeSecuence([-1, -4, -5]).isEqualToSumOfRest()).
      toBe('YES');
  });
});