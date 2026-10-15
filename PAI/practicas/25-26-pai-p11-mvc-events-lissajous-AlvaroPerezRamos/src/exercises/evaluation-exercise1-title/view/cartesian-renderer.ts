/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file cartesian-renderer.ts
 * @description
 *   Renderizador del plano cartesiano: fondo blanco, cuadrícula,
 *   ejes etiquetados y puntos marcadores.
 *
 *   El rango Y se calcula dinámicamente en cada llamada a draw()
 *   para que el origen quede siempre centrado en el canvas,
 *   independientemente de su tamaño o proporción.
 *
 *   SRP: solo dibuja el plano cartesiano y sus elementos estáticos.
 *   OCP: nuevas configuraciones se pasan mediante Partial<CartesianConfig>.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import {
  CartesianConfig,
  DEFAULT_CARTESIAN_CONFIG,
} from '../interfaces/cartesian-config.js';

/**
 * @interface WorldPoint
 * @description Punto en coordenadas de mundo (unidades matemáticas).
 */
export interface WorldPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * @class CartesianRenderer
 * @classdesc
 *   Dibuja el plano cartesiano (fondo, cuadrícula, ejes, etiquetas y puntos).
 *   El rango Y se recalcula en cada draw() escalando proporcionalmente al
 *   canvas para que el origen (0,0) quede siempre centrado visualmente.
 */
export class CartesianRenderer {
  private readonly baseConfig: CartesianConfig;
  private activeConfig: CartesianConfig;

  /**
   * @constructor
   * @param context - Contexto 2D del canvas.
   * @param config  - Configuración visual parcial.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    config: Partial<CartesianConfig> = {},
  ) {
    this.baseConfig = { ...DEFAULT_CARTESIAN_CONFIG, ...config };
    this.activeConfig = this.baseConfig;
  }

  // ---------------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------------

  /**
   * @method draw
   * @description Dibuja el plano completo recalculando el rango Y.
   */
  draw(canvasWidth: number, canvasHeight: number): void {
    this.activeConfig = this.computeActiveYRange(canvasWidth, canvasHeight);
    this.drawWhiteBackground(canvasWidth, canvasHeight);
    this.drawCoordinateGrid(canvasWidth, canvasHeight);
    this.drawAxesWithArrows(canvasWidth, canvasHeight);
    this.drawNumericLabels(canvasWidth, canvasHeight);
  }

  /**
   * @method drawPoints
   * @description Dibuja círculos marcadores en las coordenadas de mundo dadas.
   */
  drawPoints(
    points: ReadonlyArray<WorldPoint>,
    fillColor: string,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    this.context.save();
    this.context.fillStyle = fillColor;
    for (const point of points) {
      const { pixelX, pixelY } = this.worldToCanvas(point.x, point.y, canvasWidth, canvasHeight);
      this.context.beginPath();
      this.context.arc(pixelX, pixelY, this.baseConfig.pointRadius, 0, 2 * Math.PI);
      this.context.fill();
    }
    this.context.restore();
  }

  /**
   * @method worldToCanvas
   * @description Convierte coordenadas de mundo a píxeles.
   */
  worldToCanvas(
    worldX: number,
    worldY: number,
    canvasWidth: number,
    canvasHeight: number,
  ): { pixelX: number; pixelY: number } {
    const { xMin, xMax, yMin, yMax } = this.activeConfig;
    const pixelX = ((worldX - xMin) / (xMax - xMin)) * canvasWidth;
    const pixelY = canvasHeight - ((worldY - yMin) / (yMax - yMin)) * canvasHeight;
    return { pixelX, pixelY };
  }

  // ---------------------------------------------------------------------------
  // Privados — configuración dinámica
  // ---------------------------------------------------------------------------

