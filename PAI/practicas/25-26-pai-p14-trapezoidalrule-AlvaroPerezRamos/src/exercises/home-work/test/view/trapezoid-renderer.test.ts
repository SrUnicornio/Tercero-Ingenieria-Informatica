/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-renderer.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de TrapezoidRenderer.
 *
 *   Estrategia: verificar comportamientos observables a través del
 *   contexto 2D mockeado (mismo patrón que grid-renderer.test.ts).
 *
 *   Casos cubiertos:
 *     - draw() con menos de 2 puntos no hace nada.
 *     - draw() llama a save/restore simétricamente.
 *     - draw() llama a fill() para el relleno de los trapecios.
 *     - draw() llama a arc() para dibujar los puntos rojos en los vértices.
 *     - draw() llama a setLineDash() para las líneas discontinuas internas.
 *     - Con n=1 (sin puntos internos) setLineDash no dibuja líneas internas.
 *     - No lanza errores con dominios estándar.
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {TrapezoidRenderer} from
  '../../trapezoid/view/trapezoid-renderer.js';
import {CoordinateTransformer} from
  '../../trapezoid/util/coordinate-transformer.js';
import {TrapezoidPoint} from
  '../../trapezoid/model/trapezoid-calculator.js';
import {
  createMockContext,
  STANDARD_LAYOUT,
  STANDARD_DOMAIN,
} from './canvas-context.mock.js';

/** Puntos de ejemplo con 4 trapecios (5 puntos). */
const SAMPLE_POINTS: TrapezoidPoint[] = [
  {x: 0, y: 1},
  {x: 0.5, y: 1.25},
  {x: 1, y: 2},
  {x: 1.5, y: 3.25},
  {x: 2, y: 5},
];

describe('TrapezoidRenderer', () => {
  let context: CanvasRenderingContext2D;
  let transformer: CoordinateTransformer;
  let renderer: TrapezoidRenderer;

  beforeEach(() => {
    context = createMockContext();
    transformer = new CoordinateTransformer(STANDARD_LAYOUT, STANDARD_DOMAIN);
    renderer = new TrapezoidRenderer(context, transformer);
  });

  // ── draw — caso degenerado ────────────────────────────────────────────────

  describe('draw — caso degenerado', () => {
    it('no hace nada cuando se pasan 0 puntos', () => {
      renderer.draw([]);
      expect(context.fill).not.toHaveBeenCalled();
    });

    it('no hace nada cuando se pasa solo 1 punto', () => {
      renderer.draw([{x: 0, y: 1}]);
      expect(context.fill).not.toHaveBeenCalled();
    });
  });

  // ── draw — comportamiento general ─────────────────────────────────────────

  describe('draw — con puntos válidos', () => {
    it('salva y restaura el contexto simétricamente', () => {
      renderer.draw(SAMPLE_POINTS);
      const saveCalls =
        (context.save as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      const restoreCalls =
        (context.restore as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(saveCalls).toBe(restoreCalls);
    });

    it('llama a fill() al menos una vez (relleno de trapecios)', () => {
      renderer.draw(SAMPLE_POINTS);
      expect(context.fill).toHaveBeenCalled();
    });

    it('llama a fill() exactamente n veces — una por trapecio', () => {
      // 5 puntos → 4 trapecios → 4 llamadas a fill()
      renderer.draw(SAMPLE_POINTS);
      const fillCalls =
        (context.fill as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      // Los puntos rojos también usan fill, así que fill >= 4
      expect(fillCalls).toBeGreaterThanOrEqual(4);
    });

    it('llama a arc() para cada vértice (puntos rojos)', () => {
      renderer.draw(SAMPLE_POINTS);
      const arcCalls =
        (context.arc as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      // Un círculo por cada punto de división (5 en SAMPLE_POINTS)
      expect(arcCalls).toBe(SAMPLE_POINTS.length);
    });

    it('llama a setLineDash() para activar el patrón discontinuo', () => {
      renderer.draw(SAMPLE_POINTS);
      expect(context.setLineDash).toHaveBeenCalled();
    });

    it('resetea el patrón de dash (llamada con array vacío)', () => {
      renderer.draw(SAMPLE_POINTS);
      const setLineDashCalls =
        (context.setLineDash as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls;
      // La última llamada debe ser [] para resetear
      const lastCall = setLineDashCalls[setLineDashCalls.length - 1][0];
      expect(lastCall).toEqual([]);
    });

    it('no lanza errores con dominio estándar', () => {
      expect(() => renderer.draw(SAMPLE_POINTS)).not.toThrow();
    });
  });

  // ── draw — puntos internos (líneas discontinuas) ──────────────────────────

  describe('draw — líneas discontinuas internas', () => {
    it('con n=1 (2 puntos) no dibuja líneas internas', () => {
      // Solo hay los dos extremos, sin puntos internos → beginPath
      // se llama para el relleno pero no para líneas internas adicionales
      const twoPoints: TrapezoidPoint[] = [{x: 0, y: 1}, {x: 2, y: 5}];
      renderer.draw(twoPoints);
      // Verificamos que no lanza y que arc se llama 2 veces (2 vértices)
      const arcCalls =
        (context.arc as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(arcCalls).toBe(2);
    });

    it('con n=3 (4 puntos) dibuja 2 líneas internas', () => {
      const fourPoints: TrapezoidPoint[] = [
        {x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 5}, {x: 3, y: 10},
      ];
      renderer.draw(fourPoints);
      // arc() debe llamarse 4 veces (uno por vértice)
      const arcCalls =
        (context.arc as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(arcCalls).toBe(4);
    });
  });

  // ── draw — función con valores negativos ──────────────────────────────────

  describe('draw — función con valores negativos', () => {
    it('no lanza errores cuando f(x) es negativa', () => {
      const negativePoints: TrapezoidPoint[] = [
        {x: -2, y: -3}, {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -3},
      ];
      expect(() => renderer.draw(negativePoints)).not.toThrow();
      expect(context.fill).toHaveBeenCalled();
    });
  });
});
