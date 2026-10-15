/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-canvas-renderer.test.ts
 * @description Tests unitarios de HangmanCanvasRenderer.
 *   El canvas y su contexto 2D se mockean manualmente: el entorno
 *   JSDOM no implementa el API de dibujo de Canvas, por lo que los
 *   tests verifican que los métodos del contexto son llamados de forma
 *   coherente con el número de fallos, sin depender del resultado visual.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HangmanCanvasRenderer} from '../hangman/view/hangman-render/hangman-canvas-renderer';
import {DEFAULT_RENDER_CONFIG} from '../hangman/interfaces/render-config';

import {describe, it, expect, jest, beforeEach} from '@jest/globals';
// ── Mock del contexto 2D ──────────────────────────────────────────────────────

/**
 * Crea un mock mínimo de CanvasRenderingContext2D con todos los métodos
 * que usa HangmanCanvasRenderer sustituidos por jest.fn().
 */
function buildMockContext(): jest.Mocked<CanvasRenderingContext2D> {
  return {
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    strokeStyle: '',
    lineWidth: 0,
    lineCap: 'butt',
  } as unknown as jest.Mocked<CanvasRenderingContext2D>;
}

/**
 * Crea un HTMLCanvasElement mockeado cuyo getContext devuelve el contexto dado.
 *
 * @param context Contexto 2D mock a devolver.
 * @returns Elemento canvas con getContext sobreescrito.
 */
function buildMockCanvas(
    context: CanvasRenderingContext2D,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.getContext = jest.fn()
      .mockReturnValue(context) as typeof canvas.getContext;
  // offsetWidth/offsetHeight son de solo lectura en JSDOM; se usan Object.defineProperty
  Object.defineProperty(canvas, 'offsetWidth', {value: 400, configurable: true});
  Object.defineProperty(canvas, 'offsetHeight', {value: 530, configurable: true});
  return canvas;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HangmanCanvasRenderer', () => {
  let mockContext: jest.Mocked<CanvasRenderingContext2D>;
  let canvas: HTMLCanvasElement;
  let renderer: HangmanCanvasRenderer;

  beforeEach(() => {
    mockContext = buildMockContext();
    canvas = buildMockCanvas(mockContext);
    renderer = new HangmanCanvasRenderer(canvas, DEFAULT_RENDER_CONFIG);
  });

  // ── Constructor ────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('debe lanzar Error si getContext devuelve null', () => {
      const badCanvas = document.createElement('canvas');
      badCanvas.getContext = jest.fn()
          .mockReturnValue(null) as typeof badCanvas.getContext;
      expect(() => new HangmanCanvasRenderer(badCanvas, DEFAULT_RENDER_CONFIG))
          .toThrow('Canvas 2D context not available');
    });

    it('debe instanciarse sin errores con un contexto válido', () => {
      expect(() => new HangmanCanvasRenderer(canvas, DEFAULT_RENDER_CONFIG))
          .not.toThrow();
    });
  });

  // ── render: llamadas al contexto ───────────────────────────────────────

  describe('render', () => {
    it('debe llamar a clearRect al renderizar', () => {
      renderer.render(0);
      expect(mockContext.clearRect).toHaveBeenCalledTimes(1);
    });

    it('no debe llamar a arc (cabeza) cuando failedAttempts es 0', () => {
      renderer.render(0);
      expect(mockContext.arc).not.toHaveBeenCalled();
    });

    it('debe llamar a arc (cabeza) cuando failedAttempts es 1', () => {
      renderer.render(1);
      expect(mockContext.arc).toHaveBeenCalledTimes(1);
    });

    it('debe llamar más veces a moveTo/lineTo a medida que aumentan los fallos', () => {
      renderer.render(0);
      const callsAtZero = mockContext.moveTo.mock.calls.length;

      mockContext.moveTo.mockClear();
      renderer.render(3);
      const callsAtThree = mockContext.moveTo.mock.calls.length;

      expect(callsAtThree).toBeGreaterThan(callsAtZero);
    });

    it('debe aceptar failedAttempts = 6 (máximo) sin lanzar errores', () => {
      expect(() => renderer.render(6)).not.toThrow();
    });

    it('debe limitar failedAttempts > 6 al máximo de partes del cuerpo', () => {
      // Con 7 no debe intentar dibujar una séptima parte inexistente
      expect(() => renderer.render(7)).not.toThrow();
    });
  });
});
