/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis-x.ts
 * @description
 *   Eje horizontal del sistema de coordenadas cartesianas.
 *
 *   Implementa los cuatro pasos abstractos de {@link Axis}:
 *   - Línea horizontal desde el origen hasta el borde derecho.
 *   - Ticks mayores y menores sobre el eje X.
 *   - Etiquetas numéricas debajo de los ticks mayores.
 *   - Flecha apuntando a la derecha (+X).
 *
 *   El origen matemático (0, 0) está en la esquina inferior izquierda
 *   del área dibujable. El eje crece hacia la derecha.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CompactNumberFormatter } from '../../util/compact-number-formatter.js';
import { CoordinateTransformer } from '../../util/coordinate-transformer.js';
import { Axis, AxisConfig } from './axis.js';

/**
 * @class AxisX
 * @extends Axis
 * @classdesc Eje horizontal del sistema de coordenadas cartesianas.
 */
export class AxisX extends Axis {
  /**
   * @param context     - Contexto 2D del canvas.
   * @param transformer - Conversor metros → píxeles.
   * @param config      - Configuración visual y de escala.
   */
  constructor(
    context: CanvasRenderingContext2D,
    transformer: CoordinateTransformer,
    config: AxisConfig,
  ) {
    super(context, transformer, config);
  }

  /** @override */
  protected drawAxisLine(): void {
    const { canvasWidth, marginRight } = this.transformer.getConfig();
    const originPixelX = this.transformer.getOriginPixelX();
    const originPixelY = this.transformer.getOriginPixelY();

    this.context.strokeStyle = this.config.axisColor;
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(originPixelX, originPixelY);
    this.context.lineTo(canvasWidth - marginRight, originPixelY);
    this.context.stroke();
  }

  /** @override */
  protected drawTicks(): void {
    const maxX = this.transformer.getVisibleMaxX();
    const minorSpacing =
      this.config.tickSpacingMeters / this.config.minorTicksPerMajor;

    this.context.strokeStyle = this.config.axisColor;
    this.context.lineWidth = 1;

    for (
      let meters = minorSpacing;
      meters <= maxX;
      meters += minorSpacing
    ) {
      const halfSize = this.isMajorTick(meters, minorSpacing)
        ? this.config.majorTickSizePx
        : this.config.minorTickSizePx;
      const pixelX = this.transformer.toPixel(meters, 0).x;
      this.drawTick(
        pixelX,
        this.transformer.getOriginPixelY(),
        true,
        halfSize,
      );
    }
  }

  /** @override */
  protected drawLabels(): void {
    const maxX   = this.transformer.getVisibleMaxX();
    const { canvasWidth, marginRight } = this.transformer.getConfig();
    const labelY = this.transformer.getOriginPixelY() + this.config.labelOffsetPx;

    this.context.fillStyle = this.config.labelColor;
    this.context.font = this.config.font;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    this.context.fillText(
      '0',
      this.transformer.getOriginPixelX(),
      labelY,
    );

    for (
      let meters = this.config.tickSpacingMeters;
      meters < maxX;
      meters += this.config.tickSpacingMeters
    ) {
      const pixelX = this.transformer.toPixel(meters, 0).x;
      this.context.fillText(CompactNumberFormatter.format(meters), pixelX, labelY);
    }

    this.context.textAlign = 'right';
    this.context.fillText(
      'x (m)',
      canvasWidth - marginRight,
      labelY,
    );
  }

  /** @override */
  protected drawArrow(): void {
    const { canvasWidth, marginRight } = this.transformer.getConfig();
    this.drawArrowHead(
      canvasWidth - marginRight,
      this.transformer.getOriginPixelY(),
      0,
    );
  }
}