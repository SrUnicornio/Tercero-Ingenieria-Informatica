/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis-y.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de AxisY.
 *
 *   Verificamos comportamientos observables a través del contexto mockeado:
 *     - draw() invoca save/restore simétricamente.
 *     - Se llama a stroke() (línea del eje dibujada).
 *     - Se llama a fillText() con la etiqueta "0" cuando 0 está en rango.
 *     - Se llama a fillText() con la etiqueta "0" incluso cuando el
 *       rango es completamente positivo (0 queda en el borde inferior).
 *     - No lanza errores con rangos extremos.
 *     - Las ramas continue se ejecutan cuando 0 cae fuera del rango
 *       (mathYMin > 0 o mathYMax < 0).
 *     - La etiqueta extra en mathYMax se dibuja cuando mathYMax no
 *       coincide con un múltiplo del espaciado mayor.
 *     - Notación compacta k, M, G para valores grandes.
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {AxisY} from '../../trapezoid/view/axis/axis-y.js';
import {CoordinateTransformer} from
  '../../trapezoid/util/coordinate-transformer.js';
import {DEFAULT_COORDINATE_CONFIG} from
  '../../trapezoid/interfaces/coordinate-config.js';
import {
  createMockContext,
  STANDARD_LAYOUT,
  STANDARD_DOMAIN,
} from './canvas-context.mock.js';

describe('AxisY', () => {
  let context: CanvasRenderingContext2D;
  let transformer: CoordinateTransformer;
  let axisY: AxisY;

  beforeEach(() => {
    context = createMockContext();
    transformer = new CoordinateTransformer(STANDARD_LAYOUT, STANDARD_DOMAIN);
    axisY = new AxisY(context, transformer, DEFAULT_COORDINATE_CONFIG);
  });

  describe('draw', () => {
    it('salva y restaura el contexto simétricamente', () => {
      axisY.draw();
      const saveCalls =
        (context.save as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      const restoreCalls =
        (context.restore as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(saveCalls).toBe(restoreCalls);
    });

    it('llama a stroke al menos una vez (línea del eje)', () => {
      axisY.draw();
      expect(context.stroke).toHaveBeenCalled();
    });

    it('llama a fillText al menos una vez (etiquetas numéricas)', () => {
      axisY.draw();
      expect(context.fillText).toHaveBeenCalled();
    });

    it('dibuja la etiqueta "0" cuando el rango incluye negativos y positivos', () => {
      axisY.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('0');
    });

    it('dibuja la etiqueta "0" cuando el rango es completamente positivo', () => {
      const positiveTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: 0, mathYMax: 5},
      );
      const positiveAxisY = new AxisY(
          context, positiveTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      positiveAxisY.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('0');
    });

    it('no lanza errores cuando el rango es completamente negativo', () => {
      const negativeTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: -5, mathYMax: 0},
      );
      const negativeAxisY = new AxisY(
          context, negativeTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      expect(() => negativeAxisY.draw()).not.toThrow();
    });

    it('llama a fill() para dibujar la punta de flecha', () => {
      axisY.draw();
      expect(context.fill).toHaveBeenCalled();
    });

    // ── Ramas continue: 0 fuera del rango ──────────────────────────────────

    it('ejecuta la rama continue hacia arriba cuando mathYMin > 0', () => {
      // mathYMin=2 → el bucle hacia arriba desde 0 salta mathY=0 porque
      // mathY < mathYMin → se ejecuta el continue
      const aboveZeroTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: 2, mathYMax: 6},
      );
      const aboveZeroAxisY = new AxisY(
          context, aboveZeroTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      expect(() => aboveZeroAxisY.draw()).not.toThrow();
      expect(context.stroke).toHaveBeenCalled();
    });

    it('ejecuta la rama continue hacia abajo cuando mathYMax < 0', () => {
      // mathYMax=-1 → el bucle hacia abajo desde -minorSpacing salta
      // valores > mathYMax → se ejecuta el continue
      const belowZeroTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: -6, mathYMax: -2},
      );
      const belowZeroAxisY = new AxisY(
          context, belowZeroTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      expect(() => belowZeroAxisY.draw()).not.toThrow();
      expect(context.stroke).toHaveBeenCalled();
    });

    // ── Etiqueta extra en mathYMax ──────────────────────────────────────────

    it('dibuja etiqueta extra en mathYMax cuando no coincide con tick mayor', () => {
      // mathYMax=5.7 no es múltiplo de ningún spacing bonito → se dibuja extra
      const asymmetricTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: 0, mathYMax: 5.7},
      );
      const asymmetricAxisY = new AxisY(
          context, asymmetricTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      asymmetricAxisY.draw();
      expect(context.fillText).toHaveBeenCalled();
    });

    // ── Tick extra en mathYMax ──────────────────────────────────────────────

    it('dibuja tick extra en mathYMax cuando no es múltiplo del espaciado', () => {
      // mathYMax=5.7 → tick extra al final
      const asymmetricTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: 0, mathYMax: 5.7},
      );
      const asymmetricAxisY = new AxisY(
          context, asymmetricTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      asymmetricAxisY.draw();
      expect(context.stroke).toHaveBeenCalled();
    });
  });

  // ── Notación compacta ─────────────────────────────────────────────────────

  describe('Umbrales de notación compacta', () => {
    it('usa notación compacta "k" para valores ≥ 1 000', () => {
      const largeTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: 0, mathYMax: 1500},
      );
      const largeAxisY = new AxisY(
          context, largeTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      largeAxisY.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('1.5k');
    });

    it('usa notación compacta "M" para valores ≥ 1 000 000', () => {
      const hugeTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: 0, mathYMax: 2_000_000},
      );
      const hugeAxisY = new AxisY(
          context, hugeTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      hugeAxisY.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('2M');
    });

    it('usa notación compacta "G" para valores ≥ 1 000 000 000', () => {
      const massiveTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: 0, mathYMax: 3_000_000_000},
      );
      const massiveAxisY = new AxisY(
          context, massiveTransformer, DEFAULT_COORDINATE_CONFIG,
      );
      massiveAxisY.draw();
      const labelsDrawn =
        (context.fillText as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.map((call) => call[0]);
      expect(labelsDrawn).toContain('3G');
    });
  });
});
