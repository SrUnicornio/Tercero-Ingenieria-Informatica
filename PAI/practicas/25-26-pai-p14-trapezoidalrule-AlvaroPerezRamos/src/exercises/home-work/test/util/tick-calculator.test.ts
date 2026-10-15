/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file tick-calculator.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de TickCalculator.
 *
 *   TickCalculator es una función pura sin dependencias externas, por lo
 *   que no necesita mocks. Cada test verifica que el espaciado devuelto
 *   sea de la forma 1, 2 ó 5 × 10ⁿ y que el número de divisiones que
 *   produce esté en un rango razonable (~5-10 ticks para el rango dado).
 */

import {describe, it, expect} from 'vitest';
import {TickCalculator} from
  '../../trapezoid/util/tick-calculator.js';

describe('TickCalculator', () => {
  describe('compute', () => {
    describe('casos de rango inválido o degenerado', () => {
      it('devuelve 1 cuando el rango es 0', () => {
        expect(TickCalculator.compute(0)).toBe(1);
      });

      it('devuelve 1 cuando el rango es negativo', () => {
        expect(TickCalculator.compute(-5)).toBe(1);
      });
    });

    describe('rangos en la escala de las unidades (1-10)', () => {
      it('rango 4 → espaciado 0.5', () => {
        expect(TickCalculator.compute(4)).toBe(0.5);
      });

      it('rango 7.5 → espaciado 1', () => {
        expect(TickCalculator.compute(7.5)).toBe(1);
      });

      it('rango 8 → espaciado 1 (rama normalized >= 7.5)', () => {
        expect(TickCalculator.compute(8)).toBe(1);
      });

      it('rango 10 → espaciado 1', () => {
        expect(TickCalculator.compute(10)).toBe(1);
      });
    });

    describe('rangos en la escala de las decenas (10-100)', () => {
      it('rango 40 → espaciado 5', () => {
        expect(TickCalculator.compute(40)).toBe(5);
      });

      it('rango 75 → espaciado 10', () => {
        expect(TickCalculator.compute(75)).toBe(10);
      });

      it('rango 75 → espaciado 10 (rama normalized ≥ 7.5)', () => {
        expect(TickCalculator.compute(75)).toBe(10);
      });

      it('rango 100 → espaciado 10', () => {
        expect(TickCalculator.compute(100)).toBe(10);
      });
    });

    describe('rangos en la escala de los miles', () => {
      it('rango 10000 → espaciado 1000', () => {
        expect(TickCalculator.compute(10000)).toBe(1000);
      });
    });

    describe('rangos decimales pequeños', () => {
      it('rango 0.04 → espaciado 0.005', () => {
        expect(TickCalculator.compute(0.04)).toBeCloseTo(0.005);
      });

      it('rango 4.5 → espaciado 0.5', () => {
        expect(TickCalculator.compute(4.5)).toBe(0.5);
      });
    });

    describe('el espaciado resultante siempre es de la forma 1/2/5 × 10ⁿ', () => {
      const testRanges = [1, 2, 3, 4, 5, 8, 12, 25, 50, 150, 300, 1000];

      for (const range of testRanges) {
        it(`rango ${range} produce espaciado válido (1/2/5 × 10ⁿ)`, () => {
          const spacing = TickCalculator.compute(range);
          const magnitude =
            Math.pow(10, Math.floor(Math.log10(spacing)));
          const normalized = spacing / magnitude;
          const isNiceNumber =
            Math.abs(normalized - 1) < 1e-9 ||
            Math.abs(normalized - 2) < 1e-9 ||
            Math.abs(normalized - 5) < 1e-9;
          expect(isNiceNumber).toBe(true);
        });
      }
    });

    describe('el espaciado produce entre 5 y 15 divisiones para rangos normales', () => {
      const testRanges = [4, 10, 40, 100, 1000];

      for (const range of testRanges) {
        it(`rango ${range} produce entre 5 y 15 ticks`, () => {
          const spacing = TickCalculator.compute(range);
          const tickCount = range / spacing;
          expect(tickCount).toBeGreaterThanOrEqual(5);
          expect(tickCount).toBeLessThanOrEqual(15);
        });
      }
    });
  });
});
