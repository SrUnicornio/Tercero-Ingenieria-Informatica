/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-view.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de TrapezoidView.
 *
 *   TrapezoidView es una fachada DOM que compone CanvasView, ControlsView
 *   y ResultView. Sigue el mismo patrón que los tests de la P13:
 *     - El DOM mínimo se monta en document.body en buildView().
 *     - afterEach limpia con innerHTML = '' para aislar cada test.
 *     - getContext se espía para evitar el error de jsdom.
 *     - vi.spyOn sobre prototipos verifica la delegación entre fachadas.
 *
 *   Casos cubiertos:
 *     - constructor lanza si falta el canvas en el DOM.
 *     - getInputRouter() devuelve la ControlsView interna.
 *     - syncCanvasSize() delega en CanvasView.syncSize().
 *     - getDimensions() delega en CanvasView.getDimensions().
 *     - getCanvasElement() devuelve el HTMLCanvasElement.
 *     - renderCoordinateSystem() crea CoordinateSystem en la primera
 *       llamada y llama a update() en las siguientes.
 *     - renderFunction() delega en FunctionRenderer.draw().
 *     - renderResult() delega en ResultView.update().
 *     - renderTrapezoids() delega en TrapezoidRenderer.draw().
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {TrapezoidView} from
  '../../trapezoid/view/trapezoid-view.js';
import {CanvasView} from
  '../../trapezoid/view/canvas-view.js';
import {ResultView} from
  '../../trapezoid/view/result-view.js';
import {CoordinateSystem} from
  '../../trapezoid/view/coordinate-system.js';
import {FunctionRenderer} from
  '../../trapezoid/view/function-renderer.js';
import {TrapezoidRenderer} from
  '../../trapezoid/view/trapezoid-renderer.js';
import {CoordinateTransformer} from
  '../../trapezoid/util/coordinate-transformer.js';
import {DEFAULT_COORDINATE_CONFIG} from
  '../../trapezoid/interfaces/coordinate-config.js';
import {createMockContext} from './canvas-context.mock.js';

// ── Constantes ────────────────────────────────────────────────────────────────

const CANVAS_ID = 'trap-canvas';

const STANDARD_LAYOUT = {
  canvasWidth: 800, canvasHeight: 600,
  marginLeft: 50, marginBottom: 40,
  marginRight: 10, marginTop: 10,
} as const;

const STANDARD_DOMAIN = {
  mathStart: -2, mathEnd: 2,
  mathYMin: -1, mathYMax: 3,
} as const;

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * @function buildView
 * @description Monta el DOM mínimo necesario para TrapezoidView y
 *   devuelve la instancia. Espía getContext para que jsdom no falle.
 */
function buildView(): TrapezoidView {
  const canvas = document.createElement('canvas');
  canvas.id = CANVAS_ID;
  document.body.appendChild(canvas);

  for (const id of [
    'input-expression', 'input-trapezoids', 'input-start', 'input-end',
  ]) {
    const input = document.createElement('input');
    input.id = id;
    document.body.appendChild(input);
  }

  const btn = document.createElement('button');
  btn.id = 'btn-update';
  document.body.appendChild(btn);

  const errP = document.createElement('p');
  errP.id = 'trap-error';
  errP.classList.add('is-hidden');
  document.body.appendChild(errP);

  const resultP = document.createElement('p');
  resultP.id = 'trap-result';
  document.body.appendChild(resultP);

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    createMockContext() as unknown as RenderingContext,
  );

  return new TrapezoidView(CANVAS_ID);
}

