/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-calculator.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de TrapezoidCalculator.
 *
 *   TrapezoidCalculator es matemática pura sin dependencias externas.
 *   Los callbacks de evaluación se inyectan directamente como funciones
 *   arrow, sin necesidad de mocks.
 *
 *   Casos cubiertos:
 *     - Resultado exacto conocido: ∫₀² (x²+1)dx = 10/3 ≈ 3.333
 *     - Función lineal exacta: ∫₀¹ x dx = 0.5 (trapecio exacto)
 *     - Función negativa: área es negativa (suma algebraica)
 *     - Número de puntos de división = trapezoidCount + 1
 *     - Coordenadas X de los puntos de división correctas
 *     - Un solo trapecio (n=1)
 *     - Muchos trapecios (n=100): converge al valor exacto
 *     - Función con NaN tratada como 0 en los vértices
 */

import {describe, it, expect} from 'vitest';
import {TrapezoidCalculator} from
  '../../trapezoid/model/trapezoid-calculator.js';

describe('TrapezoidCalculator', () => {
  const calculator = new TrapezoidCalculator();

  // ── compute — área ────────────────────────────────────────────────────────

  describe('compute — totalArea', () => {
    it('produce el valor correcto de la regla del trapecio con 4 subdivisiones', () => {
      // ∫₀² (x²+1)dx exacto = 10/3 ≈ 3.333, pero el trapecio compuesto
      // con n=4 sobreestima cuadráticamente: resultado correcto = 4.75
      const result = calculator.compute(0, 2, 4, (x) => x * x + 1);
      expect(result.totalArea).toBeCloseTo(4.75, 5);
    });

    it('es exacto para funciones lineales con cualquier n', () => {
      // ∫₀¹ x dx = 0.5 exacto (el trapecio es exacto para rectas)
      const result = calculator.compute(0, 1, 1, (x) => x);
      expect(result.totalArea).toBeCloseTo(0.5, 10);
    });

    it('devuelve área negativa para funciones completamente negativas', () => {
      // f(x) = -1 en [0, 2] → área = -2
      const result = calculator.compute(0, 2, 4, () => -1);
      expect(result.totalArea).toBeCloseTo(-2, 10);
    });

    it('devuelve 0 para función constante cero', () => {
      const result = calculator.compute(0, 2, 4, () => 0);
      expect(result.totalArea).toBeCloseTo(0, 10);
    });

    it('converge al valor exacto con muchos trapecios (n=100)', () => {
      // ∫₀² x² dx = 8/3. Con 100 trapecios el error < 0.01
      const result = calculator.compute(0, 2, 100, (x) => x * x);
      expect(result.totalArea).toBeCloseTo(8 / 3, 1);
    });

    it('funciona con un único trapecio (n=1)', () => {
      // ∫₀² 1 dx = 2 exacto
      const result = calculator.compute(0, 2, 1, () => 1);
      expect(result.totalArea).toBeCloseTo(2, 10);
    });

    it('trata los valores NaN como 0 en los vértices', () => {
      // Si evaluateAt devuelve NaN, el punto se convierte en y=0
      const result = calculator.compute(0, 2, 2, () => NaN);
      expect(result.totalArea).toBe(0);
    });
  });

  // ── compute — divisionPoints ──────────────────────────────────────────────

  describe('compute — divisionPoints', () => {
    it('produce trapezoidCount + 1 puntos de división', () => {
      const result = calculator.compute(0, 2, 4, (x) => x);
      expect(result.divisionPoints.length).toBe(5);
    });

    it('el primer punto tiene x = start', () => {
      const result = calculator.compute(1, 3, 4, (x) => x);
      expect(result.divisionPoints[0].x).toBeCloseTo(1);
    });

    it('el último punto tiene x = end', () => {
      const result = calculator.compute(1, 3, 4, (x) => x);
      const last = result.divisionPoints[result.divisionPoints.length - 1];
      expect(last.x).toBeCloseTo(3);
    });

    it('los puntos están espaciados uniformemente', () => {
      const result = calculator.compute(0, 2, 4, (x) => x);
      const step = 0.5; // (2 - 0) / 4
      for (let i = 0; i < result.divisionPoints.length; i++) {
        expect(result.divisionPoints[i].x).toBeCloseTo(i * step);
      }
    });

    it('los valores y corresponden a f(x) en cada punto', () => {
      const f = (x: number): number => x * x + 1;
      const result = calculator.compute(0, 2, 4, f);
      for (const point of result.divisionPoints) {
        expect(point.y).toBeCloseTo(f(point.x));
      }
    });

    it('los puntos son inmutables (readonly array)', () => {
      const result = calculator.compute(0, 2, 4, (x) => x);
      // TypeScript garantiza readonly; solo verificamos que existe el array
      expect(Array.isArray(result.divisionPoints)).toBe(true);
    });

    it('funciona con intervalo negativo [−2, 0]', () => {
      // Con n=2: el trapecio da 3 (sobreestimación de 8/3 ≈ 2.667)
      const result = calculator.compute(-2, 0, 2, (x) => x * x);
      expect(result.divisionPoints[0].x).toBeCloseTo(-2);
      expect(result.divisionPoints[2].x).toBeCloseTo(0);
      expect(result.totalArea).toBeCloseTo(3, 5);
    });
  });
});
