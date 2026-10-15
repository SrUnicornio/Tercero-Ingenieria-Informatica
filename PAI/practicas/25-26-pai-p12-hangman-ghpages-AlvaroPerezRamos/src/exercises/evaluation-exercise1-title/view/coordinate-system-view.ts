/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file compute-pi-view.ts
 * @description Modelo que gestiona los datos de la simulación Monte Carlo.
 * @author Álvaro Pérez Ramos <alu0101564393@ull.edu.es>
 * @since April 2026
 */

import {CoordinateSystemConfig, ColorScheme} from '../interfaces/types.js';

export class CoordinateSystemView {
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly config: CoordinateSystemConfig,
    private readonly colors: ColorScheme,
  ) { }

  /** Dibuja rejilla y ejes. */
  public draw(canvasSize: number): void {
    this.drawGrid(canvasSize);
    this.drawAxes(canvasSize);
  }

  public toPixelX(mathX: number, canvasSize: number): number {
    const range = this.config.axisMax - this.config.axisMin;
    const drawable = canvasSize - 2 * this.config.axisLabelMarginPx;
    return this.config.axisLabelMarginPx +
      ((mathX - this.config.axisMin) / range) * drawable;
  }

  public toPixelY(mathY: number, canvasSize: number): number {
    const range = this.config.axisMax - this.config.axisMin;
    const drawable = canvasSize - 2 * this.config.axisLabelMarginPx;
    return this.config.axisLabelMarginPx +
      ((-mathY - this.config.axisMin) / range) * drawable;
  }

  private drawGrid(size: number): void {
    this.context.strokeStyle = this.colors.gridLineColor;
    this.context.lineWidth = 0.5;
    for (let i = this.config.axisMin; i <= this.config.axisMax; i++) {
      const x = this.toPixelX(i, size);
      const y = this.toPixelY(i, size);
      this.context.beginPath();
      this.context.moveTo(x, this.toPixelY(this.config.axisMax, size));
      this.context.lineTo(x, this.toPixelY(this.config.axisMin, size));
      this.context.stroke();
      this.context.beginPath();
      this.context.moveTo(this.toPixelX(this.config.axisMin, size), y);
      this.context.lineTo(this.toPixelX(this.config.axisMax, size), y);
      this.context.stroke();
    }
  }

  private drawAxes(size: number): void {
    const originX = this.toPixelX(0, size);
    const originY = this.toPixelY(0, size);
    this.context.strokeStyle = this.colors.axisColor;
    this.context.fillStyle = this.colors.axisColor;
    this.context.lineWidth = 1.5;

    // Ejes
    this.context.beginPath();
    this.context.moveTo(this.toPixelX(this.config.axisMin, size), originY);
    this.context.lineTo(this.toPixelX(this.config.axisMax, size), originY);
    this.context.moveTo(originX, this.toPixelY(this.config.axisMin, size));
    this.context.lineTo(originX, this.toPixelY(this.config.axisMax, size));
    this.context.stroke();

    // Números
    this.context.font = '12px Arial';
    for (let i = this.config.axisMin; i <= this.config.axisMax; i++) {
      if (i === 0) continue;
      this.context.fillText(i.toString(),
          this.toPixelX(i, size) - 5, originY + 20);
      this.context.fillText(i.toString(),
          originX - 20, this.toPixelY(i, size) + 5);
    }
  }
}
