/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis-y.ts
 * @description
 *   Eje vertical del sistema de coordenadas cartesianas.
 *
 *   Implementa los cuatro pasos abstractos de {@link Axis}:
 *   - Línea vertical desde el origen hasta el borde superior.
 *   - Ticks mayores y menores sobre el eje Y.
 *   - Etiquetas numéricas a la izquierda de los ticks mayores.
 *   - Flecha apuntando hacia arriba (+Y matemático).
 *
 *   El origen matemático (0, 0) está en la esquina inferior izquierda
 *   del área dibujable. El eje crece hacia arriba (Y invertido en canvas).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CompactNumberFormatter } from '../../util/compact-number-formatter.js';
import { CoordinateTransformer } from '../../util/coordinate-transformer.js';
import { Axis, AxisConfig } from './axis.js';

/**
 * @class AxisY
 * @extends Axis
 * @classdesc Eje vertical del sistema de coordenadas cartesianas.
 */
export class AxisY extends Axis {
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
    const { marginTop } = this.transformer.getConfig();
    const originPixelX = this.transformer.getOriginPixelX();
    const originPixelY = this.transformer.getOriginPixelY();

    this.context.strokeStyle = this.config.axisColor;
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(originPixelX, originPixelY);
    this.context.lineTo(originPixelX, marginTop);
    this.context.stroke();
  }

  /** @override */
  protected drawTicks(): void {
    const maxY = this.transformer.getVisibleMaxY();
    const minorSpacing =
      this.config.tickSpacingMeters / this.config.minorTicksPerMajor;

    this.context.strokeStyle = this.config.axisColor;
    this.context.lineWidth = 1;

    for (
      let meters = minorSpacing;
      meters <= maxY;
      meters += minorSpacing
    ) {
      const halfSize = this.isMajorTick(meters, minorSpacing)
        ? this.config.majorTickSizePx
        : this.config.minorTickSizePx;
      const pixelY = this.transformer.toPixel(0, meters).y;
      this.drawTick(
        pixelY,
        this.transformer.getOriginPixelX(),
        false,
        halfSize,
      );
    }
  }

  /** @override */
  protected drawLabels(): void {
    const maxY   = this.transformer.getVisibleMaxY();
    const { marginTop } = this.transformer.getConfig();
    const labelX =
      this.transformer.getOriginPixelX() - this.config.labelOffsetPx;

    this.context.fillStyle = this.config.labelColor;
    this.context.font = this.config.font;
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';

    for (
      let meters = this.config.tickSpacingMeters;
      meters < maxY;
      meters += this.config.tickSpacingMeters
    ) {
      const pixelY = this.transformer.toPixel(0, meters).y;
      this.context.fillText(
        CompactNumberFormatter.format(meters),
        labelX,
        pixelY,
      );
    }

    // Etiqueta del eje rotada 90° para leer de abajo a arriba
    this.context.save();
    this.context.translate(
      labelX - this.config.labelOffsetPx,
      marginTop + 20,
    );
    this.context.rotate(-Math.PI / 2);
    this.context.textAlign = 'center';
    this.context.textBaseline = 'bottom';
    this.context.fillText('y (m)', 0, 0);
    this.context.restore();
  }

  /** @override */
  protected drawArrow(): void {
    const { marginTop } = this.transformer.getConfig();
    // -π/2 → apunta hacia arriba en canvas (Y decrece hacia arriba)
    this.drawArrowHead(
      this.transformer.getOriginPixelX(),
      marginTop,
      -Math.PI / 2,
    );
  }
}