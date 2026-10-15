/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file axis.ts
 * @description
 *   Clase base abstracta para los ejes cartesianos del sistema de
 *   coordenadas.
 *
 *   Define el algoritmo de dibujo mediante el patrón Template Method:
 *   el método público `draw()` establece el orden de los pasos, y cada
 *   subclase implementa los detalles según su eje (X o Y).
 *
 *   Los helpers `drawTick()`, `drawArrowHead()` e `isMajorTick()` residen
 *   aquí para evitar duplicación entre `AxisX` y `AxisY` (DRY).
 *
 *   Principios aplicados:
 *   - SRP: define el contrato y los helpers compartidos.
 *   - OCP: añadir nuevos ejes no requiere modificar esta clase.
 *   - DRY: geometría del tick y la flecha en un único lugar.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CoordinateTransformer } from '../../util/coordinate-transformer.js';

/**
 * @interface AxisConfig
 * @description
 *   Parámetros visuales y de escala compartidos por ambos ejes y por
 *   el renderizador de cuadrícula.
 *
 *   El único parámetro lógico configurable por el usuario es
 *   `tickSpacingMeters`. El resto son parámetros estéticos.
 */
export interface AxisConfig {
  /**
   * Distancia en metros entre ticks mayores consecutivos.
   * Define también el paso de la cuadrícula mayor.
   * @example 10 → un tick mayor cada 10 m
   */
  tickSpacingMeters: number;
  /**
   * Número de subdivisiones entre dos ticks mayores.
   * Spacing menor = tickSpacingMeters / minorTicksPerMajor.
   * @example 5 → ticks menores cada 2 m si tickSpacingMeters = 10
   */
  minorTicksPerMajor: number;
  /** Color CSS de la línea del eje y los ticks. */
  axisColor: string;
  /** Color CSS de las etiquetas numéricas. */
  labelColor: string;
  /** Semitamaño en píxeles de los ticks mayores. */
  majorTickSizePx: number;
  /** Semitamaño en píxeles de los ticks menores. */
  minorTickSizePx: number;
  /** Fuente CSS para las etiquetas. */
  font: string;
  /** Separación en píxeles entre el eje y la etiqueta numérica. */
  labelOffsetPx: number;
}

/**
 * @constant DEFAULT_AXIS_CONFIG
 * @description
 *   Configuración por defecto de los ejes.
 *   El espaciado de ticks se recalcula dinámicamente; este valor
 *   se usa como punto de partida.
 */
export const DEFAULT_AXIS_CONFIG: AxisConfig = {
  tickSpacingMeters: 10,
  minorTicksPerMajor: 5,
  axisColor: 'black',
  labelColor: 'darkslategray',
  majorTickSizePx: 6,
  minorTickSizePx: 3,
  font: '11px monospace',
  labelOffsetPx: 14,
};

/**
 * @abstract
 * @class Axis
 * @classdesc
 *   Define el esqueleto del algoritmo de dibujo de un eje cartesiano
 *   mediante el patrón Template Method.
 *
 *   El método público `draw()` invoca en orden:
 *   1. `drawAxisLine()`  — línea principal del eje.
 *   2. `drawTicks()`     — marcas mayor y menor sobre el eje.
 *   3. `drawLabels()`    — etiquetas numéricas en los ticks mayores.
 *   4. `drawArrow()`     — flecha en el extremo positivo.
 *
 *   Cada subclase implementa los cuatro pasos abstractos.
 */
export abstract class Axis {
  /**
   * @param context     - Contexto 2D del canvas.
   * @param transformer - Conversor metros → píxeles.
   * @param config      - Configuración visual y de escala.
   */
  constructor(
    protected readonly context: CanvasRenderingContext2D,
    protected readonly transformer: CoordinateTransformer,
    protected readonly config: AxisConfig,
  ) { }

  /**
   * @method draw
   * @description
   *   Template Method: dibuja el eje completo en cuatro pasos ordenados.
   *   No debe sobrescribirse en las subclases.
   */
  draw(): void {
    this.context.save();
    this.drawAxisLine();
    this.drawTicks();
    this.drawLabels();
    this.drawArrow();
    this.context.restore();
  }

  /** @description Dibuja la línea principal del eje. */
  protected abstract drawAxisLine(): void;

  /** @description Dibuja los ticks mayores y menores sobre el eje. */
  protected abstract drawTicks(): void;

  /** @description Dibuja etiquetas numéricas junto a los ticks mayores. */
  protected abstract drawLabels(): void;

  /** @description Dibuja la flecha en el extremo positivo del eje. */
  protected abstract drawArrow(): void;

  /**
   * @method drawTick
   * @description
   *   Traza una marca perpendicular al eje en la posición indicada.
   *   Compartido entre AxisX y AxisY para evitar duplicación (DRY).
   *
   * @param pixelAlong   - Posición a lo largo del eje en píxeles.
   * @param pixelAcross  - Posición perpendicular al eje en píxeles.
   * @param isHorizontal - `true` si el eje es horizontal (AxisX).
   * @param halfSize     - Semitamaño del tick en píxeles.
   */
  protected drawTick(
    pixelAlong: number,
    pixelAcross: number,
    isHorizontal: boolean,
    halfSize: number,
  ): void {
    this.context.beginPath();
    if (isHorizontal) {
      this.context.moveTo(pixelAlong, pixelAcross - halfSize);
      this.context.lineTo(pixelAlong, pixelAcross + halfSize);
    } else {
      this.context.moveTo(pixelAcross - halfSize, pixelAlong);
      this.context.lineTo(pixelAcross + halfSize, pixelAlong);
    }
    this.context.stroke();
  }

  /**
   * @method drawArrowHead
   * @description
   *   Dibuja una punta de flecha triangular orientada según `angleRad`.
   *   Convención: `angleRad = 0` apunta a la derecha (+X canvas).
   *   Compartido entre AxisX y AxisY para evitar duplicación (DRY).
   *
   * @param tipX     - X de la punta en píxeles.
   * @param tipY     - Y de la punta en píxeles.
   * @param angleRad - Ángulo de orientación en radianes.
   */
  protected drawArrowHead(
    tipX: number,
    tipY: number,
    angleRad: number,
  ): void {
    const ARROW_SIZE_PX = 10;
    this.context.save();
    this.context.fillStyle = this.config.axisColor;
    this.context.translate(tipX, tipY);
    this.context.rotate(angleRad);
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(-ARROW_SIZE_PX, -ARROW_SIZE_PX / 2);
    this.context.lineTo(-ARROW_SIZE_PX, ARROW_SIZE_PX / 2);
    this.context.closePath();
    this.context.fill();
    this.context.restore();
  }

  /**
   * @method isMajorTick
   * @description
   *   Determina si un valor en metros es un tick mayor.
   *   Usa tolerancia flotante para evitar errores de precisión acumulados
   *   en iteraciones de punto flotante.
   *   Compartido entre AxisX y AxisY para evitar duplicación (DRY).
   *
   * @param meters       - Valor a evaluar en metros.
   * @param minorSpacing - Paso de iteración menor en metros.
   * @returns `true` si el valor es múltiplo de `tickSpacingMeters`.
   */
  protected isMajorTick(meters: number, minorSpacing: number): boolean {
    const FLOAT_TOLERANCE = 0.01;
    const remainder = Math.abs(meters % this.config.tickSpacingMeters);
    return remainder < minorSpacing * FLOAT_TOLERANCE;
  }
}
