/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file canvas-context.mock.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Helper compartido por los tests de view/.
 *   Crea un objeto que implementa la interfaz CanvasRenderingContext2D
 *   con todas las propiedades y métodos reemplazados por vi.fn() o
 *   valores por defecto adecuados para tests.
 *
 *   Uso:
 *   ```typescript
 *   const ctx = createMockContext();
 *   // ... ejecutar el renderizador ...
 *   expect(ctx.beginPath).toHaveBeenCalled();
 *   ```
 */

import {vi} from 'vitest';

/**
 * @function createMockContext
 * @description Crea un mock completo de CanvasRenderingContext2D.
 *   Solo están implementados como vi.fn() los métodos que los
 *   renderizadores de esta práctica realmente invocan.
 *   El resto se deja como vi.fn() vacío para no lanzar errores si
 *   algún código los llama accidentalmente.
 * @returns Objeto compatible con CanvasRenderingContext2D mockeado.
 */
export function createMockContext(): CanvasRenderingContext2D {
  return {
    // ── Estado ────────────────────────────────────────────────────────────
    save: vi.fn(),
    restore: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    globalAlpha: 1,

    // ── Trazado ───────────────────────────────────────────────────────────
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),

    // ── Líneas discontinuas ───────────────────────────────────────────────
    setLineDash: vi.fn(),
    getLineDash: vi.fn(() => []),

    // ── Rectángulos ───────────────────────────────────────────────────────
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    clearRect: vi.fn(),

    // ── Transformaciones ──────────────────────────────────────────────────
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),

    // ── Texto ─────────────────────────────────────────────────────────────
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({width: 0})),
  } as unknown as CanvasRenderingContext2D;
}

/**
 * @function makeTransformer
 * @description Crea un CoordinateTransformer con layout y dominio
 *   estándar para tests de view, evitando repetir la construcción
 *   en cada archivo de test.
 * @param overrides - Valores opcionales para sobreescribir el dominio.
 * @returns Instancia de CoordinateTransformer lista para usar.
 */
export {CoordinateTransformer} from
  '../../trapezoid/util/coordinate-transformer.js';
export type {CanvasLayout, CoordinateDomain} from
  '../../trapezoid/util/coordinate-transformer.js';

export const STANDARD_LAYOUT = {
  canvasWidth: 800,
  canvasHeight: 600,
  marginLeft: 50,
  marginBottom: 40,
  marginRight: 10,
  marginTop: 10,
} as const;

export const STANDARD_DOMAIN = {
  mathStart: -2,
  mathEnd: 2,
  mathYMin: -1,
  mathYMax: 3,
} as const;
