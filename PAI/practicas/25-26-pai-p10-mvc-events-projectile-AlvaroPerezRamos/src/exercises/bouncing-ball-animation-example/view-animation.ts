/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author F. de Sande
 * @since March 27, 2026
 * @description ViewAnimation class
 *              Manages the canvas, HiDPI scaling, resize handling and the animation loop.
 *              Delegates ball behavior to the Ball class.
 */

import { Ball, Point2D } from './ball.js';

/** @classdesc Animates a bouncing ball on a canvas. */
export class ViewAnimation {
  private readonly canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
  private readonly renderingContext: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  private readonly backgroundColor: string;
  private readonly ball: Ball;
  private previousTimestamp: number | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;

  /**
   * @description Creates a ViewAnimation instance and appends the canvas to the document body.
   * The initial canvas CSS size is derived from the element layout; a fallback is used if layout is not ready.
   */
  constructor() {
    // Initial internal bitmap size (will be adjusted by resizeCanvas)
    this.canvas.width = 1200;
    this.canvas.height = 600;
    this.canvas.classList.add('canvas-wrapper');
    this.backgroundColor = 'burlywood';
    const initialPosition: Point2D = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    const initialVelocity: Point2D = { x: 200 * 0.7, y: 200 * 0.5 }; // px/s
    const radiusPx = 24;
    const ballColor = 'blue';
    this.ball = new Ball(initialPosition, initialVelocity, radiusPx, ballColor);
    document.body.appendChild(this.canvas);

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * @description Resize the internal bitmap to match the element's CSS size and devicePixelRatio.
   * Also scales the rendering context so drawing coordinates are CSS pixels.
   */
  private resizeCanvas(): void {
    const deviePixelRatio = window.devicePixelRatio || 1;
    const rectangle = this.canvas.getBoundingClientRect();
    const cssWidth = rectangle.width || this.canvas.width / deviePixelRatio;
    const cssHeight = rectangle.height || this.canvas.height / deviePixelRatio;
    this.canvas.width = Math.round(cssWidth * deviePixelRatio);
    this.canvas.height = Math.round(cssHeight * deviePixelRatio);
    this.ball.clampToBounds(cssWidth, cssHeight);
  }

  /**
   * @description Clear the canvas using the configured background color.
   */
  private clearCanvas(): void {
    const rectangle = this.canvas.getBoundingClientRect();
    this.renderingContext.fillStyle = this.backgroundColor;
    this.renderingContext.fillRect(0, 0, rectangle.width, rectangle.height);
  }

  /**
   * @description Animation loop callback invoked by requestAnimationFrame.
   * Uses an arrow function to preserve `this` when passed as a callback.
   * @param timestamp high-resolution timestamp provided by the browser
   */
  private animationLoop = (timestamp: number): void => {
    if (!this.isRunning) return;
    if (this.previousTimestamp == null) this.previousTimestamp = timestamp; // First frame
    const deltaMs = timestamp - this.previousTimestamp;  // Time from previous frame
    this.previousTimestamp = timestamp;
    const deltaSec = Math.min(deltaMs / 1000, 0.05);  // Clamp delta to avoid very large steps after tab inactivity
    const rectangle = this.canvas.getBoundingClientRect();
    const width = rectangle.width;
    const height = rectangle.height;
    this.ball.update(deltaSec, width, height);
    this.clearCanvas();
    this.ball.draw(this.renderingContext);
    this.animationFrameId = requestAnimationFrame(this.animationLoop);
  };

  /**
   * @description Start the animation. If it is not already running
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.previousTimestamp = null;
    this.animationFrameId = requestAnimationFrame(this.animationLoop);
  }

  /**
   * @description Stop the animation. If it is not running, does nothing.
   */
  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
