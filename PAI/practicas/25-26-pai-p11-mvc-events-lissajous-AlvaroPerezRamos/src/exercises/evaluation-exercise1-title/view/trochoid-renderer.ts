/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trochoid-renderer.ts
 * @description
 *   Renderizador de los elementos dinámicos de la Trochoid:
 *     - Circunferencia rodante negra (radio rollingCircleRadius) centrada en (0,0).
 *     - Segmento rojo desde el centro de la circunferencia hasta el punto trazador.
 *     - Punto trazador rojo (extremo del segmento de longitud tracingPointDistance).
 *     - Circunferencia concéntrica roja de radio tracingPointDistance.
 *
 *   SRP: solo dibuja los elementos propios de la trocoide.
 *   No conoce la cuadrícula ni los ejes cartesianos.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { TrochoidParams } from '../interfaces/trochoid-params.js';
import { CartesianRenderer } from './cartesian-renderer.js';

/**
 * @class TrochoidRenderer
 * @classdesc
 *   Dibuja sobre el canvas los elementos visuales de la Trochoid
 *   utilizando el sistema de coordenadas mundo→canvas que provee
 *   {@link CartesianRenderer}.
 *   El círculo rodante está centrado en el origen (0,0) del plano cartesiano.
 *
 * @example
 * ```typescript
 * const renderer = new TrochoidRenderer(context, cartesianRenderer);
 * renderer.draw(params, canvasWidth, canvasHeight);
 * ```
 */
export class TrochoidRenderer {
  /**
   * @constructor
   * @param context           - Contexto 2D del canvas.
   * @param cartesianRenderer - Referencia al renderizador del plano
   *                            (para la conversión mundo→canvas).
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
   * @description
   *   Dibuja todos los elementos dinámicos de la trocoide según el estado.
   *   El círculo rodante está centrado en (0,0).
   *
   * @param params       - Estado actual del modelo.
   * @param canvasWidth  - Ancho del canvas en píxeles.
   * @param canvasHeight - Alto del canvas en píxeles.
   */
  draw(params: TrochoidParams, canvasWidth: number, canvasHeight: number): void {
    const {
      rollingCircleRadius: radius,
      tracingPointDistance: distance,
      rollingAngle: angle,
      isOuterCircleVisible: showOuterCircle,
    } = params;

    const circleCenterX = 0;
    const circleCenterY = 0;

    const tracerPointX = distance * Math.cos(angle);
    const tracerPointY = distance * Math.sin(angle);

    if (showOuterCircle) {
      this.drawCircle(
        circleCenterX,
        circleCenterY,
        distance,
        'red',
        1.5,
        canvasWidth,
        canvasHeight,
      );
    }

    this.drawCircle(
      circleCenterX,
      circleCenterY,
      radius,
      'black',
      1.5,
      canvasWidth,
      canvasHeight,
    );

    this.drawLineSegment(
      circleCenterX,
      circleCenterY,
      tracerPointX,
      tracerPointY,
      'red',
      2,
      canvasWidth,
      canvasHeight,
    );

    this.drawFilledDot(tracerPointX, tracerPointY, 6, 'red', canvasWidth, canvasHeight);

    this.drawFilledDot(circleCenterX, circleCenterY, 4, 'blue', canvasWidth, canvasHeight);
  }

  // ---------------------------------------------------------------------------
  // Privados — primitivas de dibujo
  // ---------------------------------------------------------------------------

  /**
   * Dibuja una circunferencia en coordenadas de mundo.
   *
   * @param worldX        - Centro X en coordenadas de mundo.
   * @param worldY        - Centro Y en coordenadas de mundo.
   * @param worldRadius   - Radio en unidades de mundo.
   * @param strokeColor   - Color CSS del trazo.
   * @param lineWidthPx   - Grosor del trazo en píxeles.
   * @param canvasWidth   - Ancho del canvas en píxeles.
   * @param canvasHeight  - Alto del canvas en píxeles.
   */
  private drawCircle(
    worldX: number,
    worldY: number,
    worldRadius: number,
    strokeColor: string,
    lineWidthPx: number,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const { pixelX, pixelY } = this.cartesianRenderer.worldToCanvas(
      worldX,
      worldY,
      canvasWidth,
      canvasHeight,
    );
    const radiusInPixels = this.worldLengthToPixels(worldRadius, canvasWidth, canvasHeight);

    this.context.save();
    this.context.strokeStyle = strokeColor;
    this.context.lineWidth = lineWidthPx;
    this.context.beginPath();
    this.context.arc(pixelX, pixelY, radiusInPixels, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.restore();
  }

  /**
   * Dibuja un segmento de línea entre dos puntos en coordenadas de mundo.
   *
   * @param fromWorldX    - Origen X en coordenadas de mundo.
   * @param fromWorldY    - Origen Y en coordenadas de mundo.
   * @param toWorldX      - Destino X en coordenadas de mundo.
   * @param toWorldY      - Destino Y en coordenadas de mundo.
   * @param strokeColor   - Color CSS del trazo.
   * @param lineWidthPx   - Grosor del trazo en píxeles.
   * @param canvasWidth   - Ancho del canvas en píxeles.
   * @param canvasHeight  - Alto del canvas en píxeles.
   */
  private drawLineSegment(
    fromWorldX: number,
    fromWorldY: number,
    toWorldX: number,
    toWorldY: number,
    strokeColor: string,
    lineWidthPx: number,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const fromPixel = this.cartesianRenderer.worldToCanvas(
      fromWorldX,
      fromWorldY,
      canvasWidth,
      canvasHeight,
    );
    const toPixel = this.cartesianRenderer.worldToCanvas(
      toWorldX,
      toWorldY,
      canvasWidth,
      canvasHeight,
    );

    this.context.save();
    this.context.strokeStyle = strokeColor;
    this.context.lineWidth = lineWidthPx;
    this.context.beginPath();
    this.context.moveTo(fromPixel.pixelX, fromPixel.pixelY);
    this.context.lineTo(toPixel.pixelX, toPixel.pixelY);
    this.context.stroke();
    this.context.restore();
  }

  /**
   * Dibuja un punto relleno (círculo) en coordenadas de mundo.
   *
   * @param worldX         - Centro X en coordenadas de mundo.
   * @param worldY         - Centro Y en coordenadas de mundo.
   * @param radiusInPixels - Radio del punto en píxeles.
   * @param fillColor      - Color CSS de relleno.
   * @param canvasWidth    - Ancho del canvas en píxeles.
   * @param canvasHeight   - Alto del canvas en píxeles.
   */
  private drawFilledDot(
    worldX: number,
    worldY: number,
    radiusInPixels: number,
    fillColor: string,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const { pixelX, pixelY } = this.cartesianRenderer.worldToCanvas(
      worldX,
      worldY,
      canvasWidth,
      canvasHeight,
    );

    this.context.save();
    this.context.fillStyle = fillColor;
    this.context.beginPath();
    this.context.arc(pixelX, pixelY, radiusInPixels, 0, 2 * Math.PI);
    this.context.fill();
    this.context.restore();
  }

  /**
   * Convierte una longitud en unidades de mundo a píxeles.
   * Utiliza la escala del eje X como referencia.
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