/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file cannon-drawer.ts
 * @description
 *   Dibuja el cañón en el origen del sistema de coordenadas.
 *
 *   El cañón se representa como un rectángulo orientado según el ángulo
 *   de lanzamiento, con un cuerpo circular en la base.
 *
 *   Responsabilidades (SRP):
 *    - Transformar las coordenadas del origen (metros → píxeles).
 *    - Aplicar la rotación del ángulo de lanzamiento.
 *    - Dibujar el cuerpo y el cañón con el color asignado.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CoordinateTransformer } from '../util/coordinate-transformer.js';

/**
 * @class CannonDrawer
 * @classdesc
 *   Renderiza el cañón en el punto de lanzamiento con el ángulo y
 *   el color del lanzamiento activo.
 *
 * @example
 * ```typescript
 * const cannon = new CannonDrawer(context, transformer);
 * cannon.draw(0, 45, 'steelblue');
 * ```
 */
export class CannonDrawer {

  /** Radio en píxeles del cuerpo circular del cañón. */
  private static readonly CANNON_BODY_RADIUS_PX = 8;

  /** Longitud en píxeles del tubo del cañón. */
  private static readonly CANNON_BARREL_LENGTH_PX = 24;

  /** Anchura en píxeles del tubo del cañón. */
  private static readonly CANNON_BARREL_WIDTH_PX = 6;
  /**
   * @param context     - Contexto 2D del canvas.
   * @param transformer - Conversor metros → píxeles.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly transformer: CoordinateTransformer,
  ) { }

  /**
   * @method draw
   * @description
   *   Dibuja el cañón en la posición (0, initialHeight) con el ángulo
   *   y el color del lanzamiento activo.
   *
   * @param initialHeightMeters - Altura inicial del lanzamiento en metros.
   * @param angleDegrees        - Ángulo de lanzamiento en grados (0–89).
   * @param color               - Color CSS del lanzamiento.
   */
  draw(
    initialHeightMeters: number,
    angleDegrees: number,
    color: string,
  ): void {
    const { x: originX, y: originY } =
      this.transformer.toPixel(0, initialHeightMeters);

    const angleRad = (angleDegrees * Math.PI) / 180;
    // En canvas Y es invertido, por eso el ángulo es negativo
    const canvasAngleRad = -angleRad;

    this.context.save();
    this.context.translate(originX, originY);

    this.drawCannonBody(color);
    this.drawCannonBarrel(canvasAngleRad, color);

    this.context.restore();
  }

  // -------------------------------------------------------------------------
  // Privados
  // -------------------------------------------------------------------------

  /**
   * Dibuja el cuerpo circular del cañón.
   * @param color - Color de relleno.
   */
  private drawCannonBody(color: string): void {
    this.context.beginPath();
    this.context.arc(
      0,
      0,
      CannonDrawer.CANNON_BODY_RADIUS_PX,
      0,
      2 * Math.PI,
    );
    this.context.fillStyle = color;
    this.context.fill();
    this.context.strokeStyle = 'darkslategray';
    this.context.lineWidth = 1;
    this.context.stroke();
  }

  /**
   * Dibuja el tubo rectangular del cañón orientado según el ángulo.
   * @param canvasAngleRad - Ángulo en radianes (ajustado para canvas).
   * @param color          - Color de relleno.
   */
  private drawCannonBarrel(
    canvasAngleRad: number,
    color: string,
  ): void {
    this.context.save();
    this.context.rotate(canvasAngleRad);
    this.context.fillStyle = color;
    this.context.strokeStyle = 'darkslategray';
    this.context.lineWidth = 1;
    this.context.fillRect(
      0,
      -CannonDrawer.CANNON_BARREL_WIDTH_PX / 2,
      CannonDrawer.CANNON_BARREL_LENGTH_PX,
      CannonDrawer.CANNON_BARREL_WIDTH_PX,
    );
    this.context.strokeRect(
      0,
      -CannonDrawer.CANNON_BARREL_WIDTH_PX / 2,
      CannonDrawer.CANNON_BARREL_LENGTH_PX,
      CannonDrawer.CANNON_BARREL_WIDTH_PX,
    );
    this.context.restore();
  }
}
