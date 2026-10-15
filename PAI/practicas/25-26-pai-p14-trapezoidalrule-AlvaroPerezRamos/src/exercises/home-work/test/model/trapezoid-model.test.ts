/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-model.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de TrapezoidModel.
 *
 *   El único obstáculo era que FunctionEvaluator importa mathjs desde
 *   CDN, que no funciona en Node/jsdom. Se resuelve mockeando solo ese
 *   path de URL y redirigiéndolo al paquete npm instalado, igual que en
 *   function-evaluator.test.ts. Así TrapezoidModel se testea con mathjs
 *   real sin necesidad de mockear FunctionEvaluator como clase.
 *
 *   Casos cubiertos:
 *     - Parámetros por defecto al construir sin argumentos.
 *     - evaluateAt() evalúa correctamente la expresión.
 *     - computeYRange() con función positiva, negativa, constante y NaN.
 *     - computeYRange() siempre incluye el 0 en el rango.
 *     - setParams() actualiza correctamente cada campo.
 *     - updateCanvasDimensions() / getCanvasDimensions().
 */

import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as mathjsNpm from 'mathjs';

// Interceptamos el import CDN y lo redirigimos al paquete npm instalado.
vi.mock('https://cdn.jsdelivr.net/npm/mathjs@13/+esm', () => mathjsNpm);

import {TrapezoidModel} from
  '../../trapezoid/model/trapezoid-model.js';

