/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis-y.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Eje vertical del sistema de coordenadas cartesianas.
 *
 *   El espacio reservado para la flecha (ARROW_RESERVE_PX) separa
 *   el último tick/etiqueta (mathYMax → toPixelY) del borde superior
 *   del canvas donde se dibuja la punta. Sin este margen las etiquetas
 *   del extremo quedan cortadas al borde del canvas.
 *
 *   formatLabel() usa notación compacta: k, M, G para valores
 *   ≥ 1 000, ≥ 1 000 000, ≥ 1 000 000 000.
 */

import {Axis} from './axis';
import {CoordinateTransformer} from
  '../../util/coordinate-transformer';
import {CoordinateConfig} from
  '../../interfaces/coordinate-config';
import {TickCalculator} from '../../util/tick-calculator';

/** Umbrales para notación compacta. */
const COMPACT_GIGA = 1_000_000_000;
const COMPACT_MEGA = 1_000_000;
const COMPACT_KILO = 1_000;

/**
 * @extends Axis
 */
export class AxisY extends Axis {
  /**
   * @param renderingContext - Contexto 2D del canvas.
   * @param transformer      - Conversor coordenadas matemáticas → píxeles.
   * @param config           - Configuración visual de los ejes.
   */
  constructor(
      renderingContext: CanvasRenderingContext2D,
      transformer: CoordinateTransformer,
      config: CoordinateConfig,
  ) {
    super(renderingContext, transformer, config);
  }

  /** @override */
  protected drawAxisLine(): void {
    const originPixelX = this.transformer.getOriginPixelX();
    const originPixelY = this.transformer.getOriginPixelY();

    this.renderingContext.strokeStyle = this.config.axisColor;
    this.renderingContext.lineWidth = 2;
    this.renderingContext.beginPath();
    this.renderingContext.moveTo(originPixelX, originPixelY);
    this.renderingContext.lineTo(originPixelX, 0);
    this.renderingContext.stroke();
  }

  /** @override */
  protected drawTicks(): void {
    const {mathYMin, mathYMax} = this.transformer.getDomain();
    const yRange = mathYMax - mathYMin;
    const majorSpacing = TickCalculator.compute(yRange);
    const minorSpacing = majorSpacing / this.config.minorSubdivisions;
    const originPixelX = this.transformer.getOriginPixelX();

    this.renderingContext.strokeStyle = this.config.axisColor;
    this.renderingContext.lineWidth = 1;

    for (let mathY = 0; mathY <= mathYMax + minorSpacing * 0.01;
      mathY += minorSpacing) {
      if (mathY < mathYMin) continue;
      const halfSize = this.isMajorTick(mathY, majorSpacing, minorSpacing) ?
        this.config.majorTickSizePx :
        this.config.minorTickSizePx;
      this.drawTick(
          this.transformer.toPixelY(mathY), originPixelX, false, halfSize,
      );
    }

    for (let mathY = -minorSpacing; mathY >= mathYMin - minorSpacing * 0.01;
      mathY -= minorSpacing) {
      if (mathY > mathYMax) continue;
      const halfSize = this.isMajorTick(mathY, majorSpacing, minorSpacing) ?
        this.config.majorTickSizePx :
        this.config.minorTickSizePx;
      this.drawTick(
          this.transformer.toPixelY(mathY), originPixelX, false, halfSize,
      );
    }

    const lastMinorY =
      Math.round(mathYMax / minorSpacing) * minorSpacing;
    if (Math.abs(lastMinorY - mathYMax) > minorSpacing * 0.01) {
      this.drawTick(
          this.transformer.toPixelY(mathYMax),
          originPixelX,
          false,
          this.config.majorTickSizePx,
      );
    }
  }

  /** @override */
  protected drawLabels(): void {
    const {mathYMin, mathYMax} = this.transformer.getDomain();
    const yRange = mathYMax - mathYMin;
    const majorSpacing = TickCalculator.compute(yRange);
    const originPixelX = this.transformer.getOriginPixelX();
    const labelX = originPixelX - this.config.labelOffsetPx;

    this.renderingContext.fillStyle = this.config.labelColor;
    this.renderingContext.font = this.config.font;
    this.renderingContext.textAlign = 'right';
    this.renderingContext.textBaseline = 'middle';

    for (let mathY = 0; mathY <= mathYMax + majorSpacing * 0.01;
      mathY += majorSpacing) {
      if (mathY < mathYMin) continue;
      this.renderingContext.fillText(
          this.formatLabel(mathY),
          labelX,
          this.transformer.toPixelY(mathY),
      );
    }

    for (let mathY = -majorSpacing; mathY >= mathYMin - majorSpacing * 0.01;
      mathY -= majorSpacing) {
      if (mathY > mathYMax) continue;
      this.renderingContext.fillText(
          this.formatLabel(mathY),
          labelX,
          this.transformer.toPixelY(mathY),
      );
    }

    const lastMajorY =
      Math.round(mathYMax / majorSpacing) * majorSpacing;
    if (Math.abs(lastMajorY - mathYMax) > majorSpacing * 0.01) {
      this.renderingContext.fillText(
          this.formatLabel(mathYMax),
          labelX,
          this.transformer.toPixelY(mathYMax),
      );
    }
  }

  /** @override */
  protected drawArrow(): void {
    this.drawArrowHead(
        this.transformer.getOriginPixelX(),
        0,
        -Math.PI / 2,
    );
  }

  /**
   * Formatea un valor numérico para la etiqueta del eje.
   * Usa notación compacta (k, M, G) para valores cuyo valor absoluto
   * supera los umbrales correspondientes.
   * @param value - Valor matemático a formatear.
   * @returns Cadena de texto compacta para mostrar en el eje.
   */
  private formatLabel(value: number): string {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= COMPACT_GIGA) {
      return sign + this.compactNumber(absValue / COMPACT_GIGA) + 'G';
    }
    if (absValue >= COMPACT_MEGA) {
      return sign + this.compactNumber(absValue / COMPACT_MEGA) + 'M';
    }
    if (absValue >= COMPACT_KILO) {
      return sign + this.compactNumber(absValue / COMPACT_KILO) + 'k';
    }

    const rounded = +value.toFixed(10);
    return Number.isInteger(rounded) ?
      String(rounded) :
      String(+rounded.toFixed(1));
  }

  /**
   * Formatea un número ya escalado mostrando un decimal solo si es necesario.
   * @param value - Valor ya escalado.
   * @returns Cadena sin ceros decimales innecesarios.
   */
  private compactNumber(value: number): string {
    return Number.isInteger(value) ?
      String(value) :
      String(+value.toFixed(1));
  }
}
