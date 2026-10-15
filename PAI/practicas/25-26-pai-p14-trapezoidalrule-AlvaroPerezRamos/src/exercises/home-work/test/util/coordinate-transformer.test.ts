/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-transformer.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de CoordinateTransformer.
 *
 *   CoordinateTransformer es matemática pura sin dependencias externas.
 *   Todos los tests son deterministas y no requieren mocks.
 *
 *   Estrategia de verificación:
 *     - Propiedades de frontera: mathStart → originPixelX,
 *       mathEnd → canvasWidth (todo el ancho disponible),
 *       mathYMin → originPixelY, mathYMax → píxel Y = 0.
 *     - Linealidad: punto intermedio mapea al píxel intermedio.
 *     - Inversión del eje Y: valores mayores de mathY producen
 *       píxeles menores (más arriba en canvas).
 *     - Escala independiente en X e Y.
 *     - Casos degenerados: dominio de ancho 0.
 *
 *   Nota sobre el centro vertical:
 *     El área dibujable Y va de originPixelY (= canvasHeight - marginBottom)
 *     hasta 0 (el borde superior). El centro es originPixelY / 2, no
 *     (canvasHeight - marginBottom) / 2 + marginBottom. Este transformer
 *     no tiene marginTop explícito; el área dibujable ocupa de 0 a originPixelY.
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {
  CoordinateTransformer,
  type CanvasLayout,
  type CoordinateDomain,
} from '../../trapezoid/util/coordinate-transformer.js';

/** Layout estándar usado en la mayoría de tests. */
const STANDARD_LAYOUT: CanvasLayout = {
  canvasWidth: 800,
  canvasHeight: 600,
  marginLeft: 50,
  marginBottom: 40,
  marginTop: 0, // No se usa en este transformer
  marginRight: 0, // No se usa en este transformer
};

/** Dominio estándar: x ∈ [-2, 2], y ∈ [-1, 3]. */
const STANDARD_DOMAIN: CoordinateDomain = {
  mathStart: -2,
  mathEnd: 2,
  mathYMin: -1,
  mathYMax: 3,
};