describe('TrapezoidModel', () => {
  let model: TrapezoidModel;

  beforeEach(() => {
    model = new TrapezoidModel();
  });

  // ── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('usa los parámetros por defecto si no se pasan argumentos', () => {
      const params = model.getParams();
      expect(params.expression).toBe('x^2 + 1');
      expect(params.start).toBe(0);
      expect(params.end).toBe(2);
      expect(params.trapezoidCount).toBe(4);
    });

    it('combina los parámetros por defecto con los iniciales dados', () => {
      const customModel = new TrapezoidModel({start: -3, end: 3});
      const params = customModel.getParams();
      expect(params.start).toBe(-3);
      expect(params.end).toBe(3);
      expect(params.trapezoidCount).toBe(4);
    });
  });

  // ── evaluateAt ────────────────────────────────────────────────────────────

  describe('evaluateAt', () => {
    it('evalúa la expresión por defecto x^2+1 correctamente en x=2', () => {
      expect(model.evaluateAt(2)).toBeCloseTo(5);
    });

    it('evalúa la expresión por defecto x^2+1 correctamente en x=0', () => {
      expect(model.evaluateAt(0)).toBeCloseTo(1);
    });

    it('devuelve NaN para 1/x en x=0 tras cambiar la expresión', () => {
      model.setParams({expression: '1/x'});
      expect(model.evaluateAt(0)).toBeNaN();
    });
  });

  // ── computeYRange ─────────────────────────────────────────────────────────

  describe('computeYRange', () => {
    it('yMin ≤ yMax siempre', () => {
      const {yMin, yMax} = model.computeYRange();
      expect(yMin).toBeLessThanOrEqual(yMax);
    });

    it('el rango incluye siempre el 0 cuando la función es positiva', () => {
      // x^2 + 1 ≥ 1 en [0, 2] → todo positivo → yMin debe ser ≤ 0
      const {yMin, yMax} = model.computeYRange();
      expect(yMin).toBeLessThanOrEqual(0);
      expect(yMax).toBeGreaterThan(0);
    });

    it('el rango incluye siempre el 0 cuando la función es negativa', () => {
      // -(x^2) - 1 ≤ -1 en [-2, 2] → todo negativo → yMax debe ser ≥ 0
      model.setParams({expression: '-x^2 - 1', start: -2, end: 2});
      const {yMin, yMax} = model.computeYRange();
      expect(yMax).toBeGreaterThanOrEqual(0);
      expect(yMin).toBeLessThan(0);
    });

    it('el rango tiene margen respecto a rawMin y rawMax', () => {
      // x en [1, 3] → rawMin=1, rawMax=3 → yMin < 1 y yMax > 3
      model.setParams({expression: 'x', start: 1, end: 3});
      const {yMin, yMax} = model.computeYRange();
      expect(yMin).toBeLessThan(1);
      expect(yMax).toBeGreaterThan(3);
    });

    it('función constante no produce escala degenerada', () => {
      model.setParams({expression: '5', start: 0, end: 1});
      const {yMin, yMax} = model.computeYRange();
      expect(yMax - yMin).toBeGreaterThan(0);
    });

    it('si todos los valores son NaN devuelve el rango de fallback', () => {
      // log(x) en [-1, -0.1] → todos NaN
      model.setParams({expression: 'log(x)', start: -1, end: -0.1});
      const {yMin, yMax} = model.computeYRange();
      expect(yMin).toBe(-1);
      expect(yMax).toBe(1);
    });
  });

  // ── getParams / setParams ─────────────────────────────────────────────────

  describe('getParams', () => {
    it('devuelve una copia: mutar el resultado no afecta al modelo', () => {
      const params = model.getParams() as { start: number };
      params.start = 999;
      expect(model.getParams().start).toBe(0);
    });
  });

  describe('setParams', () => {
    it('actualiza solo los campos proporcionados', () => {
      model.setParams({start: -5, end: 5});
      const params = model.getParams();
      expect(params.start).toBe(-5);
      expect(params.end).toBe(5);
      expect(params.trapezoidCount).toBe(4);
    });

    it('actualiza el número de trapecios', () => {
      model.setParams({trapezoidCount: 10});
      expect(model.getParams().trapezoidCount).toBe(10);
    });

    it('cambia la expresión y la evaluación refleja la nueva función', () => {
      model.setParams({expression: 'x', start: 0, end: 1});
      expect(model.evaluateAt(3)).toBeCloseTo(3);
    });
  });

  // ── updateCanvasDimensions / getCanvasDimensions ──────────────────────────

  describe('updateCanvasDimensions / getCanvasDimensions', () => {
    it('devuelve [0, 0] antes de cualquier actualización', () => {
      expect(model.getCanvasDimensions()).toEqual([0, 0]);
    });

    it('devuelve las dimensiones tras updateCanvasDimensions', () => {
      model.updateCanvasDimensions(1280, 720);
      expect(model.getCanvasDimensions()).toEqual([1280, 720]);
    });

    it('la segunda llamada sobreescribe la primera', () => {
      model.updateCanvasDimensions(800, 600);
      model.updateCanvasDimensions(1920, 1080);
      expect(model.getCanvasDimensions()).toEqual([1920, 1080]);
    });
  });

  // ── computeArea ───────────────────────────────────────────────────────────

  describe('computeArea', () => {
    it('devuelve un totalArea numérico', () => {
      const model = new TrapezoidModel({
        expression: 'x^2 + 1', start: 0, end: 2, trapezoidCount: 4,
      });
      const {totalArea} = model.computeArea();
      expect(typeof totalArea).toBe('number');
    });

    it('devuelve trapezoidCount + 1 puntos de división', () => {
      const model = new TrapezoidModel({
        expression: 'x^2 + 1', start: 0, end: 2, trapezoidCount: 4,
      });
      const {divisionPoints} = model.computeArea();
      expect(divisionPoints.length).toBe(5);
    });

    it('el primer punto tiene x igual a start', () => {
      const model = new TrapezoidModel({
        expression: 'x', start: 1, end: 3, trapezoidCount: 2,
      });
      const {divisionPoints} = model.computeArea();
      expect(divisionPoints[0].x).toBeCloseTo(1);
    });

    it('el último punto tiene x igual a end', () => {
      const model = new TrapezoidModel({
        expression: 'x', start: 1, end: 3, trapezoidCount: 2,
      });
      const {divisionPoints} = model.computeArea();
      const last = divisionPoints[divisionPoints.length - 1];
      expect(last.x).toBeCloseTo(3);
    });

    it('actualiza el resultado tras setParams', () => {
      const model = new TrapezoidModel({
        expression: 'x', start: 0, end: 1, trapezoidCount: 1,
      });
      const areaBefore = model.computeArea().totalArea;
      model.setParams({end: 2});
      const areaAfter = model.computeArea().totalArea;
      expect(areaAfter).toBeGreaterThan(areaBefore);
    });
  });
});
