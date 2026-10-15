/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file result-view.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de ResultView con DOM real (jsdom).
 *
 *   ResultView busca #trap-result por ID en el constructor.
 *   El helper buildResult() lo monta en document.body antes de
 *   instanciarla, y afterEach limpia el DOM para aislar cada test.
 *
 *   Casos cubiertos:
 *     - El constructor lanza si el párrafo no existe en el DOM.
 *     - update() escribe el área con 6 decimales y el prefijo correcto.
 *     - reset() restaura el guion inicial.
 *     - Llamadas sucesivas a update() sobreescriben el valor anterior.
 */

import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {ResultView} from
  '../../trapezoid/view/result-view.js';

/** Prefijo que ResultView antepone al área. */
const RESULT_PREFIX = 'Sum of all Trapezium areas: ';

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * @function buildResult
 * @description Crea el párrafo #trap-result en el DOM y devuelve
 *   la instancia de ResultView junto con la referencia al elemento.
 * @returns Objeto con la vista y el elemento DOM.
 */
function buildResult(): { view: ResultView; paragraph: HTMLElement } {
  const paragraph = document.createElement('p');
  paragraph.id = 'trap-result';
  document.body.appendChild(paragraph);
  const view = new ResultView();
  return {view, paragraph};
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ResultView', () => {
  let setup: ReturnType<typeof buildResult>;

  beforeEach(() => {
    setup = buildResult();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // ── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('lanza Error si #trap-result no existe en el DOM', () => {
      document.body.innerHTML = '';
      expect(() => new ResultView()).toThrow(
          'ResultView: no se encontró #trap-result.',
      );
    });

    it('construye sin errores cuando el elemento existe', () => {
      expect(setup.view).toBeInstanceOf(ResultView);
    });
  });

  // ── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('escribe el área con el prefijo correcto', () => {
      setup.view.update(2.666667);
      expect(setup.paragraph.textContent).toBe(
          `${RESULT_PREFIX}2.667`,
      );
    });

    it('formatea el área a exactamente 3 decimales', () => {
      setup.view.update(1 / 3);
      expect(setup.paragraph.textContent).toBe(
          `${RESULT_PREFIX}0.333`,
      );
    });

    it('muestra cero correctamente', () => {
      setup.view.update(0);
      expect(setup.paragraph.textContent).toBe(
          `${RESULT_PREFIX}0.000`,
      );
    });

    it('sobreescribe el valor anterior en llamadas sucesivas', () => {
      setup.view.update(1.5);
      setup.view.update(3.141593);
      expect(setup.paragraph.textContent).toBe(
          `${RESULT_PREFIX}3.142`,
      );
    });

    it('maneja valores grandes correctamente', () => {
      setup.view.update(1234567.89);
      expect(setup.paragraph.textContent).toContain('1234567.890');
    });
  });

  // ── reset ─────────────────────────────────────────────────────────────────

  describe('reset', () => {
    it('restaura el texto al guion inicial', () => {
      setup.view.update(42);
      setup.view.reset();
      expect(setup.paragraph.textContent).toBe(`${RESULT_PREFIX}—`);
    });

    it('el texto de reset contiene el prefijo correcto', () => {
      setup.view.reset();
      expect(setup.paragraph.textContent).toContain(RESULT_PREFIX);
    });
  });
});
