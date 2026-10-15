/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file function-evaluator.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de FunctionEvaluator.
 *
 *   El único obstáculo para testear esta clase es que importa mathjs
 *   desde una URL CDN que no existe en Node/jsdom. La solución es
 *   mockear exactamente ese path de import con vi.mock() y sustituirlo
 *   por el paquete npm 'mathjs' que ya está instalado en devDependencies.
 *   Así FunctionEvaluator se testea con mathjs real, sin mock de la clase.
 *
 *   Casos cubiertos:
 *     - evaluate() con expresiones polinómicas, trigonométricas y
 *       exponenciales correctas.
 *     - evaluate() devuelve NaN para divisiones por cero y logaritmos
 *       de negativos (resultado no finito).
 *     - evaluate() devuelve NaN cuando la evaluación lanza una excepción.
 *     - El constructor lanza Error con expresiones de sintaxis inválida.
 *     - getExpression() devuelve la expresión original sin modificar.
 */

import {describe, it, expect, vi} from 'vitest';
import * as mathjsNpm from 'mathjs';

// Interceptamos el import CDN y lo redirigimos al paquete npm instalado.
// FunctionEvaluator recibe un mathjs funcional, no un stub vacío.
vi.mock('https://cdn.jsdelivr.net/npm/mathjs@13/+esm', () => mathjsNpm);

import {FunctionEvaluator} from
  '../../trapezoid/model/function-evaluator.js';

describe('FunctionEvaluator', () => {
  // ── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('no lanza error con una expresión válida', () => {
      expect(() => new FunctionEvaluator('x^2 + 1')).not.toThrow();
    });

    it('lanza Error cuando la expresión tiene sintaxis inválida', () => {
      expect(() => new FunctionEvaluator('x ++ (')).toThrow(Error);
    });

    it('el mensaje de error incluye la expresión inválida', () => {
      expect(() => new FunctionEvaluator('???')).toThrow('???');
    });
  });

  // ── evaluate — expresiones correctas ─────────────────────────────────────

  describe('evaluate — expresiones válidas', () => {
    it('evalúa x^2 + 1 correctamente en x=0', () => {
      const evaluator = new FunctionEvaluator('x^2 + 1');
      expect(evaluator.evaluate(0)).toBeCloseTo(1);
    });

    it('evalúa x^2 + 1 correctamente en x=2', () => {
      const evaluator = new FunctionEvaluator('x^2 + 1');
      expect(evaluator.evaluate(2)).toBeCloseTo(5);
    });

    it('evalúa x^2 + 1 correctamente en x=-3', () => {
      const evaluator = new FunctionEvaluator('x^2 + 1');
      expect(evaluator.evaluate(-3)).toBeCloseTo(10);
    });

    it('evalúa sin(x) correctamente en x=0', () => {
      const evaluator = new FunctionEvaluator('sin(x)');
      expect(evaluator.evaluate(0)).toBeCloseTo(0);
    });

    it('evalúa sin(x) correctamente en x=π/2', () => {
      const evaluator = new FunctionEvaluator('sin(x)');
      expect(evaluator.evaluate(Math.PI / 2)).toBeCloseTo(1);
    });

    it('evalúa exp(x) correctamente en x=1', () => {
      const evaluator = new FunctionEvaluator('exp(x)');
      expect(evaluator.evaluate(1)).toBeCloseTo(Math.E);
    });

    it('evalúa una función lineal correctamente', () => {
      const evaluator = new FunctionEvaluator('2 * x + 3');
      expect(evaluator.evaluate(4)).toBeCloseTo(11);
    });

    it('evalúa una constante (independiente de x)', () => {
      const evaluator = new FunctionEvaluator('42');
      expect(evaluator.evaluate(0)).toBeCloseTo(42);
      expect(evaluator.evaluate(99)).toBeCloseTo(42);
    });
  });

  // ── evaluate — casos que producen NaN ────────────────────────────────────

  describe('evaluate — resultados no finitos', () => {
    it('devuelve NaN en la división 1/x cuando x=0', () => {
      const evaluator = new FunctionEvaluator('1/x');
      expect(evaluator.evaluate(0)).toBeNaN();
    });

    it('devuelve NaN para log(x) con x negativo', () => {
      const evaluator = new FunctionEvaluator('log(x)');
      expect(evaluator.evaluate(-1)).toBeNaN();
    });

    it('devuelve NaN para sqrt(x) con x negativo', () => {
      const evaluator = new FunctionEvaluator('sqrt(x)');
      expect(evaluator.evaluate(-4)).toBeNaN();
    });

    it('devuelve NaN para una variable no definida en mathjs', () => {
      // 'y' no existe en el scope {x}, mathjs lanza → el catch devuelve NaN
      const evaluator = new FunctionEvaluator('x + y');
      expect(evaluator.evaluate(1)).toBeNaN();
    });
  });

  // ── getExpression ─────────────────────────────────────────────────────────

  describe('getExpression', () => {
    it('devuelve la expresión original tal cual fue introducida', () => {
      const expression = 'x^2 - 1';
      const evaluator = new FunctionEvaluator(expression);
      expect(evaluator.getExpression()).toBe(expression);
    });

    it('no modifica la expresión aunque contenga espacios', () => {
      const expression = ' x + 1 ';
      const evaluator = new FunctionEvaluator(expression);
      expect(evaluator.getExpression()).toBe(expression);
    });
  });
});
