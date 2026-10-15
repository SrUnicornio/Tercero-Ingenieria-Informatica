/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Clase base abstracta para los ejes cartesianos.
 */

import {CoordinateTransformer} from
  '../../util/coordinate-transformer';
import {CoordinateConfig} from
  '../../interfaces/coordinate-config';

/** Tamaño de la punta de flecha en píxeles. */
const ARROW_SIZE_PX = 10;

/**
 * @abstract
 * Esqueleto del algoritmo de dibujo de un eje cartesiano.
 * El método público draw() invoca en orden:
 *   1. drawAxisLine()  — línea principal del eje.
 *   2. drawTicks()     — marcas mayor y menor sobre el eje.
 *   3. drawLabels()    — etiquetas numéricas en los ticks mayores.
 *   4. drawArrow()     — flecha en el extremo positivo.
 */
export abstract class Axis {
  /**
   * @param renderingContext - Contexto 2D del canvas.
   * @param transformer      - Conversor coordenadas matemáticas → píxeles.
   * @param config           - Configuración visual de los ejes.
   */
  constructor(
    protected readonly renderingContext: CanvasRenderingContext2D,
    protected readonly transformer: CoordinateTransformer,
    protected readonly config: CoordinateConfig,
  ) { }

  /**
   * Template Method: dibuja el eje completo en cuatro pasos ordenados.
   * No debe sobrescribirse en las subclases.
   */
  draw(): void {
    this.renderingContext.save();
    this.drawAxisLine();
    this.drawTicks();
    this.drawLabels();
    this.drawArrow();
    this.renderingContext.restore();
  }

  protected abstract drawAxisLine(): void;
  protected abstract drawTicks(): void;
  protected abstract drawLabels(): void;
  protected abstract drawArrow(): void;

  /**
   * Traza una marca perpendicular al eje en la posición indicada.
   * Compartido entre AxisX y AxisY para evitar duplicación.
   * @param pixelAlong - Posición a lo largo del eje en píxeles.
   * @param pixelAcross - Posición perpendicular al eje en píxeles.
   * @param isHorizontal - true si el eje es horizontal (AxisX).
   * @param halfSize - Semitamaño del tick en píxeles.
   */
  protected drawTick(
      pixelAlong: number,
      pixelAcross: number,
      isHorizontal: boolean,
      halfSize: number,
  ): void {
    this.renderingContext.beginPath();
    if (isHorizontal) {
      this.renderingContext.moveTo(pixelAlong, pixelAcross - halfSize);
      this.renderingContext.lineTo(pixelAlong, pixelAcross + halfSize);
    } else {
      this.renderingContext.moveTo(pixelAcross - halfSize, pixelAlong);
      this.renderingContext.lineTo(pixelAcross + halfSize, pixelAlong);
    }
    this.renderingContext.stroke();
  }

  /**
   * Dibuja una punta de flecha triangular orientada según angleRad.
   * Convención: angleRad = 0 apunta a la derecha (+X canvas).
   * @param tipX - X de la punta en píxeles.
   * @param tipY - Y de la punta en píxeles.
   * @param angleRad - Ángulo de orientación en radianes.
   */
  protected drawArrowHead(
      tipX: number,
      tipY: number,
      angleRad: number,
  ): void {
    this.renderingContext.save();
    this.renderingContext.fillStyle = this.config.axisColor;
    this.renderingContext.translate(tipX, tipY);
    this.renderingContext.rotate(angleRad);
    this.renderingContext.beginPath();
    this.renderingContext.moveTo(0, 0);
    this.renderingContext.lineTo(-ARROW_SIZE_PX, -ARROW_SIZE_PX / 2);
    this.renderingContext.lineTo(-ARROW_SIZE_PX, ARROW_SIZE_PX / 2);
    this.renderingContext.closePath();
    this.renderingContext.fill();
    this.renderingContext.restore();
  }

  /**
   * Determina si un valor matemático es múltiplo del paso mayor,
   * usando tolerancia flotante para evitar errores de precisión.
   * @param mathValue - Valor a evaluar en unidades matemáticas.
   * @param majorSpacing - Paso mayor en unidades matemáticas.
   * @param minorSpacing - Paso menor (usado para calcular la tolerancia).
   * @returns true si el valor es múltiplo de majorSpacing.
   */
  protected isMajorTick(
      mathValue: number,
      majorSpacing: number,
      minorSpacing: number,
  ): boolean {
    const FLOAT_TOLERANCE = 0.01;
    const remainder = Math.abs(mathValue % majorSpacing);
    return remainder < minorSpacing * FLOAT_TOLERANCE ||
      Math.abs(remainder - majorSpacing) < minorSpacing * FLOAT_TOLERANCE;
  }
}
