/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file grid-renderer.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de GridRenderer.
 *
 *   Estrategia: verificamos comportamientos observables a través del
 *   contexto 2D mockeado, sin inspeccionar coordenadas exactas de cada
 *   línea (eso sería testear TickCalculator de nuevo).
 *
 *   Lo que verificamos:
 *     - draw() llama a fillRect() para el fondo blanco.
 *     - draw() llama a stroke() al menos una vez.
 *     - beginPath() se llama al menos tantas veces como stroke().
 *     - El contexto se guarda y restaura simétricamente.
 *     - Un rango mayor produce más llamadas a stroke().
 *     - No lanza errores con dominios degenerados.
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {GridRenderer} from '../../trapezoid/view/grid-renderer.js';
import {CoordinateTransformer} from
  '../../trapezoid/util/coordinate-transformer.js';
import {DEFAULT_COORDINATE_CONFIG} from
  '../../trapezoid/interfaces/coordinate-config.js';
import {
  createMockContext,
  STANDARD_LAYOUT,
  STANDARD_DOMAIN,
} from './canvas-context.mock.js';

describe('GridRenderer', () => {
  let context: CanvasRenderingContext2D;
  let transformer: CoordinateTransformer;
  let renderer: GridRenderer;

  beforeEach(() => {
    context = createMockContext();
    transformer = new CoordinateTransformer(
        STANDARD_LAYOUT, STANDARD_DOMAIN,
    );
    renderer = new GridRenderer(
        context, transformer, DEFAULT_COORDINATE_CONFIG,
    );
  });

  describe('draw', () => {
    it('llama a fillRect para dibujar el fondo blanco', () => {
      renderer.draw();
      expect(context.fillRect).toHaveBeenCalledOnce();
    });

    it('llama a stroke al menos una vez (hay líneas que dibujar)', () => {
      renderer.draw();
      expect(context.stroke).toHaveBeenCalled();
    });

    it('beginPath se llama al menos tantas veces como stroke', () => {
      renderer.draw();
      const beginPathCalls =
        (context.beginPath as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      const strokeCalls =
        (context.stroke as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(beginPathCalls).toBeGreaterThanOrEqual(strokeCalls);
    });

    it('salva y restaura el contexto simétricamente', () => {
      renderer.draw();
      const saveCalls =
        (context.save as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      const restoreCalls =
        (context.restore as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(saveCalls).toBe(restoreCalls);
    });

    it('un rango mayor produce más llamadas a stroke', () => {
      const bigTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -100, mathEnd: 100, mathYMin: -100, mathYMax: 100},
      );
      const ctxSmall = createMockContext();
      const ctxBig = createMockContext();

      new GridRenderer(
          ctxSmall, transformer, DEFAULT_COORDINATE_CONFIG,
      ).draw();
      new GridRenderer(
          ctxBig, bigTransformer, DEFAULT_COORDINATE_CONFIG,
      ).draw();

      const smallStrokes =
        (ctxSmall.stroke as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      const bigStrokes =
        (ctxBig.stroke as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(bigStrokes).toBeGreaterThan(smallStrokes);
    });

    it('no lanza errores con un dominio degenerado (start === end)', () => {
      const degenerateTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: 0, mathEnd: 0, mathYMin: -1, mathYMax: 1},
      );
      const degenerateRenderer = new GridRenderer(
          context, degenerateTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      expect(() => degenerateRenderer.draw()).not.toThrow();
    });
  });
});