  /**
   * Calcula el rango Y real para centrar el origen verticalmente.
   * Mantiene la misma escala que el eje X (cuadrícula cuadrada).
   */
  private computeActiveYRange(canvasWidth: number, canvasHeight: number): CartesianConfig {
    const { xMin, xMax } = this.baseConfig;
    const unitsPerPixel = (xMax - xMin) / canvasWidth;
    const yRange = unitsPerPixel * canvasHeight;
    return {
      ...this.baseConfig,
      yMin: -yRange / 2,
      yMax: yRange / 2,
    };
  }

  // ---------------------------------------------------------------------------
  // Privados — elementos visuales
  // ---------------------------------------------------------------------------

  private drawWhiteBackground(width: number, height: number): void {
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, width, height);
  }

  private drawCoordinateGrid(width: number, height: number): void {
    const { xMin, xMax, yMin, yMax, gridColor, gridLineWidth } = this.activeConfig;
    this.context.save();
    this.context.strokeStyle = gridColor;
    this.context.lineWidth = gridLineWidth;
    this.context.beginPath();

    // Líneas verticales (cada unidad entera)
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const { pixelX } = this.worldToCanvas(x, 0, width, height);
      this.context.moveTo(pixelX, 0);
      this.context.lineTo(pixelX, height);
    }

    // Líneas horizontales (cada unidad entera)
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const { pixelY } = this.worldToCanvas(0, y, width, height);
      this.context.moveTo(0, pixelY);
      this.context.lineTo(width, pixelY);
    }

    this.context.stroke();
    this.context.restore();
  }

  private drawAxesWithArrows(width: number, height: number): void {
    const { xMin, xMax, yMin, yMax, axisColor, axisLineWidth } = this.activeConfig;
    this.context.save();
    this.context.strokeStyle = axisColor;
    this.context.lineWidth = axisLineWidth;

    // Eje X
    const { pixelX: xStart, pixelY: yAxis } = this.worldToCanvas(xMin, 0, width, height);
    const { pixelX: xEnd } = this.worldToCanvas(xMax, 0, width, height);
    this.context.beginPath();
    this.context.moveTo(xStart, yAxis);
    this.context.lineTo(xEnd, yAxis);
    this.context.stroke();
    this.drawArrowhead(xEnd, yAxis, 'right');

    // Eje Y
    const { pixelX: xAxis, pixelY: yTop } = this.worldToCanvas(0, yMax, width, height);
    const { pixelY: yBottom } = this.worldToCanvas(0, yMin, width, height);
    this.context.beginPath();
    this.context.moveTo(xAxis, yTop);
    this.context.lineTo(xAxis, yBottom);
    this.context.stroke();
    this.drawArrowhead(xAxis, yTop, 'up');

    this.context.restore();
  }

  private drawArrowhead(
    tipX: number,
    tipY: number,
    direction: 'right' | 'up',
  ): void {
    const size = 8;
    this.context.save();
    this.context.fillStyle = this.activeConfig.axisColor;
    this.context.beginPath();

    if (direction === 'right') {
      this.context.moveTo(tipX, tipY);
      this.context.lineTo(tipX - size, tipY - size / 2);
      this.context.lineTo(tipX - size, tipY + size / 2);
    } else {
      this.context.moveTo(tipX, tipY);
      this.context.lineTo(tipX - size / 2, tipY + size);
      this.context.lineTo(tipX + size / 2, tipY + size);
    }

    this.context.closePath();
    this.context.fill();
    this.context.restore();
  }

  private drawNumericLabels(width: number, height: number): void {
    const { xMin, xMax, yMin, yMax } = this.activeConfig;
    this.context.save();
    this.context.fillStyle = 'black';
    this.context.font = '11px sans-serif';

    // Etiquetas del eje X
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue;
      const { pixelX, pixelY } = this.worldToCanvas(x, 0, width, height);
      this.context.fillText(String(x), pixelX, pixelY + 3);
    }

    // Etiquetas del eje Y
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y === 0) continue;
      const { pixelX, pixelY } = this.worldToCanvas(0, y, width, height);
      this.context.fillText(String(y), pixelX - 5, pixelY);
    }

    this.context.restore();
  }
}