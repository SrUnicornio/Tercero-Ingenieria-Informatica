/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Write a program that, for every given natural number n, prints the approximation of e that we get by adding the n first terms of the series above.
 * @see {@link https://jutge.org/problems/P11916_en}
 */

import { describe, expect, test } from '@jest/globals';
import { approximationOfE, isValidInput, formatResult } from './aprtoximation-of-e-P11916';

describe('approximationOfE', () => {
  test('0 terms gives 0', () => {
    expect(approximationOfE(0)).toBe(0);
  });

  test('1 term equals 1', () => {
    expect(approximationOfE(1)).toBeCloseTo(1);
  });

  test('2 terms equals 2', () => {
    expect(approximationOfE(2)).toBeCloseTo(2);
  });

  test('5 terms approximates e', () => {
    expect(approximationOfE(5)).toBeCloseTo(2.70833, 5);
  });

  test('10 terms closer approximation', () => {
    expect(approximationOfE(10)).toBeCloseTo(Math.E, 4);
  });
});

/* -------------------------- validation tests -------------------------- */

describe('isValidInput', () => {
  test('accepts natural numbers', () => {
    expect(isValidInput(5)).toBe(true);
  });

  test('rejects negative numbers', () => {
    expect(isValidInput(-1)).toBe(false);
  });

  test('rejects non integers', () => {
    expect(isValidInput(2.5)).toBe(false);
  });
});

/* ---------------------------- format tests ---------------------------- */

describe('formatResult', () => {
  test('formats output correctly', () => {
    const result = formatResult(3, 2.5);
    expect(result).toBe('With 3 term(s) we get 2.5000000000.');
  });
});

/* ----------------------------- Jutge TESTS ------------------------------ */

describe('Jutge tests', () => {
  test('case 1', () => {
    const n = 0;
    const expected = 'With 0 term(s) we get 0.0000000000.';
    expect(formatResult(n, approximationOfE(n))).toBe(expected);
  });

  test('case 2', () => {
    const n = 1;
    const expected = 'With 1 term(s) we get 1.0000000000.';
    expect(formatResult(n, approximationOfE(n))).toBe(expected);
  });

  test('case 3', () => {
    const n = 3;
    const expected = 'With 3 term(s) we get 2.5000000000.';
    expect(formatResult(n, approximationOfE(n))).toBe(expected);
  });

  test('case 4', () => {
    const n = 20;
    const expected = 'With 20 term(s) we get 2.7182818285.';
    expect(formatResult(n, approximationOfE(n))).toBe(expected);
  });
});