/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file function-renderer.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de FunctionRenderer.
 *
 *   FunctionRenderer recibe callbacks inyectados (toPixelX, toPixelY,
 *   evaluateAt), por lo que es fácil de testear sin mocks complejos.
 *
 *   Lo que verificamos:
 *     - draw() llama a stroke() cuando hay puntos finitos.
 *     - draw() llama a moveTo() para el primer punto.
 *     - draw() no llama a lineTo() cuando todos los valores son NaN.
 *     - Los saltos bruscos usan moveTo() en lugar de lineTo() (asíntotas).
 *     - save/restore simétricos.
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {FunctionRenderer} from
  '../../trapezoid/view/function-renderer.js';
import {createMockContext} from './canvas-context.mock.js';

/** Identidad: coordenadas matemáticas = píxeles (escala 1:1). */
const identityX = (x: number): number => x;
const identityY = (y: number): number => y;

describe('FunctionRenderer', () => {
  let context: CanvasRenderingContext2D;
  let renderer: FunctionRenderer;

  beforeEach(() => {
    context = createMockContext();
    renderer = new FunctionRenderer(context);
  });

  describe('draw', () => {
    it('llama a stroke() cuando hay puntos finitos que dibujar', () => {
      renderer.draw(0, 1, (x: number): number => x * x, identityX, identityY);
      expect(context.stroke).toHaveBeenCalled();
    });

    it('llama a moveTo() al menos una vez para iniciar el trazo', () => {
      renderer.draw(0, 1, (x: number): number => x * x, identityX, identityY);
      expect(context.moveTo).toHaveBeenCalled();
    });

    it('llama a lineTo() para los puntos que continúan el trazo', () => {
      renderer.draw(0, 1, (x: number): number => x, identityX, identityY);
      expect(context.lineTo).toHaveBeenCalled();
    });

    it('salva y restaura el contexto simétricamente', () => {
      renderer.draw(0, 1, (x: number): number => x, identityX, identityY);
      const saveCalls =
        (context.save as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      const restoreCalls =
        (context.restore as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(saveCalls).toBe(restoreCalls);
    });

    it('llama a stroke() aunque la función sea constante', () => {
      renderer.draw(0, 2, (): number => 5, identityX, identityY);
      expect(context.stroke).toHaveBeenCalled();
    });

    it('no llama a lineTo() cuando todos los puntos son NaN', () => {
      renderer.draw(0, 1, (): number => NaN, identityX, identityY);
      expect(context.lineTo).not.toHaveBeenCalled();
    });

    it('usa moveTo() adicional al detectar un salto brusco (asíntota)', () => {
      const stepFunction = (x: number): number => (x < 0.5 ? 0 : 1e6);
      renderer.draw(0, 1, stepFunction, identityX, identityY);
      const moveToCallCount =
        (context.moveTo as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(moveToCallCount).toBeGreaterThanOrEqual(2);
    });

    it('no lanza errores cuando el intervalo es degenerado (start === end)',
        () => {
          expect(() =>
            renderer.draw(1, 1, (x: number): number => x, identityX, identityY),
          ).not.toThrow();
        },
    );

    it('levanta el lápiz cuando encuentra NaN intercalado entre valores válidos', () => {
      // Válido → NaN → Válido: el NaN a mitad del trazo debe ejecutar penDown=false
      let callCount = 0;
      const nanInMiddle = (): number => {
        callCount++;
        if (callCount === 250) return NaN; // NaN en el punto central
        return 1;
      };
      renderer.draw(0, 1, nanInMiddle, identityX, identityY);
      // Debe haber al menos 2 moveTo: el inicial y el de la reanudación tras NaN
      const moveToCount =
        (context.moveTo as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(moveToCount).toBeGreaterThanOrEqual(2);
    });

    it('pone penDown=false y reanuda con moveTo cuando NaN aparece entre valores válidos', () => {
      let callCount = 0;
      const nanInMiddle = (): number => {
        callCount++;
        return callCount === 250 ? NaN : 1;
      };
      renderer.draw(0, 1, nanInMiddle, identityX, identityY);
      const moveToCount =
        (context.moveTo as ReturnType<typeof import('vitest').vi.fn>)
            .mock.calls.length;
      expect(moveToCount).toBeGreaterThanOrEqual(2);
    });
  });
});