/** @returns Transformer estándar para los tests de render. */
function makeTransformer(): CoordinateTransformer {
  return new CoordinateTransformer(STANDARD_LAYOUT, STANDARD_DOMAIN);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('TrapezoidView', () => {
  let view: TrapezoidView;

  beforeEach(() => {
    view = buildView();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  // ── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('lanza Error si el canvas no existe en el DOM', () => {
      document.body.innerHTML = '';
      expect(() => new TrapezoidView('id-inexistente')).toThrow();
    });

    it('construye sin errores cuando el DOM está completo', () => {
      expect(view).toBeInstanceOf(TrapezoidView);
    });
  });

  // ── getInputRouter ────────────────────────────────────────────────────────

  describe('getInputRouter', () => {
    it('devuelve un objeto con la propiedad onUpdateRequested', () => {
      const router = view.getInputRouter();
      expect(router).toHaveProperty('onUpdateRequested');
    });

    it('devuelve siempre la misma instancia', () => {
      expect(view.getInputRouter()).toBe(view.getInputRouter());
    });
  });

  // ── syncCanvasSize ────────────────────────────────────────────────────────

  describe('syncCanvasSize', () => {
    it('delega en CanvasView.syncSize() y devuelve su resultado', () => {
      const spy = vi.spyOn(CanvasView.prototype, 'syncSize')
          .mockReturnValue(true);
      expect(view.syncCanvasSize()).toBe(true);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  // ── getDimensions ─────────────────────────────────────────────────────────

  describe('getDimensions', () => {
    it('delega en CanvasView.getDimensions()', () => {
      const spy = vi.spyOn(CanvasView.prototype, 'getDimensions')
          .mockReturnValue([1280, 720]);
      expect(view.getDimensions()).toEqual([1280, 720]);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  // ── getCanvasElement ──────────────────────────────────────────────────────

  describe('getCanvasElement', () => {
    it('devuelve un HTMLCanvasElement', () => {
      expect(view.getCanvasElement()).toBeInstanceOf(HTMLCanvasElement);
    });

    it('devuelve el canvas con el ID correcto', () => {
      expect(view.getCanvasElement().id).toBe(CANVAS_ID);
    });
  });

  // ── renderCoordinateSystem ────────────────────────────────────────────────

  describe('renderCoordinateSystem', () => {
    it('llama a CoordinateSystem.draw() en la primera llamada', () => {
      const spy = vi.spyOn(CoordinateSystem.prototype, 'draw');
      view.renderCoordinateSystem(makeTransformer(), DEFAULT_COORDINATE_CONFIG);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('llama a CoordinateSystem.update() en la segunda llamada', () => {
      const updateSpy = vi.spyOn(CoordinateSystem.prototype, 'update');
      const transformer = makeTransformer();
      view.renderCoordinateSystem(transformer, DEFAULT_COORDINATE_CONFIG);
      view.renderCoordinateSystem(transformer, DEFAULT_COORDINATE_CONFIG);
      expect(updateSpy).toHaveBeenCalledOnce();
    });

    it('no lanza errores con un transformer estándar', () => {
      expect(() =>
        view.renderCoordinateSystem(
            makeTransformer(), DEFAULT_COORDINATE_CONFIG,
        ),
      ).not.toThrow();
    });
  });

  // ── renderFunction ────────────────────────────────────────────────────────

  describe('renderFunction', () => {
    it('delega en FunctionRenderer.draw()', () => {
      const spy = vi.spyOn(FunctionRenderer.prototype, 'draw');
      view.renderFunction(0, 2, makeTransformer(), (x) => x * x);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('no lanza errores con una función válida', () => {
      expect(() =>
        view.renderFunction(0, 2, makeTransformer(), (x) => x * x),
      ).not.toThrow();
    });
  });

  // ── renderResult ──────────────────────────────────────────────────────────

  describe('renderResult', () => {
    it('delega en ResultView.update()', () => {
      const spy = vi.spyOn(ResultView.prototype, 'update');
      view.renderResult(4.667);
      expect(spy).toHaveBeenCalledWith(4.667);
    });

    it('actualiza el texto del párrafo de resultado', () => {
      const resultP = document.getElementById('trap-result')!;
      view.renderResult(3.141);
      expect(resultP.textContent).toContain('3.141');
    });
  });

  // ── renderTrapezoids ──────────────────────────────────────────────────────

  describe('renderTrapezoids', () => {
    it('delega en TrapezoidRenderer.draw()', () => {
      const spy = vi.spyOn(TrapezoidRenderer.prototype, 'draw');
      view.renderTrapezoids(
          [{x: 0, y: 1}, {x: 1, y: 2}],
          makeTransformer(),
      );
      expect(spy).toHaveBeenCalledOnce();
    });

    it('no lanza errores con puntos válidos', () => {
      expect(() =>
        view.renderTrapezoids(
            [{x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 5}],
            makeTransformer(),
        ),
      ).not.toThrow();
    });
  });
});
