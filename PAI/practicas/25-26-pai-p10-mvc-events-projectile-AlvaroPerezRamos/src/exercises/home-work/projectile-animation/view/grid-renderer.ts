/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file grid-renderer.ts
 * @description
 *   Renderizador de la cuadrícula de fondo del sistema de coordenadas.
 *
 *   Estilo visual idéntico al de la p09: líneas menores en `lightgray`
 *   (0.5 px) y líneas mayores en `darkgray` (1 px), ambas sólidas.
 *   El espaciado se calcula dinámicamente con la heurística 1/2/5×10ⁿ
 *   para mantener ~{@link GridRendererConfig.targetMajorDivisions} líneas
 *   visibles sea cual sea el rango en metros.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CoordinateTransformer } from '../util/coordinate-transformer.js';

/**
 * @interface GridRendererConfig
 * @description
 *   Parámetros visuales y de espaciado de la cuadrícula.
 *   Sustituye las constantes de módulo sueltas para cumplir la guía
 *   de estilo de Google (no usar module-level constants para valores
 *   configurables).
 */
export interface GridRendererConfig {
  /** Color CSS de las líneas menores. */
  readonly minorColor: string;
  /** Color CSS de las líneas mayores. */
  readonly majorColor: string;
  /** Grosor en píxeles de las líneas menores. */
  readonly minorLineWidth: number;
  /** Grosor en píxeles de las líneas mayores. */
  readonly majorLineWidth: number;
  /** Subdivisiones menores por cada división mayor (ratio minor/major). */
  readonly minorSubdivisions: number;
  /** Número aproximado de divisiones mayores deseadas en cada eje. */
  readonly targetMajorDivisions: number;
}

/**
 * @constant DEFAULT_GRID_RENDERER_CONFIG
 * @description Configuración por defecto con el estilo visual de la p09.
 */
export const DEFAULT_GRID_RENDERER_CONFIG: GridRendererConfig = {
  minorColor: 'lightgray',
  majorColor: 'darkgray',
  minorLineWidth: 0.5,
  majorLineWidth: 1,
  minorSubdivisions: 5,
  targetMajorDivisions: 8,
};

/**
 * @class GridRenderer
 * @classdesc
 *   Dibuja la cuadrícula de fondo con dos niveles (minor y major).
 *   SRP: solo dibuja líneas de cuadrícula; no conoce ejes ni física.
 */
export class GridRenderer {
  private readonly config: GridRendererConfig;

  /**
   * @param context     - Contexto 2D del canvas.
   * @param transformer - Conversor metros → píxeles.
   * @param config      - Configuración visual (opcional, usa defaults si se omite).
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    private readonly transformer: CoordinateTransformer,
    config: Partial<GridRendererConfig> = {},
  ) {
    this.config = { ...DEFAULT_GRID_RENDERER_CONFIG, ...config };
  }

  /**
   * @method draw
   * @description
   *   Calcula el espaciado dinámicamente y dibuja primero las líneas
   *   menores y luego las mayores (para que queden encima visualmente).
   */
  draw(): void {
    const { maxX, maxY } = this.transformer.getConfig();
    const majorSpacing = this.computeNiceSpacing(Math.max(maxX, maxY));
    const minorSpacing = majorSpacing / this.config.minorSubdivisions;

    this.drawMinorLines(minorSpacing, majorSpacing);
    this.drawMajorLines(majorSpacing);
  }

  // ---------------------------------------------------------------------------
  // Privados — dibujo de niveles
  // ---------------------------------------------------------------------------

  /**
   * Dibuja las líneas menores omitiendo las posiciones de línea mayor (DRY).
   */
  private drawMinorLines(minorSpacing: number, majorSpacing: number): void {
    this.context.save();
    this.context.strokeStyle = this.config.minorColor;
    this.context.lineWidth = this.config.minorLineWidth;

    this.iterateLines(minorSpacing, (meters) => {
      const remainder = Math.abs(meters % majorSpacing);
      return remainder >= minorSpacing * 0.01;
    });

    this.context.restore();
  }

  /** Dibuja las líneas mayores. */
  private drawMajorLines(majorSpacing: number): void {
    this.context.save();
    this.context.strokeStyle = this.config.majorColor;
    this.context.lineWidth = this.config.majorLineWidth;

    this.iterateLines(majorSpacing, () => true);

    this.context.restore();
  }

  // ---------------------------------------------------------------------------
  // Privados — iteración y trazado
  // ---------------------------------------------------------------------------

  /**
   * Itera en espacio de metros y dibuja una línea vertical y una
   * horizontal por cada valor donde `shouldDraw` devuelva `true` (DRY).
   */
  private iterateLines(
    spacingMeters: number,
    shouldDraw: (meters: number) => boolean,
  ): void {
    const visibleMaxX = this.transformer.getVisibleMaxX();
    const visibleMaxY = this.transformer.getVisibleMaxY();
    const {marginTop, canvasWidth, marginRight } =
      this.transformer.getConfig();

    const pixelTop = marginTop;
    const pixelBottom = this.transformer.getOriginPixelY();
    const pixelLeft = this.transformer.getOriginPixelX();
    const pixelRight = canvasWidth - marginRight;

    for (
      let meters = 0;
      meters <= visibleMaxX + 0.01;
      meters += spacingMeters
    ) {
      if (!shouldDraw(meters)) continue;
      const pixelX = this.transformer.toPixel(meters, 0).x;
      this.drawVerticalLine(pixelX, pixelTop, pixelBottom);
    }

    for (
      let meters = 0;
      meters <= visibleMaxY + 0.01;
      meters += spacingMeters
    ) {
      if (!shouldDraw(meters)) continue;
      const pixelY = this.transformer.toPixel(0, meters).y;
      this.drawHorizontalLine(pixelY, pixelLeft, pixelRight);
    }
  }

  private drawVerticalLine(pixelX: number, top: number, bottom: number): void {
    this.context.beginPath();
    this.context.moveTo(pixelX, top);
    this.context.lineTo(pixelX, bottom);
    this.context.stroke();
  }

  private drawHorizontalLine(pixelY: number, left: number, right: number): void {
    this.context.beginPath();
    this.context.moveTo(left, pixelY);
    this.context.lineTo(right, pixelY);
    this.context.stroke();
  }

  // ---------------------------------------------------------------------------
  // Privados — cálculo del espaciado
  // ---------------------------------------------------------------------------

  /**
   * Calcula el espaciado "bonito" (1, 2 ó 5 × 10ⁿ) para el rango dado.
   */
  private computeNiceSpacing(rangeMeters: number): number {
    const rawSpacing = rangeMeters / this.config.targetMajorDivisions;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawSpacing)));
    const normalized = rawSpacing / magnitude;

    if (normalized < 1.5) return 1 * magnitude;
    if (normalized < 3.5) return 2 * magnitude;
    if (normalized < 7.5) return 5 * magnitude;
    return 10 * magnitude;
  }
}