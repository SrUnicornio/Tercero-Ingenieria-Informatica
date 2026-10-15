/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file function-renderer.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Renderizador de la curva f(x) sobre el canvas.
 */

import {EvaluateAt} from '../observer/event';

/** Número de puntos muestreados para dibujar la curva. */
const SAMPLE_COUNT = 500;

/** Estilo visual de la curva. */
const FUNCTION_STROKE_COLOR = 'rgb(0, 102, 153)';
const FUNCTION_LINE_WIDTH = 2;

/** Umbral de salto para detectar asíntotas o discontinuidades. */
const ASYMPTOTE_THRESHOLD = 1000;

export type ToPixelX = (mathX: number) => number;
export type ToPixelY = (mathY: number) => number;

/**
 * Muestrea f(x) en el intervalo [start, end] y dibuja la curva.
 * Los saltos mayores que ASYMPTOTE_THRESHOLD se tratan levantando
 * el lápiz para no conectar ramas de asíntotas.
 */
export class FunctionRenderer {
  /** @param renderingContext - Contexto 2D del canvas. */
  constructor(
    private readonly renderingContext: CanvasRenderingContext2D,
  ) { }

  /**
   * Muestrea y dibuja f(x) en [start, end].
   * @param start - Extremo izquierdo del dominio.
   * @param end - Extremo derecho del dominio.
   * @param evaluateAt - Callback que evalúa f(x).
   * @param toPixelX - Callback X: valor matemático → píxeles.
   * @param toPixelY - Callback Y: valor matemático → píxeles.
   */
  draw(
      start: number,
      end: number,
      evaluateAt: EvaluateAt,
      toPixelX: ToPixelX,
      toPixelY: ToPixelY,
  ): void {
    const samples = this.computeSamples(start, end, evaluateAt);
    if (samples.length === 0) return;

    this.renderingContext.save();
    this.renderingContext.strokeStyle = FUNCTION_STROKE_COLOR;
    this.renderingContext.lineWidth = FUNCTION_LINE_WIDTH;
    this.renderingContext.beginPath();

    let penDown = false;

    for (let index = 0; index < samples.length; index++) {
      const {x, y} = samples[index];
      if (isNaN(y)) {
        penDown = false;
        continue;
      }

      const pixelX = toPixelX(x);
      const pixelY = toPixelY(y);

      if (!penDown) {
        this.renderingContext.moveTo(pixelX, pixelY);
        penDown = true;
        continue;
      }

      const prevY = samples[index - 1].y;
      const jumpDetected =
        !isNaN(prevY) && Math.abs(y - prevY) > ASYMPTOTE_THRESHOLD;

      if (jumpDetected) {
        this.renderingContext.moveTo(pixelX, pixelY);
      } else {
        this.renderingContext.lineTo(pixelX, pixelY);
      }
    }

    this.renderingContext.stroke();
    this.renderingContext.restore();
  }

  /**
   * Muestrea f(x) uniformemente en [start, end].
   * @returns Array de pares {x, y}.
   */
  private computeSamples(
      start: number,
      end: number,
      evaluateAt: EvaluateAt,
  ): { x: number; y: number }[] {
    const step = (end - start) / SAMPLE_COUNT;
    const samples: { x: number; y: number }[] = [];

    for (let index = 0; index <= SAMPLE_COUNT; index++) {
      const x = start + index * step;
      samples.push({x, y: evaluateAt(x)});
    }

    return samples;
  }
}
