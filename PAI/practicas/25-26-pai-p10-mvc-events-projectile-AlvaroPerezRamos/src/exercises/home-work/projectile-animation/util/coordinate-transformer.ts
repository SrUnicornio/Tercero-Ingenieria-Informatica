/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-transformer.ts
 * @description
 *   Conversor entre el espacio físico (metros) y el espacio canvas
 *   (píxeles). Centraliza toda la lógica de escala y márgenes (DRY).
 *
 *   El origen matemático (0, 0) se mapea a la esquina inferior izquierda
 *   del área dibujable, dentro de los márgenes configurados.
 *
 *   Al actualizar la escala con {@link updateScale}, todos los clientes
 *   que usan esta instancia obtienen inmediatamente la nueva transformación
 *   sin necesidad de reconstruir ningún objeto.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface TransformerConfig
 * @description
 *   Configuración del espacio de coordenadas: tamaño del canvas,
 *   márgenes y rangos físicos visibles.
 */
export interface TransformerConfig {
  /** Ancho total del canvas en píxeles. */
  readonly canvasWidth: number;
  /** Alto total del canvas en píxeles. */
  readonly canvasHeight: number;
  /** Margen izquierdo en píxeles (espacio para etiquetas del eje Y). */
  readonly marginLeft: number;
  /** Margen inferior en píxeles (espacio para etiquetas del eje X). */
  readonly marginBottom: number;
  /** Margen superior en píxeles (espacio para flecha + etiqueta eje Y). */
  readonly marginTop: number;
  /** Margen derecho en píxeles (espacio para flecha + etiqueta eje X). */
  readonly marginRight: number;
  /** Valor máximo del eje X en metros (ancho del mundo visible). */
  readonly maxX: number;
  /** Valor máximo del eje Y en metros (alto del mundo visible). */
  readonly maxY: number;
}

/**
 * @interface PixelPoint
 * @description Par de coordenadas en píxeles del canvas.
 */
export interface PixelPoint {
  /** Coordenada X en píxeles. */
  readonly x: number;
  /** Coordenada Y en píxeles. */
  readonly y: number;
}

/**
 * @class CoordinateTransformer
 * @classdesc
 *   Gestiona la transformación afín entre metros y píxeles.
 *   Es el único lugar donde se realizan estos cálculos (DRY).
 *
 *   El eje Y del canvas está invertido respecto al matemático:
 *   en canvas, Y crece hacia abajo; en física, hacia arriba.
 *
 * @example
 * ```typescript
 * const transformer = new CoordinateTransformer(config);
 * const { x, y } = transformer.toPixel(50, 30);
 * ```
 */
export class CoordinateTransformer {
  /** Configuración activa. */
  private config: TransformerConfig;

  /**
   * @param initialConfig - Configuración inicial del transformador.
   */
  constructor(initialConfig: TransformerConfig) {
    this.config = initialConfig;
  }

  // -------------------------------------------------------------------------
  // Propiedades derivadas de la configuración
  // -------------------------------------------------------------------------

  /**
   * @readonly
   * @description
   *   Coordenada X del origen en píxeles (esquina izquierda del área).
   */
  getOriginPixelX(): number {
    return this.config.marginLeft;
  }

  /**
   * @readonly
   * @description
   *   Coordenada Y del origen en píxeles (borde inferior del área).
   */
  getOriginPixelY(): number {
    return this.config.canvasHeight - this.config.marginBottom;
  }

  /**
   * @readonly
   * @description
   *   Ancho del área dibujable en píxeles (sin márgenes).
   */
  getDrawableWidth(): number {
    return (
      this.config.canvasWidth
      - this.config.marginLeft
      - this.config.marginRight
    );
  }

  /**
   * @readonly
   * @description
   *   Alto del área dibujable en píxeles (sin márgenes).
   */
  getDrawableHeight(): number {
    return (
      this.config.canvasHeight
      - this.config.marginTop
      - this.config.marginBottom
    );
  }

  /** @returns El valor máximo de X en metros que cabe actualmente en el canvas. */
  getVisibleMaxX(): number {
    return this.getDrawableWidth() / this.getUniformScale();
  }

  /** @returns El valor máximo de Y en metros que cabe actualmente en el canvas. */
  getVisibleMaxY(): number {
    return this.getDrawableHeight() / this.getUniformScale();
  }

  // -------------------------------------------------------------------------
  // Transformación
  // -------------------------------------------------------------------------

  /**
   * @method toPixel
   * @description
   *   Transforma una posición en metros a coordenadas de canvas en píxeles.
   *
   * @param xMeters - Posición horizontal en metros.
   * @param yMeters - Posición vertical en metros.
   * @returns Las coordenadas equivalentes en píxeles del canvas.
   */
  toPixel(xMeters: number, yMeters: number): PixelPoint {
    const scale = this.getUniformScale();

    return {
      x: this.getOriginPixelX() + xMeters * scale,
      // Y invertido: 0 m → borde inferior; maxY m → borde superior
      y: this.getOriginPixelY() - yMeters * scale,
    };
  }

  /**
   * @method getUniformScale
   * @description
   *   Devuelve la escala uniforme en píxeles/metro: el mínimo entre el
   *   ratio X (drawableWidth/maxX) y el ratio Y (drawableHeight/maxY).
   *   Garantiza que las celdas de la cuadrícula sean cuadradas.
   * @returns Píxeles por metro, igual en ambos ejes.
   */
  getUniformScale(): number {
    const scaleX = this.getDrawableWidth() / this.config.maxX;
    const scaleY = this.getDrawableHeight() / this.config.maxY;
    return Math.min(scaleX, scaleY);
  }

  // -------------------------------------------------------------------------
  // Consultas
  // -------------------------------------------------------------------------

  /**
   * @method getConfig
   * @description Devuelve la configuración activa del transformador.
   * @returns La configuración vigente (inmutable desde el exterior).
   */
  getConfig(): TransformerConfig {
    return this.config;
  }

  // -------------------------------------------------------------------------
  // Actualización de escala
  // -------------------------------------------------------------------------

  /**
   * @method updateScale
   * @description
   *   Actualiza los rangos físicos visibles sin reconstruir el objeto.
   *   Todos los clientes que usen esta instancia obtendrán la nueva escala
   *   de forma automática en el siguiente frame.
   *
   * @param newMaxX - Nuevo máximo del eje X en metros.
   * @param newMaxY - Nuevo máximo del eje Y en metros.
   */
  updateScale(newMaxX: number, newMaxY: number): void {
    this.config = { ...this.config, maxX: newMaxX, maxY: newMaxY };
  }

  /**
   * @method updateCanvasSize
   * @description
   *   Actualiza las dimensiones del canvas cuando cambia el tamaño
   *   del viewport. Necesario para que el reescalado sea correcto.
   *
   * @param newWidth  - Nuevo ancho del canvas en píxeles.
   * @param newHeight - Nuevo alto del canvas en píxeles.
   */
  updateCanvasSize(newWidth: number, newHeight: number): void {
    this.config = {
      ...this.config,
      canvasWidth: newWidth,
      canvasHeight: newHeight,
    };
  }
}