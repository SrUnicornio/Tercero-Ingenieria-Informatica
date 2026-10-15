/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Intervals 1.
 *    The program that, given two intervals, give de intersection between them.
 * 
 * @link https://jutge.org/problems/P51126_en
 */

import { describe, expect, test } from '@jest/globals';
import { intersection } from './intervals-1-P51126';

describe('intersection', () => {
  test('overlapping intervals', () => {
    expect(
      intersection({ start: 1, end: 5 }, { start: 3, end: 7 }),
    ).toBe('[3,5]');
  });

  test('touching intervals', () => {
    expect(
      intersection({ start: 1, end: 3 }, { start: 3, end: 6 }),
    ).toBe('[3,3]');
  });

  test('disjoint intervals', () => {
    expect(
      intersection({ start: 1, end: 2 }, { start: 3, end: 4 }),
    ).toBe('[]');
  });
});

/* ----------------------------- Jutge TESTS ------------------------------ */

describe('Jutge tests', () => {
  test('case 1', () => {
    const intervals = [
      { start: 20, end: 30 },
      { start: 10, end: 40 },
    ];

    expect(intersection(intervals[0], intervals[1])).toBe('[20,30]');
  });

  test('case 2', () => {
    const intervals = [
      { start: 10, end: 20 },
      { start: 10, end: 20 },
    ];

    expect(intersection(intervals[0], intervals[1])).toBe('[10,20]');
  });
  
  test('case 3', () => {
    const intervals = [
      { start: 20, end: 30 },
      { start: 10, end: 20 },
    ];

    expect(intersection(intervals[0], intervals[1])).toBe('[20,20]');
  });

  test('case 4', () => {
    const intervals = [
      { start: 10, end: 20 },
      { start: 30, end: 40 },
    ];

    expect(intersection(intervals[0], intervals[1])).toBe('[]');  
  });
});