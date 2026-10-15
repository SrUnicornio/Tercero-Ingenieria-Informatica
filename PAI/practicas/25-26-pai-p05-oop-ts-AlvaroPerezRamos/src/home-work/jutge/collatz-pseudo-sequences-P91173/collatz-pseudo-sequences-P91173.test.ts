/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Collatz pseudo-sequences. Jutge P91173
 *  
 * @see {@link https://jutge.org/problems/P91173_en}
 */


import { describe, expect, test } from '@jest/globals';
import {
  computeCollatzSequence,
  computeCycleLength,
  isValidTriple,
} from './collatz-pseudo-sequences-P91173';

/* -------------------------- sequence tests -------------------------- */

describe('computeCollatzSequence', () => {
  test('produces non-empty sequence', () => {
    const result = computeCollatzSequence(1, 1, 2);
    expect(result.sequence.size).toBeGreaterThan(0);
  });
});

/* -------------------------- cycle length ---------------------------- */

describe('computeCycleLength', () => {
  test('cycle of length 1', () => {
    const seq = new Set([1]);
    expect(computeCycleLength(seq, 1)).toBe(1);
  });

  test('counts cycle correctly', () => {
    const seq = new Set([5, 7, 9, 7]);
    expect(computeCycleLength(seq, 7)).toBe(2);
  });

  test('returns overflow term', () => {
    const seq = new Set([2, 3, 1_000_001]);
    expect(computeCycleLength(seq, 2)).toBe(1_000_001);
  });
});

/* ---------------------------- validation ---------------------------- */

describe('isValidTriple', () => {
  test('valid triple', () => {
    expect(isValidTriple([1, 2, 3])).toBe(true);
  });

  test('invalid length', () => {
    expect(isValidTriple([1, 2])).toBe(false);
  });

  test('non integers rejected', () => {
    expect(isValidTriple([1, 2.5, 3])).toBe(false);
  });
});

/* ----------------------------- Jutge TESTS ------------------------------ */

describe('Jutge tests', () => {
  test('case 1', () => {
    const result = computeCollatzSequence(1, 5, 8);
    expect(computeCycleLength(result.sequence, result.cycleStart)).toBe(3);
  });

  test('case 2', () => {
    const result = computeCollatzSequence(0, 5, 0);
    expect(computeCycleLength(result.sequence, result.cycleStart)).toBe(1);
  });
  
  test('case 3', () => {
    const result = computeCollatzSequence(10, 11, 3);
    expect(computeCycleLength(result.sequence, result.cycleStart)).toBe(1);
  });

  test('case 4', () => {
    const result = computeCollatzSequence(7, 3, 6);
    expect(computeCycleLength(result.sequence, result.cycleStart)).toBe(35);
  });

  test('case 5', () => {
    const result = computeCollatzSequence(1, 999, 1000000);
    expect(computeCycleLength(result.sequence, result.cycleStart)).toBe(1501002);
  });

  test('case 6', () => {
    const result = computeCollatzSequence(433, 805, 215476);
    expect(computeCycleLength(result.sequence, result.cycleStart)).toBe(490);
  });

  test('case 7', () => {
    const result = computeCollatzSequence(0, 1, 333333);
    expect(computeCycleLength(result.sequence, result.cycleStart)).toBe(3);
  });
});