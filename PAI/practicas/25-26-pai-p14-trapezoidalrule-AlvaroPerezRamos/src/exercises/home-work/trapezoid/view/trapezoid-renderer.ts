/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-renderer.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Renderizador de los trapecios sobre el canvas.
 */

import {TrapezoidPoint} from '../model/trapezoid-calculator';
import {CoordinateTransformer} from '../util/coordinate-transformer';

/** Color de relleno rosa translúcido de los trapecios. */
const FILL_COLOR = 'rgba(220, 80, 100, 0.25)';

/** Color del borde de los trapecios (misma rosa, más opaca). */
const STROKE_COLOR = 'rgba(220, 80, 100, 0.6)';

/** Patrón de la línea discontinua vertical: [trazo, hueco] en píxeles. */
const DASH_PATTERN: [number, number] = [6, 4];

/** Color de las líneas verticales discontinuas. */
const DASHED_LINE_COLOR = 'rgba(100, 100, 120, 0.7)';

/** Grosor de las líneas verticales discontinuas en píxeles. */
const DASHED_LINE_WIDTH = 1;

/** Radio de los puntos rojos en los vértices en píxeles. */
const VERTEX_POINT_RADIUS = 5;

/** Color de los puntos rojos. */
const VERTEX_POINT_COLOR = 'crimson';

/**
 * Renderiza el área de los trapecios, las líneas de división y los
 * vértices sobre el canvas. No realiza cálculos matemáticos.
 */
export class TrapezoidRenderer {
  /**
   * @param renderingContext - Contexto 2D del canvas.
   * @param transformer      - Conversor coordenadas matemáticas → píxeles.
   */
  constructor(
    private readonly renderingContext: CanvasRenderingContext2D,
    private readonly transformer: CoordinateTransformer,
  ) { }

  /**
   * Dibuja en orden: relleno de trapecios → líneas de división →
   * puntos en los vértices. El orden garantiza que los puntos queden
   * siempre encima del relleno y las líneas.
   * @param divisionPoints - Puntos de división (x₀…xₙ) con sus valores f(xᵢ).
   */
  draw(divisionPoints: readonly TrapezoidPoint[]): void {
    if (divisionPoints.length < 2) return;

    this.renderingContext.save();
    this.drawTrapezoidFills(divisionPoints);
    this.drawDashedDivisionLines(divisionPoints);
    this.drawVertexPoints(divisionPoints);
    this.renderingContext.restore();
  }

  /**
   * Dibuja el relleno rosa de cada trapecio individualmente.
   * Cada trapecio va de xᵢ a xᵢ₊₁ y tiene cuatro vértices:
   *   (xᵢ, 0) → (xᵢ, f(xᵢ)) → (xᵢ₊₁, f(xᵢ₊₁)) → (xᵢ₊₁, 0)
   * @param divisionPoints - Puntos de división.
   */
  private drawTrapezoidFills(
      divisionPoints: readonly TrapezoidPoint[],
  ): void {
    const pixelY0 = this.transformer.toPixelY(0);

    this.renderingContext.fillStyle = FILL_COLOR;
    this.renderingContext.strokeStyle = STROKE_COLOR;
    this.renderingContext.lineWidth = 1;

    for (let index = 0; index < divisionPoints.length - 1; index++) {
      const left = divisionPoints[index];
      const right = divisionPoints[index + 1];

      const pixelXLeft = this.transformer.toPixelX(left.x);
      const pixelXRight = this.transformer.toPixelX(right.x);
      const pixelYLeft = this.transformer.toPixelY(left.y);
      const pixelYRight = this.transformer.toPixelY(right.y);

      this.renderingContext.beginPath();
      this.renderingContext.moveTo(pixelXLeft, pixelY0);
      this.renderingContext.lineTo(pixelXLeft, pixelYLeft);
      this.renderingContext.lineTo(pixelXRight, pixelYRight);
      this.renderingContext.lineTo(pixelXRight, pixelY0);
      this.renderingContext.closePath();
      this.renderingContext.fill();
      this.renderingContext.stroke();
    }
  }

  /**
   * Dibuja las líneas verticales discontinuas en los puntos de división
   * internos (excluye los extremos x₀ y xₙ).
   * Las líneas van desde el eje X hasta f(xᵢ) en cada punto interno.
   * @param divisionPoints - Puntos de división.
   */
  private drawDashedDivisionLines(
      divisionPoints: readonly TrapezoidPoint[],
  ): void {
    const pixelY0 = this.transformer.toPixelY(0);

    this.renderingContext.save();
    this.renderingContext.strokeStyle = DASHED_LINE_COLOR;
    this.renderingContext.lineWidth = DASHED_LINE_WIDTH;
    this.renderingContext.setLineDash(DASH_PATTERN);

    for (let index = 1; index < divisionPoints.length - 1; index++) {
      const point = divisionPoints[index];
      const pixelX = this.transformer.toPixelX(point.x);
      const pixelY = this.transformer.toPixelY(point.y);

      this.renderingContext.beginPath();
      this.renderingContext.moveTo(pixelX, pixelY0);
      this.renderingContext.lineTo(pixelX, pixelY);
      this.renderingContext.stroke();
    }

    this.renderingContext.setLineDash([]);
    this.renderingContext.restore();
  }

  /**
   * Dibuja un círculo rojo en cada vértice superior (xᵢ, f(xᵢ)),
   * incluyendo los extremos del intervalo.
   * @param divisionPoints - Puntos de división.
   */
  private drawVertexPoints(
      divisionPoints: readonly TrapezoidPoint[],
  ): void {
    this.renderingContext.fillStyle = VERTEX_POINT_COLOR;

    for (const point of divisionPoints) {
      const pixelX = this.transformer.toPixelX(point.x);
      const pixelY = this.transformer.toPixelY(point.y);

      this.renderingContext.beginPath();
      this.renderingContext.arc(
          pixelX, pixelY, VERTEX_POINT_RADIUS, 0, 2 * Math.PI,
      );
      this.renderingContext.fill();
    }
  }
}
