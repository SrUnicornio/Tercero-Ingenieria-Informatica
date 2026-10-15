/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Sum of fractions
 *    
 * @see {@link https://jutge.org/problems/P76024_en}
 */

import { describe, expect, test } from '@jest/globals';
import { sumOfFractions } from './sum-of-fractions-P76024';

describe('sumOfFractions', () => {
  test('basic sequence', () => {
    expect(sumOfFractions(1, 3, 1))
      .toBeCloseTo(1 + 1 / 2 + 1 / 3);
  });

  test('single term', () => {
    expect(sumOfFractions(5, 5, 2)).toBeCloseTo(1 / 5);
  });

  test('step skips values', () => {
    expect(sumOfFractions(1, 5, 2))
      .toBeCloseTo(1 + 1 / 3 + 1 / 5);
  });
});

/* ----------------------------- Jutge TESTS ------------------------------ */

describe('Jutge tests', () => {
  test('case 1', () => {
    expect(sumOfFractions(1, 3, 1)).toBeCloseTo(1.8333);
  });

  test('case 2', () => {
    expect(sumOfFractions(5, 5, 2)).toBeCloseTo(0.2000);
  });

  test('case 3', () => {
    expect(sumOfFractions(5, 6, 3)).toBeCloseTo(0.2000);
  });

  test('case 4', () => {
    expect(sumOfFractions(5, 7, 2)).toBeCloseTo(0.3429);
  });
});