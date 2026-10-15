/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author F. de Sande
 * @since March 27, 2026
 * @description Encapsulates the state and behavior of a bouncing ball
 */

export type Point2D = { x: number; y: number };

/**
 * @classdesc Encapsulates the state and behavior of a bouncing ball.
 */
export class Ball {
  /**
   * @param initialPosition initial position in CSS pixels
   * @param initialVelocity velocity in pixels per second
   * @param radius in CSS pixels
   * @param fill color for the ball
   */
  constructor(
    private position: Point2D,
    private velocity: Point2D,
    private readonly radius: number,
    private readonly color: string) {}

  /**
   * Update the ball position and handle bouncing inside the given bounds.
   * Coordinates and bounds are expressed in CSS pixels.
   * @param deltaSec elapsed time in seconds
   * @param boundsWidth width of the area in CSS pixels
   * @param boundsHeight height of the area in CSS pixels
   */
  update(deltaSec: number, boundsWidth: number, boundsHeight: number): void {
    this.position.x += this.velocity.x * deltaSec;
    this.position.y += this.velocity.y * deltaSec;
    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius;
      this.velocity.x = -1 * this.velocity.x;
    } else if (this.position.x + this.radius > boundsWidth) {
      this.position.x = boundsWidth - this.radius;
      this.velocity.x = -1 * this.velocity.x;
    }
    if (this.position.y - this.radius < 0) {
      this.position.y = this.radius;
      this.velocity.y = -1 * this.velocity.y;
    } else if (this.position.y + this.radius > boundsHeight) {
      this.position.y = boundsHeight - this.radius;
      this.velocity.y = -1 * this.velocity.y;
    }
  }

  /**
   * Draw the ball on the provided 2D rendering context.
   * The context is expected to be already scaled so that drawing coordinates are CSS pixels.
   * @param context CanvasRenderingContext2D
   */
  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  /**
   * Ensure the ball remains inside the given bounds (used after resize).
   * @param boundsWidth width of the area in CSS pixels
   * @param boundsHeight height of the area in CSS pixels
   */
  clampToBounds(boundsWidth: number, boundsHeight: number): void {
    this.position.x = Math.min(Math.max(this.position.x, this.radius), boundsWidth - this.radius);
    this.position.y = Math.min(Math.max(this.position.y, this.radius), boundsHeight - this.radius);
  }
}
