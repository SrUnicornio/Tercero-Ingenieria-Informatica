/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file controls-view.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de ControlsView con DOM real (jsdom).
 *
 *   ControlsView busca sus elementos por ID en el constructor, por lo
 *   que el helper buildControls() monta el DOM mínimo necesario en
 *   document.body antes de instanciarla — el mismo patrón usado en P13.
 *
 *   Casos cubiertos:
 *     - El constructor lanza si falta algún elemento del DOM.
 *     - El clic en el botón con inputs válidos dispara onUpdateRequested
 *       con los parámetros correctos.
 *     - Cada validación fallida muestra el mensaje de error adecuado.
 *     - showError() y clearError() modifican el DOM correctamente.
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {ControlsView} from
  '../../trapezoid/view/controls-view.js';
import type {TrapezoidParams} from
  '../../trapezoid/interfaces/trapezoid-params.js';

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * @function buildControls
 * @description Monta el DOM mínimo necesario para ControlsView y
 *   devuelve la instancia junto con las referencias a los elementos.
 * @returns Objeto con la vista y los elementos DOM creados.
 */
function buildControls(): {
  view: ControlsView;
  inputExpression: HTMLInputElement;
  inputTrapezoids: HTMLInputElement;
  inputStart: HTMLInputElement;
  inputEnd: HTMLInputElement;
  btnUpdate: HTMLButtonElement;
  errorParagraph: HTMLElement;
  } {
  const inputExpression = document.createElement('input');
  inputExpression.id = 'input-expression';
  inputExpression.value = 'x^2 + 1';

  const inputTrapezoids = document.createElement('input');
  inputTrapezoids.id = 'input-trapezoids';
  inputTrapezoids.value = '4';

  const inputStart = document.createElement('input');
  inputStart.id = 'input-start';
  inputStart.value = '0';

  const inputEnd = document.createElement('input');
  inputEnd.id = 'input-end';
  inputEnd.value = '2';

  const btnUpdate = document.createElement('button');
  btnUpdate.id = 'btn-update';

  const errorParagraph = document.createElement('p');
  errorParagraph.id = 'trap-error';
  errorParagraph.classList.add('is-hidden');

  document.body.append(
      inputExpression, inputTrapezoids,
      inputStart, inputEnd,
      btnUpdate, errorParagraph,
  );

  const view = new ControlsView();
  return {
    view, inputExpression, inputTrapezoids,
    inputStart, inputEnd, btnUpdate, errorParagraph,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ControlsView', () => {
  let controls: ReturnType<typeof buildControls>;

  beforeEach(() => {
    controls = buildControls();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // ── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('lanza Error si falta input-expression en el DOM', () => {
      document.body.innerHTML = '';
      expect(() => new ControlsView()).toThrow(
          'ControlsView: no se encontró <input id="input-expression">.',
      );
    });

    it('construye sin errores cuando todos los elementos existen', () => {
      expect(controls.view).toBeInstanceOf(ControlsView);
    });

    it('lanza Error si falta btn-update en el DOM', () => {
      document.body.innerHTML = '';
      // Montar todos los inputs pero NO el botón
      ['input-expression', 'input-trapezoids', 'input-start', 'input-end']
          .forEach((id) => {
            const input = document.createElement('input');
            input.id = id;
            document.body.appendChild(input);
          });
      const error = document.createElement('p');
      error.id = 'trap-error';
      document.body.appendChild(error);
      expect(() => new ControlsView()).toThrow(
          'ControlsView: no se encontró <button id="btn-update">.',
      );
    });

    it('lanza Error si falta trap-error en el DOM', () => {
      document.body.innerHTML = '';
      // Montar todos los inputs y el botón pero NO el párrafo de error
      ['input-expression', 'input-trapezoids', 'input-start', 'input-end']
          .forEach((id) => {
            const input = document.createElement('input');
            input.id = id;
            document.body.appendChild(input);
          });
      const btn = document.createElement('button');
      btn.id = 'btn-update';
      document.body.appendChild(btn);
      expect(() => new ControlsView()).toThrow(
          'ControlsView: no se encontró #trap-error.',
      );
    });
  });

  // ── showError / clearError ────────────────────────────────────────────────

  describe('showError', () => {
    it('escribe el mensaje en el párrafo de error', () => {
      controls.view.showError('Mensaje de prueba');
      expect(controls.errorParagraph.textContent).toBe('Mensaje de prueba');
    });

    it('elimina la clase is-hidden del párrafo de error', () => {
      controls.view.showError('Error visible');
      expect(
          controls.errorParagraph.classList.contains('is-hidden'),
      ).toBe(false);
    });
  });

  describe('clearError', () => {
    it('añade la clase is-hidden al párrafo de error', () => {
      controls.view.showError('Error');
      controls.view.clearError();
      expect(
          controls.errorParagraph.classList.contains('is-hidden'),
      ).toBe(true);
    });
  });

  // ── onUpdateRequested — inputs válidos ────────────────────────────────────

  describe('onUpdateRequested — inputs válidos', () => {
    it('dispara el evento con los parámetros correctos al pulsar Update', () => {
      const listener = vi.fn();
      controls.view.onUpdateRequested.addListener(listener);

      controls.btnUpdate.click();

      expect(listener).toHaveBeenCalledOnce();
      const params: TrapezoidParams = listener.mock.calls[0][0];
      expect(params.expression).toBe('x^2 + 1');
      expect(params.trapezoidCount).toBe(4);
      expect(params.start).toBe(0);
      expect(params.end).toBe(2);
    });

    it('no dispara el evento cuando la validación falla', () => {
      const listener = vi.fn();
      controls.view.onUpdateRequested.addListener(listener);
      controls.inputExpression.value = '';

      controls.btnUpdate.click();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  // ── Validaciones ──────────────────────────────────────────────────────────

  describe('validaciones', () => {
    it('muestra error cuando la expresión está vacía', () => {
      controls.inputExpression.value = '';
      controls.btnUpdate.click();
      expect(controls.errorParagraph.textContent).toContain(
          'La expresión no puede estar vacía',
      );
    });

    it('muestra error cuando el número de trapecios no es entero válido', () => {
      controls.inputTrapezoids.value = 'abc';
      controls.btnUpdate.click();
      expect(controls.errorParagraph.textContent).toContain(
          'El número de trapecios debe ser un entero',
      );
    });

    it('muestra error cuando el número de trapecios es 0', () => {
      controls.inputTrapezoids.value = '0';
      controls.btnUpdate.click();
      expect(controls.errorParagraph.textContent).toContain(
          'El número de trapecios debe ser un entero',
      );
    });

    it('muestra error cuando start no es un número válido', () => {
      controls.inputStart.value = 'abc';
      controls.btnUpdate.click();
      expect(controls.errorParagraph.textContent).toContain(
          'Start y End deben ser números válidos',
      );
    });

    it('muestra error cuando start >= end', () => {
      controls.inputStart.value = '5';
      controls.inputEnd.value = '2';
      controls.btnUpdate.click();
      expect(controls.errorParagraph.textContent).toContain(
          'Start debe ser menor que End',
      );
    });

    it('limpia el error en una pulsación válida tras una inválida', () => {
      controls.inputExpression.value = '';
      controls.btnUpdate.click();
      expect(
          controls.errorParagraph.classList.contains('is-hidden'),
      ).toBe(false);

      controls.inputExpression.value = 'x^2';
      controls.btnUpdate.click();
      expect(
          controls.errorParagraph.classList.contains('is-hidden'),
      ).toBe(true);
    });
  });
});
