/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * Sequence of Collatz (P80660).
 *
 * This program reads a sequence of natural numbers from standard input
 * and prints, for each of them, the number of steps required to reach 1
 * following the Collatz conjecture.
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-06-30
 * @see {@link https://jutge.org/problems/P80660_en}
 */

import { describe, expect, test } from '@jest/globals';
import { collatzSteps, isValidInput, } from './sequence-of-collatz-P80660';

/* ---------------------------- domain tests ---------------------------- */

describe('collatzSteps', () => {
  test('1 requires 0 steps', () => {
    expect(collatzSteps(1)).toBe(0);
  });

  test('2 requires 1 step', () => {
    expect(collatzSteps(2)).toBe(1);
  });

  test('3 known sequence length', () => {
    // 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1
    expect(collatzSteps(3)).toBe(7);
  });

  test('6 known sequence length', () => {
    expect(collatzSteps(6)).toBe(8);
  });
});

/* --------------------------- validation tests -------------------------- */

describe('isValidInput', () => {
  test('accepts positive integers', () => {
    expect(isValidInput(5)).toBe(true);
  });

  test('rejects zero', () => {
    expect(isValidInput(0)).toBe(false);
  });

  test('rejects negatives', () => {
    expect(isValidInput(-3)).toBe(false);
  });

  test('rejects decimals', () => {
    expect(isValidInput(2.5)).toBe(false);
  });
});

/* ----------------------------- Jutge TESTS ------------------------------ */

describe('Jutge tests', () => {
  test('case 1', () => {
    const numbers = [3, 1, 40];
    const expectedSteps = [7, 0, 8];

    for (let i = 0; i < numbers.length; i++) {
      expect(collatzSteps(numbers[i])).toBe(expectedSteps[i]);
    }
  });
});