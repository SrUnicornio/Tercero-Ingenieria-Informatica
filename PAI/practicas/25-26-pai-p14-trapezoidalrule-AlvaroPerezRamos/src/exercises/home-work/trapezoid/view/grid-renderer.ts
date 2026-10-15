/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file grid-renderer.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Renderizador de la cuadrícula de fondo del sistema de coordenadas.
 */

import {CoordinateTransformer} from '../util/coordinate-transformer';
import {TickCalculator} from '../util/tick-calculator';
import {CoordinateConfig} from '../interfaces/coordinate-config';

/**
 * Dibuja la cuadrícula de dos niveles (mayor y menor) sobre el área
 * dibujable del canvas, alineada con el CoordinateTransformer.
 */
export class GridRenderer {
  /**
   * @param renderingContext - Contexto 2D del canvas.
   * @param transformer - Conversor coordenadas matemáticas → píxeles.
   * @param config - Configuración visual de la cuadrícula.
   */
  constructor(
    private readonly renderingContext: CanvasRenderingContext2D,
    private readonly transformer: CoordinateTransformer,
    private readonly config: CoordinateConfig,
  ) { }

  /**
   * Calcula el espaciado dinámicamente con TickCalculator
   * y dibuja primero el fondo blanco, luego las líneas menores
   * y finalmente las mayores (para que queden encima visualmente).
   */
  draw(): void {
    const {mathStart, mathEnd, mathYMin, mathYMax} =
      this.transformer.getDomain();

    const xRange = mathEnd - mathStart;
    const yRange = mathYMax - mathYMin;

    const majorSpacingX = TickCalculator.compute(xRange);
    const majorSpacingY = TickCalculator.compute(yRange);
    const minorSpacingX = majorSpacingX / this.config.minorSubdivisions;
    const minorSpacingY = majorSpacingY / this.config.minorSubdivisions;

    this.drawBackground();
    this.drawMinorLines(minorSpacingX, minorSpacingY,
        majorSpacingX, majorSpacingY);
    this.drawMajorLines(majorSpacingX, majorSpacingY);
  }

  /**
   *  Rellena el canvas completo con fondo blanco.
   */
  private drawBackground(): void {
    const {canvasWidth, canvasHeight} = this.transformer.getLayout();
    this.renderingContext.fillStyle = 'white';
    this.renderingContext.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  /**
   * Dibuja las líneas menores saltando las posiciones de línea mayor
   * (tolerancia de un 1 % del paso menor) para evitar superposición.
   * @param minorSpacingX - Paso menor en unidades matemáticas X.
   * @param minorSpacingY - Paso menor en unidades matemáticas Y.
   * @param majorSpacingX - Paso mayor en unidades matemáticas X.
   * @param majorSpacingY - Paso mayor en unidades matemáticas Y.
   */
  private drawMinorLines(
      minorSpacingX: number,
      minorSpacingY: number,
      majorSpacingX: number,
      majorSpacingY: number,
  ): void {
    this.renderingContext.save();
    this.renderingContext.strokeStyle = this.config.minorLineColor;
    this.renderingContext.lineWidth = this.config.minorLineWidth;

    this.iterateVerticalLines(minorSpacingX, (mathX) => {
      const remainder = Math.abs(
          (mathX % majorSpacingX + majorSpacingX) % majorSpacingX,
      );
      return remainder > minorSpacingX * 0.01 &&
        remainder < majorSpacingX - minorSpacingX * 0.01;
    });

    this.iterateHorizontalLines(minorSpacingY, (mathY) => {
      const remainder = Math.abs(
          (mathY % majorSpacingY + majorSpacingY) % majorSpacingY,
      );
      return remainder > minorSpacingY * 0.01 &&
        remainder < majorSpacingY - minorSpacingY * 0.01;
    });

    this.renderingContext.restore();
  }

  /**
   * Dibuja las líneas mayores sobre toda el área dibujable.
   * @param majorSpacingX - Paso mayor en unidades matemáticas X.
   * @param majorSpacingY - Paso mayor en unidades matemáticas Y.
   */
  private drawMajorLines(
      majorSpacingX: number,
      majorSpacingY: number,
  ): void {
    this.renderingContext.save();
    this.renderingContext.strokeStyle = this.config.majorLineColor;
    this.renderingContext.lineWidth = this.config.majorLineWidth;

    this.iterateVerticalLines(majorSpacingX, () => true);
    this.iterateHorizontalLines(majorSpacingY, () => true);

    this.renderingContext.restore();
  }

  /**
   * Se ancla en 0 y expande hacia arriba hasta cubrir [mathYMin, mathYMax].
   * @param spacingX - Paso de iteración en unidades matemáticas X.
   * @param shouldDraw - Predicado que decide si dibujar en cada mathX.
   */
  private iterateVerticalLines(
      spacingX: number,
      shouldDraw: (mathX: number) => boolean,
  ): void {
    const {mathStart, mathEnd} = this.transformer.getDomain();
    const pixelTop = 0;
    const pixelBottom = this.transformer.getOriginPixelY();
    for (let mathX = 0; mathX <= mathEnd + spacingX * 0.01;
      mathX += spacingX) {
      if (mathX < mathStart || !shouldDraw(mathX)) continue;
      const pixelX = this.transformer.toPixelX(mathX);
      this.renderingContext.beginPath();
      this.renderingContext.moveTo(pixelX, pixelTop);
      this.renderingContext.lineTo(pixelX, pixelBottom);
      this.renderingContext.stroke();
    }
    for (let mathX = -spacingX; mathX >= mathStart - spacingX * 0.01;
      mathX -= spacingX) {
      if (mathX > mathEnd || !shouldDraw(mathX)) continue;
      const pixelX = this.transformer.toPixelX(mathX);
      this.renderingContext.beginPath();
      this.renderingContext.moveTo(pixelX, pixelTop);
      this.renderingContext.lineTo(pixelX, pixelBottom);
      this.renderingContext.stroke();
    }
  }

  /**
   * Se ancla en 0 y expande hacia arriba hasta cubrir [mathYMin, mathYMax].
   * @param spacingY - Paso de iteración en unidades matemáticas Y.
   * @param shouldDraw - Predicado que decide si dibujar en cada mathY.
   */
  private iterateHorizontalLines(
      spacingY: number,
      shouldDraw: (mathY: number) => boolean,
  ): void {
    const {mathYMin, mathYMax} = this.transformer.getDomain();
    const {canvasWidth} = this.transformer.getLayout();
    const pixelLeft = this.transformer.getOriginPixelX();
    const pixelRight = canvasWidth;
    for (let mathY = 0; mathY <= mathYMax + spacingY * 0.01;
      mathY += spacingY) {
      if (mathY < mathYMin || !shouldDraw(mathY)) continue;
      const pixelY = this.transformer.toPixelY(mathY);
      this.renderingContext.beginPath();
      this.renderingContext.moveTo(pixelLeft, pixelY);
      this.renderingContext.lineTo(pixelRight, pixelY);
      this.renderingContext.stroke();
    }
    for (let mathY = -spacingY; mathY >= mathYMin - spacingY * 0.01;
      mathY -= spacingY) {
      if (mathY > mathYMax || !shouldDraw(mathY)) continue;
      const pixelY = this.transformer.toPixelY(mathY);
      this.renderingContext.beginPath();
      this.renderingContext.moveTo(pixelLeft, pixelY);
      this.renderingContext.lineTo(pixelRight, pixelY);
      this.renderingContext.stroke();
    }
  }
}
