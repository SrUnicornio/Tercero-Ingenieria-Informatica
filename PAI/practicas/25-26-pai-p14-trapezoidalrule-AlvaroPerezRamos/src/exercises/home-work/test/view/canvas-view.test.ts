/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file canvas-view.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de CanvasView con DOM real (jsdom).
 *
 *   jsdom no implementa getContext('2d') sin el paquete 'canvas' npm.
 *   La solución es espiar HTMLCanvasElement.prototype.getContext y
 *   devolver el mock de contexto del helper compartido, de forma que
 *   CanvasView construye sin lanzar y podemos verificar su comportamiento.
 *
 *   Casos cubiertos:
 *     - El constructor lanza si el ID no existe en el DOM.
 *     - El constructor lanza si el elemento no es un canvas.
 *     - getContext() devuelve el contexto mockeado no nulo.
 *     - getDimensions() refleja las dimensiones lógicas del canvas.
 *     - syncSize() devuelve true cuando las dimensiones difieren y
 *       false cuando ya coincidían.
 *     - getCanvasElement() devuelve el elemento canvas original.
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {CanvasView} from '../../trapezoid/view/canvas-view.js';
import {createMockContext} from './canvas-context.mock.js';

/** ID usado en todos los tests. */
const CANVAS_ID = 'trap-canvas';

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * @function buildCanvas
 * @description Crea un <canvas> con el ID estándar en document.body,
 *   espía getContext para devolver el mock y devuelve la instancia
 *   de CanvasView junto con el elemento y el contexto mock.
 * @returns Objeto con la vista, el elemento canvas y el contexto mock.
 */
function buildCanvas(): {
  view: CanvasView;
  canvasElement: HTMLCanvasElement;
  mockContext: CanvasRenderingContext2D;
  } {
  const canvasElement = document.createElement('canvas');
  canvasElement.id = CANVAS_ID;
  document.body.appendChild(canvasElement);

  const mockContext = createMockContext();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    mockContext as unknown as RenderingContext,
  );

  const view = new CanvasView(CANVAS_ID);
  return {view, canvasElement, mockContext};
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CanvasView', () => {
  let setup: ReturnType<typeof buildCanvas>;

  beforeEach(() => {
    setup = buildCanvas();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  // ── Constructor ───────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('lanza Error si el ID no existe en el DOM', () => {
      expect(() => new CanvasView('id-inexistente')).toThrow(
          'CanvasView: no se encontró <canvas id="id-inexistente">.',
      );
    });

    it('lanza Error si el elemento encontrado no es un canvas', () => {
      const div = document.createElement('div');
      div.id = 'not-a-canvas';
      document.body.appendChild(div);
      expect(() => new CanvasView('not-a-canvas')).toThrow(
          'CanvasView: no se encontró <canvas id="not-a-canvas">.',
      );
    });

    it('construye sin errores cuando el canvas existe', () => {
      expect(setup.view).toBeInstanceOf(CanvasView);
    });
  });

  // ── getContext ────────────────────────────────────────────────────────────

  describe('getContext', () => {
    it('devuelve el contexto mockeado (no nulo)', () => {
      expect(setup.view.getContext()).not.toBeNull();
    });

    it('devuelve siempre la misma instancia de contexto', () => {
      expect(setup.view.getContext()).toBe(setup.view.getContext());
    });

    it('devuelve el mismo objeto que el mock inyectado', () => {
      expect(setup.view.getContext()).toBe(setup.mockContext);
    });
  });

  // ── getDimensions ─────────────────────────────────────────────────────────

  describe('getDimensions', () => {
    it('devuelve [300, 150] con las dimensiones por defecto de jsdom', () => {
      // jsdom inicializa HTMLCanvasElement con width=300, height=150 por defecto.
      expect(setup.view.getDimensions()).toEqual([300, 150]);
    });

    it('refleja las dimensiones lógicas asignadas directamente al canvas', () => {
      setup.canvasElement.width = 800;
      setup.canvasElement.height = 600;
      expect(setup.view.getDimensions()).toEqual([800, 600]);
    });
  });

  // ── syncSize ──────────────────────────────────────────────────────────────

  describe('syncSize', () => {
    it('devuelve true en la primera llamada porque jsdom tiene canvas.width=300 y clientWidth=0', () => {
      // jsdom: canvas.width=300 (defecto), clientWidth=0 (sin layout CSS)
      // → dimensiones distintas → syncSize sincroniza y devuelve true.
      expect(setup.view.syncSize()).toBe(true);
    });

    it('devuelve false en la segunda llamada cuando ya están sincronizados', () => {
      setup.view.syncSize(); // primera: sincroniza 300 → 0
      expect(setup.view.syncSize()).toBe(false); // segunda: ya coinciden
    });

    it('devuelve true cuando canvas.width difiere de clientWidth', () => {
      setup.view.syncSize(); // primera: sincroniza 300 → 0
      setup.canvasElement.width = 800; // volvemos a introducir diferencia
      expect(setup.view.syncSize()).toBe(true);
    });

    it('sincroniza canvas.width a clientWidth (0 en jsdom) tras syncSize()', () => {
      setup.view.syncSize(); // 300 → 0
      expect(setup.canvasElement.width).toBe(0);
    });
  });

  // ── getCanvasElement ──────────────────────────────────────────────────────

  describe('getCanvasElement', () => {
    it('devuelve el mismo elemento canvas con el que fue construido', () => {
      expect(setup.view.getCanvasElement()).toBe(setup.canvasElement);
    });

    it('devuelve un HTMLCanvasElement', () => {
      expect(setup.view.getCanvasElement()).toBeInstanceOf(HTMLCanvasElement);
    });
  });
});
