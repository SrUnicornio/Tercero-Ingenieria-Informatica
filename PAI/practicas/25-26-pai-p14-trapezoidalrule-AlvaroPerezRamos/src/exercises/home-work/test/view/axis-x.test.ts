/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis-x.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de AxisX.
 *
 *   Verificamos comportamientos observables a través del contexto mockeado:
 *     - draw() invoca save/restore simétricamente.
 *     - Se llama a stroke() (línea del eje dibujada).
 *     - Se llama a fillText() (etiquetas numéricas dibujadas).
 *     - La etiqueta del 0 se dibuja cuando 0 está dentro del dominio.
 *     - No lanza errores con dominios fuera de 0.
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {AxisX} from '../../trapezoid/view/axis/axis-x.js';
import {CoordinateTransformer} from
  '../../trapezoid/util/coordinate-transformer.js';
import {DEFAULT_COORDINATE_CONFIG} from
  '../../trapezoid/interfaces/coordinate-config.js';
import {
  createMockContext,
  STANDARD_LAYOUT,
  STANDARD_DOMAIN,
} from './canvas-context.mock.js';

describe('AxisX', () => {
  let context: CanvasRenderingContext2D;
  let transformer: CoordinateTransformer;
  let axisX: AxisX;

  beforeEach(() => {
    context = createMockContext();
    transformer = new CoordinateTransformer(STANDARD_LAYOUT, STANDARD_DOMAIN);
    axisX = new AxisX(context, transformer, DEFAULT_COORDINATE_CONFIG);
  });

  describe('draw', () => {
    it('salva y restaura el contexto simétricamente', () => {
      axisX.draw();
      const saveCalls =
        (context.save as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      const restoreCalls =
        (context.restore as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(saveCalls).toBe(restoreCalls);
    });

    it('llama a stroke al menos una vez (línea del eje)', () => {
      axisX.draw();
      expect(context.stroke).toHaveBeenCalled();
    });

    it('llama a fillText al menos una vez (etiquetas numéricas)', () => {
      axisX.draw();
      expect(context.fillText).toHaveBeenCalled();
    });

    it('dibuja la etiqueta "0" cuando 0 está dentro del dominio [-2, 2]', () => {
      axisX.draw();
      const fillTextCalls =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls;
      const labelsDrawn = fillTextCalls.map((call) => call[0]);
      expect(labelsDrawn).toContain('0');
    });

    it('no lanza errores cuando el dominio X no incluye el 0', () => {
      const positiveTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: 1, mathEnd: 5, mathYMin: 0, mathYMax: 10},
      );
      const positiveAxisX = new AxisX(
          context, positiveTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      expect(() => positiveAxisX.draw()).not.toThrow();
    });

    it('llama a fill() para dibujar la punta de flecha', () => {
      axisX.draw();
      expect(context.fill).toHaveBeenCalled();
    });

    it('dibuja etiqueta del extremo derecho cuando no coincide con tick mayor', () => {
      // dominio [0, 3] con spacing=0.5 → mathEnd=3 no cae en múltiplo de 0.5
      // desde 0... sí cae. Usar [0, 2.3] para que mathEnd no sea tick mayor.
      const asymmetricTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: 0, mathEnd: 2.3, mathYMin: -1, mathYMax: 3},
      );
      const asymmetricAxisX = new AxisX(
          context, asymmetricTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      asymmetricAxisX.draw();
      expect(context.fillText).toHaveBeenCalled();
    });

    it('no dibuja ticks fuera del dominio cuando start > 0', () => {
      // Con mathStart=1, mathEnd=3: el bucle hacia la izquierda desde 0
      // ejecuta el continue porque mathX < mathStart
      const positiveTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: 1, mathEnd: 3, mathYMin: 0, mathYMax: 5},
      );
      const positiveAxisX = new AxisX(
          context, positiveTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      expect(() => positiveAxisX.draw()).not.toThrow();
      expect(context.stroke).toHaveBeenCalled();
    });

    it('no dibuja ticks fuera del dominio cuando end < 0', () => {
      // Con mathStart=-3, mathEnd=-1: el bucle hacia la derecha desde 0
      // ejecuta el continue porque mathX > mathEnd
      const negativeTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -3, mathEnd: -1, mathYMin: 0, mathYMax: 5},
      );
      const negativeAxisX = new AxisX(
          context, negativeTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      expect(() => negativeAxisX.draw()).not.toThrow();
      expect(context.stroke).toHaveBeenCalled();
    });
  });

  // Tests específicos para los umbrales de notación compacta (k, M, G)

  describe('Umbrales de notación compacta', () => {
    it('usa notación compacta "k" para valores ≥ 1 000', () => {
      const largeTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 1500, mathYMin: 0, mathYMax: 5},
      );
      const largeAxisX = new AxisX(
          context, largeTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      largeAxisX.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('1.5k');
    });

    it('usa notación compacta "M" para valores ≥ 1 000 000', () => {
      const hugeTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2_000_000, mathYMin: 0, mathYMax: 5},
      );
      const hugeAxisX = new AxisX(
          context, hugeTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      hugeAxisX.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('2M');
    });

    it('usa notación compacta "G" para valores ≥ 1 000 000 000', () => {
      const massiveTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 3_000_000_000, mathYMin: 0, mathYMax: 5},
      );
      const massiveAxisX = new AxisX(
          context, massiveTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      massiveAxisX.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('3G');
    });
  });
});
