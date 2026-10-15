/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis-x.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Eje horizontal del sistema de coordenadas cartesianas.
 *
 *   El espacio reservado para la flecha (ARROW_RESERVE_PX) separa
 *   el último tick/etiqueta (mathEnd → toPixelX) del extremo del
 *   canvas donde se dibuja la punta. Sin este margen las etiquetas
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
export class AxisX extends Axis {
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
    const {canvasWidth} = this.transformer.getLayout();
    const originPixelY = this.transformer.getOriginPixelY();
    const originPixelX = this.transformer.getOriginPixelX();

    this.renderingContext.strokeStyle = this.config.axisColor;
    this.renderingContext.lineWidth = 2;
    this.renderingContext.beginPath();
    this.renderingContext.moveTo(originPixelX, originPixelY);
    this.renderingContext.lineTo(
        canvasWidth, originPixelY,
    );
    this.renderingContext.stroke();
  }

  /** @override */
  protected drawTicks(): void {
    const {mathStart, mathEnd} = this.transformer.getDomain();
    const xRange = mathEnd - mathStart;
    const majorSpacing = TickCalculator.compute(xRange);
    const minorSpacing = majorSpacing / this.config.minorSubdivisions;
    const originPixelY = this.transformer.getOriginPixelY();

    this.renderingContext.strokeStyle = this.config.axisColor;
    this.renderingContext.lineWidth = 1;

    for (let mathX = 0; mathX <= mathEnd + minorSpacing * 0.01;
      mathX += minorSpacing) {
      if (mathX < mathStart) continue;
      const halfSize = this.isMajorTick(mathX, majorSpacing, minorSpacing) ?
        this.config.majorTickSizePx :
        this.config.minorTickSizePx;
      this.drawTick(
          this.transformer.toPixelX(mathX), originPixelY, true, halfSize,
      );
    }

    for (let mathX = -minorSpacing; mathX >= mathStart - minorSpacing * 0.01;
      mathX -= minorSpacing) {
      if (mathX > mathEnd) continue;
      const halfSize = this.isMajorTick(mathX, majorSpacing, minorSpacing) ?
        this.config.majorTickSizePx :
        this.config.minorTickSizePx;
      this.drawTick(
          this.transformer.toPixelX(mathX), originPixelY, true, halfSize,
      );
    }

    const lastMinorX =
      Math.round(mathEnd / minorSpacing) * minorSpacing;
    if (Math.abs(lastMinorX - mathEnd) > minorSpacing * 0.01) {
      this.drawTick(
          this.transformer.toPixelX(mathEnd),
          originPixelY,
          true,
          this.config.majorTickSizePx,
      );
    }
  }

  /** @override */
  protected drawLabels(): void {
    const {mathStart, mathEnd} = this.transformer.getDomain();
    const xRange = mathEnd - mathStart;
    const majorSpacing = TickCalculator.compute(xRange);
    const originPixelY = this.transformer.getOriginPixelY();
    const labelY = originPixelY + this.config.labelOffsetPx;

    this.renderingContext.fillStyle = this.config.labelColor;
    this.renderingContext.font = this.config.font;
    this.renderingContext.textAlign = 'center';
    this.renderingContext.textBaseline = 'top';

    for (let mathX = 0; mathX <= mathEnd + majorSpacing * 0.01;
      mathX += majorSpacing) {
      if (mathX < mathStart) continue;
      this.renderingContext.fillText(
          this.formatLabel(mathX),
          this.transformer.toPixelX(mathX),
          labelY,
      );
    }

    for (let mathX = -majorSpacing; mathX >= mathStart - majorSpacing * 0.01;
      mathX -= majorSpacing) {
      if (mathX > mathEnd) continue;
      this.renderingContext.fillText(
          this.formatLabel(mathX),
          this.transformer.toPixelX(mathX),
          labelY,
      );
    }

    const lastMajorX =
      Math.round(mathEnd / majorSpacing) * majorSpacing;
    if (Math.abs(lastMajorX - mathEnd) > majorSpacing * 0.01) {
      this.renderingContext.fillText(
          this.formatLabel(mathEnd),
          this.transformer.toPixelX(mathEnd),
          labelY,
      );
    }
  }

  /** @override */
  protected drawArrow(): void {
    const {canvasWidth} = this.transformer.getLayout();
    this.drawArrowHead(
        canvasWidth,
        this.transformer.getOriginPixelY(),
        0,
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
   *  Formatea un número ya escalado mostrando un decimal
   *   solo si es necesario.
   * @param value - Valor ya escalado.
   * @returns Cadena sin ceros decimales innecesarios.
   */
  private compactNumber(value: number): string {
    return Number.isInteger(value) ?
      String(value) :
      String(+value.toFixed(1));
  }
}
