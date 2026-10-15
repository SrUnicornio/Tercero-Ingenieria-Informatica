/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Sum of digits.
 *    Write a program that reads several numbers and prints the sum of the digits of each one.
 * 
 * @link https://jutge.org/problems/P33829_en
 */

import { describe, expect, test } from '@jest/globals';
import { sumOfDigits, formatResult } from './sum-of-digit-P33829';

describe('sumOfDigits', () => {
  test('simple number', () => {
    expect(sumOfDigits(123)).toBe(6);
  });

  test('zero', () => {
    expect(sumOfDigits(0)).toBe(0);
  });

  test('large number', () => {
    expect(sumOfDigits(9999)).toBe(36);
  });

  test('negative numbers', () => {
    expect(sumOfDigits(-123)).toBe(6);
  });
});

/* ----------------------------- Jutge TESTS ------------------------------ */

describe('Jutge tests', () => {
  test('case 1', () => {
    const numbers = [29, 7, 0, 1020];
    const expectedSums = [11, 7, 0, 3];
    
    for (let i = 0; i < numbers.length; i++) {
      expect(formatResult(numbers[i], 
          sumOfDigits(numbers[i]))).
            toBe(`The sum of the digits of ${numbers[i]} is ${expectedSums[i]}.`);
    }
  });
});