describe('CoordinateTransformer', () => {
  let transformer: CoordinateTransformer;

  beforeEach(() => {
    transformer = new CoordinateTransformer(
        STANDARD_LAYOUT, STANDARD_DOMAIN,
    );
  });

  // ── Acceso a propiedades ────────────────────────────────────────────────

  describe('getDomain', () => {
    it('devuelve el dominio con el que fue construido', () => {
      expect(transformer.getDomain()).toEqual(STANDARD_DOMAIN);
    });
  });

  describe('getLayout', () => {
    it('devuelve el layout con el que fue construido', () => {
      expect(transformer.getLayout()).toEqual(STANDARD_LAYOUT);
    });
  });

  // ── Origen en píxeles ────────────────────────────────────────────────────

  describe('getOriginPixelX', () => {
    it('es igual a marginLeft', () => {
      expect(transformer.getOriginPixelX()).toBe(STANDARD_LAYOUT.marginLeft);
    });

    it('es independiente del dominio matemático', () => {
      const otherTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {...STANDARD_DOMAIN, mathStart: 5, mathEnd: 10},
      );
      expect(otherTransformer.getOriginPixelX())
          .toBe(STANDARD_LAYOUT.marginLeft);
    });
  });

  describe('getOriginPixelY', () => {
    it('es igual a canvasHeight - marginBottom', () => {
      expect(transformer.getOriginPixelY()).toBe(
          STANDARD_LAYOUT.canvasHeight - STANDARD_LAYOUT.marginBottom,
      );
    });
  });

  // ── Escalas ──────────────────────────────────────────────────────────────

  describe('getScaleX', () => {
    it('es drawableWidth / (mathEnd - mathStart)', () => {
      const drawableWidth =
        STANDARD_LAYOUT.canvasWidth - STANDARD_LAYOUT.marginLeft;
      const domainWidth = STANDARD_DOMAIN.mathEnd - STANDARD_DOMAIN.mathStart;
      expect(transformer.getScaleX()).toBeCloseTo(drawableWidth / domainWidth);
    });

    it('las escalas X e Y son independientes', () => {
      expect(transformer.getScaleX()).not.toBe(transformer.getScaleY());
    });
  });

  describe('getScaleY', () => {
    it('es drawableHeight / (mathYMax - mathYMin)', () => {
      const drawableHeight =
        STANDARD_LAYOUT.canvasHeight - STANDARD_LAYOUT.marginBottom;
      const rangeHeight =
        STANDARD_DOMAIN.mathYMax - STANDARD_DOMAIN.mathYMin;
      expect(transformer.getScaleY()).toBeCloseTo(
          drawableHeight / rangeHeight,
      );
    });
  });

  // ── toPixelX ─────────────────────────────────────────────────────────────

  describe('toPixelX', () => {
    it('mathStart mapea exactamente a originPixelX', () => {
      expect(transformer.toPixelX(STANDARD_DOMAIN.mathStart))
          .toBe(transformer.getOriginPixelX());
    });

    it('mathEnd mapea al borde derecho del área dibujable', () => {
      expect(transformer.toPixelX(STANDARD_DOMAIN.mathEnd))
          .toBeCloseTo(STANDARD_LAYOUT.canvasWidth);
    });

    it('punto central del dominio mapea al centro del área dibujable', () => {
      const midMath =
        (STANDARD_DOMAIN.mathStart + STANDARD_DOMAIN.mathEnd) / 2;
      // Centro entre originPixelX y canvasWidth
      const midPixel =
        (STANDARD_LAYOUT.marginLeft + STANDARD_LAYOUT.canvasWidth) / 2;
      expect(transformer.toPixelX(midMath)).toBeCloseTo(midPixel);
    });

    it('valores mayores de mathX producen píxeles mayores (crece a la derecha)', () => {
      expect(transformer.toPixelX(1)).toBeGreaterThan(transformer.toPixelX(0));
    });

    it('la conversión es lineal: paso doble → píxel doble', () => {
      const pixelAt0 = transformer.toPixelX(0);
      const pixelAt1 = transformer.toPixelX(1);
      const pixelAt2 = transformer.toPixelX(2);
      expect(pixelAt2 - pixelAt0).toBeCloseTo(2 * (pixelAt1 - pixelAt0));
    });
  });

  // ── toPixelY ─────────────────────────────────────────────────────────────

  describe('toPixelY', () => {
    it('mathYMin mapea exactamente a originPixelY (borde inferior)', () => {
      expect(transformer.toPixelY(STANDARD_DOMAIN.mathYMin))
          .toBe(transformer.getOriginPixelY());
    });

    it('mathYMax mapea al borde superior del área dibujable (píxelY = 0)', () => {
      expect(transformer.toPixelY(STANDARD_DOMAIN.mathYMax))
          .toBeCloseTo(0);
    });

    it('el eje Y está invertido: mathY mayor produce píxelY menor', () => {
      expect(transformer.toPixelY(2)).toBeLessThan(transformer.toPixelY(0));
    });

    it('punto central del rango mapea al centro vertical del área dibujable', () => {
      const midMath =
        (STANDARD_DOMAIN.mathYMin + STANDARD_DOMAIN.mathYMax) / 2;
      // El área Y va de originPixelY hasta 0; el centro es originPixelY / 2
      const midPixel = transformer.getOriginPixelY() / 2;
      expect(transformer.toPixelY(midMath)).toBeCloseTo(midPixel);
    });

    it('la conversión es lineal en Y: paso doble → píxel doble', () => {
      const pixelAt0 = transformer.toPixelY(0);
      const pixelAt1 = transformer.toPixelY(1);
      const pixelAt2 = transformer.toPixelY(2);
      expect(pixelAt2 - pixelAt0).toBeCloseTo(2 * (pixelAt1 - pixelAt0));
    });
  });

  // ── Casos degenerados ─────────────────────────────────────────────────────

  describe('dominio degenerado (mathStart === mathEnd)', () => {
    it('no lanza error y scaleX es 1 por defecto', () => {
      const degenerateTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {...STANDARD_DOMAIN, mathStart: 5, mathEnd: 5},
      );
      expect(degenerateTransformer.getScaleX()).toBe(1);
    });
  });

  describe('rango degenerado (mathYMin === mathYMax)', () => {
    it('no lanza error y scaleY es 1 por defecto', () => {
      const degenerateTransformer = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {...STANDARD_DOMAIN, mathYMin: 0, mathYMax: 0},
      );
      expect(degenerateTransformer.getScaleY()).toBe(1);
    });
  });

  // ── Dominio completamente positivo ────────────────────────────────────────

  describe('dominio X positivo (start=0, end=4)', () => {
    it('mathStart=0 mapea a originPixelX', () => {
      const t = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: 0, mathEnd: 4, mathYMin: 0, mathYMax: 10},
      );
      expect(t.toPixelX(0)).toBe(t.getOriginPixelX());
    });
  });

  // ── Dominio con valores negativos en ambos ejes ───────────────────────────

  describe('dominio completamente negativo en Y', () => {
    it('mathYMin negativo mapea a originPixelY', () => {
      const t = new CoordinateTransformer(
          STANDARD_LAYOUT,
          {mathStart: -2, mathEnd: 2, mathYMin: -5, mathYMax: -1},
      );
      expect(t.toPixelY(-5)).toBe(t.getOriginPixelY());
    });
  });
});
