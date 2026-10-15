/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-system.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de CoordinateSystem.
 *
 *   CoordinateSystem no tiene DOM propio: recibe un contexto 2D.
 *   jsdom no implementa getContext('2d'), así que usamos el mock de
 *   contexto del helper compartido en lugar de un canvas real.
 *   Esto resuelve el "Cannot set properties of null" que ocurría
 *   cuando GridRenderer intentaba escribir en un contexto nulo.
 *
 *   Usamos vi.spyOn sobre los prototipos de GridRenderer, AxisX y
 *   AxisY para verificar la delegación — el mismo patrón que
 *   ViewRenderer usa en P13.
 *
 *   Casos cubiertos:
 *     - draw() delega en GridRenderer.draw(), AxisX.draw() y AxisY.draw().
 *     - El orden de dibujo es grid → axisX → axisY.
 *     - draw() no lanza errores con un dominio estándar.
 *     - update() reconstruye los renderizadores internos y el siguiente
 *       draw() sigue delegando correctamente.
 */

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {CoordinateSystem} from
  '../../trapezoid/view/coordinate-system.js';
import {CoordinateTransformer} from
  '../../trapezoid/util/coordinate-transformer.js';
import {DEFAULT_COORDINATE_CONFIG} from
  '../../trapezoid/interfaces/coordinate-config.js';
import {GridRenderer} from '../../trapezoid/view/grid-renderer.js';
import {AxisX} from '../../trapezoid/view/axis/axis-x.js';
import {AxisY} from '../../trapezoid/view/axis/axis-y.js';
import {createMockContext} from './canvas-context.mock.js';

/** Layout y dominio estándar para todos los tests. */
const LAYOUT = {
  canvasWidth: 800, canvasHeight: 600,
  marginLeft: 50, marginBottom: 40,
  marginRight: 10, marginTop: 10,
} as const;

const DOMAIN = {
  mathStart: -2, mathEnd: 2,
  mathYMin: -1, mathYMax: 3,
} as const;

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * @function buildSystem
 * @description Crea un CoordinateSystem con un contexto 2D mockeado
 *   (sin depender de jsdom canvas) y un transformer estándar.
 * @returns Objeto con el sistema de coordenadas y el transformer.
 */
function buildSystem(): {
  system: CoordinateSystem;
  transformer: CoordinateTransformer;
  } {
  const context = createMockContext();
  const transformer = new CoordinateTransformer(LAYOUT, DOMAIN);
  const system = new CoordinateSystem(
      context, transformer, DEFAULT_COORDINATE_CONFIG,
  );
  return {system, transformer};
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CoordinateSystem', () => {
  let setup: ReturnType<typeof buildSystem>;

  beforeEach(() => {
    setup = buildSystem();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── draw ──────────────────────────────────────────────────────────────────

  describe('draw', () => {
    it('delega en GridRenderer.draw()', () => {
      const spy = vi.spyOn(GridRenderer.prototype, 'draw');
      setup.system.draw();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('delega en AxisX.draw()', () => {
      const spy = vi.spyOn(AxisX.prototype, 'draw');
      setup.system.draw();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('delega en AxisY.draw()', () => {
      const spy = vi.spyOn(AxisY.prototype, 'draw');
      setup.system.draw();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('dibuja en orden: grid → axisX → axisY', () => {
      const callOrder: string[] = [];
      vi.spyOn(GridRenderer.prototype, 'draw').mockImplementation(
          () => {
            callOrder.push('grid');
          },
      );
      vi.spyOn(AxisX.prototype, 'draw').mockImplementation(
          () => {
            callOrder.push('axisX');
          },
      );
      vi.spyOn(AxisY.prototype, 'draw').mockImplementation(
          () => {
            callOrder.push('axisY');
          },
      );
      setup.system.draw();
      expect(callOrder).toEqual(['grid', 'axisX', 'axisY']);
    });

    it('no lanza errores con un dominio estándar', () => {
      expect(() => setup.system.draw()).not.toThrow();
    });
  });

  // ── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('tras update(), draw() sigue delegando en GridRenderer.draw()', () => {
      const newTransformer = new CoordinateTransformer(
          LAYOUT,
          {mathStart: 0, mathEnd: 4, mathYMin: 0, mathYMax: 10},
      );
      setup.system.update(newTransformer);
      const spy = vi.spyOn(GridRenderer.prototype, 'draw');
      setup.system.draw();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('tras update(), draw() sigue delegando en AxisX.draw()', () => {
      const newTransformer = new CoordinateTransformer(
          LAYOUT,
          {mathStart: 0, mathEnd: 4, mathYMin: 0, mathYMax: 10},
      );
      setup.system.update(newTransformer);
      const spy = vi.spyOn(AxisX.prototype, 'draw');
      setup.system.draw();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('update() no lanza errores con un dominio válido', () => {
      const newTransformer = new CoordinateTransformer(
          LAYOUT,
          {mathStart: -10, mathEnd: 10, mathYMin: -5, mathYMax: 5},
      );
      expect(() => setup.system.update(newTransformer)).not.toThrow();
    });
  });
});
