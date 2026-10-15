/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file circle-renderer.ts
 * @description
 *   Renderizador de circunferencias en coordenadas de mundo.
 *   Encapsula la lógica de conversión de radio y posición.
 *
 *   SRP: única responsabilidad es dibujar círculos.
 *   OCP: se puede extender con nuevos estilos sin modificar la clase.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CartesianRenderer } from './cartesian-renderer.js';

/**
 * @interface CircleStyle
 * @description Estilo visual de una circunferencia.
 */
export interface CircleStyle {
  /** Color CSS del trazo. */
  readonly strokeColor: string;
  /** Grosor del trazo en píxeles. */
  readonly lineWidthPx: number;
  /** Si es true, se rellena el círculo con fillColor. */
  readonly isFilled: boolean;
  /** Color CSS de relleno (solo si isFilled es true). */
  readonly fillColor?: string;
}

/**
 * @class CircleRenderer
 * @classdesc
 *   Dibuja circunferencias en el canvas usando coordenadas de mundo.
 *   Utiliza CartesianRenderer para la conversión mundo→canvas.
 *
 * @example
 * ```typescript
 * const circleRenderer = new CircleRenderer(context, cartesianRenderer);
 * circleRenderer.draw(0, 0, 2, { strokeColor: 'black', lineWidthPx: 1.5, isFilled: false });
 * ```
 */
export class CircleRenderer {
  /**
   * @constructor
   * @param context           - Contexto 2D del canvas.
   * @param cartesianRenderer - Renderizador del plano cartesiano.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly cartesianRenderer: CartesianRenderer,
  ) { }

  // ---------------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------------

  /**
   * @method draw
   * @description Dibuja una circunferencia en coordenadas de mundo.
   *
   * @param centerWorldX   - Centro X en coordenadas de mundo.
   * @param centerWorldY   - Centro Y en coordenadas de mundo.
   * @param radiusWorld    - Radio en unidades de mundo.
   * @param style          - Estilo visual de la circunferencia.
   * @param canvasWidth    - Ancho del canvas en píxeles.
   * @param canvasHeight   - Alto del canvas en píxeles.
   */
  draw(
    centerWorldX: number,
    centerWorldY: number,
    radiusWorld: number,
    style: CircleStyle,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const { pixelX, pixelY } = this.cartesianRenderer.worldToCanvas(
      centerWorldX,
      centerWorldY,
      canvasWidth,
      canvasHeight,
    );
    const radiusInPixels = this.worldLengthToPixels(radiusWorld, canvasWidth, canvasHeight);

    this.context.save();

    if (style.isFilled && style.fillColor) {
      this.context.fillStyle = style.fillColor;
      this.context.beginPath();
      this.context.arc(pixelX, pixelY, radiusInPixels, 0, 2 * Math.PI);
      this.context.fill();
    }

    this.context.strokeStyle = style.strokeColor;
    this.context.lineWidth = style.lineWidthPx;
    this.context.beginPath();
    this.context.arc(pixelX, pixelY, radiusInPixels, 0, 2 * Math.PI);
    this.context.stroke();

    this.context.restore();
  }

  // ---------------------------------------------------------------------------
  // Privados
  // ---------------------------------------------------------------------------

  /**
   * Convierte una longitud en unidades de mundo a píxeles.
   *
   * @param worldLength   - Longitud en unidades de mundo.
   * @param canvasWidth   - Ancho del canvas en píxeles.
   * @param canvasHeight  - Alto del canvas en píxeles.
   * @returns Longitud equivalente en píxeles.
   */
  private worldLengthToPixels(
    worldLength: number,
    canvasWidth: number,
    canvasHeight: number,
  ): number {
    const originPixel = this.cartesianRenderer.worldToCanvas(0, 0, canvasWidth, canvasHeight);
    const worldLengthPixel = this.cartesianRenderer.worldToCanvas(
      worldLength,
      0,
      canvasWidth,
      canvasHeight,
    );
    return Math.abs(worldLengthPixel.pixelX - originPixel.pixelX);
  }
}