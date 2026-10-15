/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file grid-renderer.ts
 * @description
 *   Renderizador de la cuadrícula de fondo para Curvas de Lissajous.
 * 
 *   Esto garantiza que:
 *     - Las celdas sean siempre cuadradas (mismo ancho y alto).
 *     - La cuadrícula llene el canvas de borde a borde.
 *     - El resultado visual sea idéntico al del proyecto de tiro parabólico.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import { GridConfig, DEFAULT_GRID_CONFIG } from '../interfaces/grid-config.js';

export { GridConfig };

/**
 * @class GridRenderer
 * @classdesc
 *   Dibuja una cuadrícula con celdas cuadradas que cubre todo el canvas.
 *   SRP: solo dibuja la cuadrícula; no conoce la curva de Lissajous.
 */
export class GridRenderer {
  private readonly config: GridConfig;

  /**
   * @param renderingContext - Contexto 2D del canvas.
   * @param config           - Configuración visual (opcional).
   */
  constructor(
    private readonly renderingContext: CanvasRenderingContext2D,
    config: Partial<GridConfig> = {},
  ) {
    this.config = { ...DEFAULT_GRID_CONFIG, ...config };
  }

  /**
   * Dibuja la cuadrícula completa cubriendo todo el canvas.
   * Las celdas son siempre cuadradas: el paso se basa en el lado menor.
   *
   * @param canvasWidth  - Ancho del canvas en píxeles.
   * @param canvasHeight - Alto del canvas en píxeles.
   */
  draw(canvasWidth: number, canvasHeight: number): void {
    this.drawBackground(canvasWidth, canvasHeight);

    const minSide = Math.min(canvasWidth, canvasHeight);
    const cellSize = minSide / this.config.majorDivisionCount;

    this.drawMinorLines(canvasWidth, canvasHeight, cellSize);
    this.drawMajorLines(canvasWidth, canvasHeight, cellSize);
  }

  // ---------------------------------------------------------------------------
  // Privados
  // ---------------------------------------------------------------------------

  /** Fondo blanco del canvas. */
  private drawBackground(canvasWidth: number, canvasHeight: number): void {
    this.renderingContext.fillStyle = 'white';
    this.renderingContext.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  /**
   * Líneas menores: paso = cellSize / minorSubdivisionCount.
   * Se dibujan de borde a borde del canvas, saltando las posiciones de línea mayor.
   */
  private drawMinorLines(
    canvasWidth: number,
    canvasHeight: number,
    cellSize: number,
  ): void {
    const minorStep = cellSize / this.config.minorSubdivisionCount;

    this.renderingContext.save();
    this.renderingContext.strokeStyle = this.config.minorLineColor;
    this.renderingContext.lineWidth = this.config.minorLineWidth;
    this.renderingContext.beginPath();

    // Verticales
    for (let x = 0; x <= canvasWidth + minorStep; x += minorStep) {
      // Omitir si coincide con una línea mayor (dentro de tolerancia de 0.5px)
      const isMajor = Math.round(x / cellSize) * cellSize;
      if (Math.abs(x - isMajor) < 0.5) continue;
      this.renderingContext.moveTo(x, 0);
      this.renderingContext.lineTo(x, canvasHeight);
    }

    // Horizontales
    for (let y = 0; y <= canvasHeight + minorStep; y += minorStep) {
      const isMajor = Math.round(y / cellSize) * cellSize;
      if (Math.abs(y - isMajor) < 0.5) continue;
      this.renderingContext.moveTo(0, y);
      this.renderingContext.lineTo(canvasWidth, y);
    }

    this.renderingContext.stroke();
    this.renderingContext.restore();
  }

  /**
   * Líneas mayores: paso = cellSize.
   * Se dibujan de borde a borde del canvas.
   */
  private drawMajorLines(
    canvasWidth: number,
    canvasHeight: number,
    cellSize: number,
  ): void {
    this.renderingContext.save();
    this.renderingContext.strokeStyle = this.config.majorLineColor;
    this.renderingContext.lineWidth = this.config.majorLineWidth;
    this.renderingContext.beginPath();

    // Verticales
    for (let x = 0; x <= canvasWidth + cellSize; x += cellSize) {
      this.renderingContext.moveTo(x, 0);
      this.renderingContext.lineTo(x, canvasHeight);
    }

    // Horizontales
    for (let y = 0; y <= canvasHeight + cellSize; y += cellSize) {
      this.renderingContext.moveTo(0, y);
      this.renderingContext.lineTo(canvasWidth, y);
    }

    this.renderingContext.stroke();
    this.renderingContext.restore();
  }
}