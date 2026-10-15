/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-transformer.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Fuente de verdad única para la transformación entre coordenadas
 *   matemáticas y píxeles de canvas.
 */

/**
 * @interface CoordinateDomain
 * @description
 *   Define el dominio matemático que se mapea al área dibujable del canvas.
 *   El controlador construye este objeto a partir del modelo cada vez
 *   que los parámetros cambian.
 * @param mathStart - Extremo izquierdo del dominio X.
 * @param mathEnd - Extremo derecho del dominio X.
 * @param mathYMin - Extremo inferior del rango Y.
 * @param mathYMax - Extremo superior del rango Y.
 */
export interface CoordinateDomain {
  readonly mathStart: number;
  readonly mathEnd: number;
  readonly mathYMin: number;
  readonly mathYMax: number;
}

/**
 * @interface CanvasLayout
 * @description
 *   Dimensiones del canvas y márgenes que definen el área dibujable.
 *   Procede de CanvasView.getDimensions() y CoordinateConfig.
 * @param canvasWidth - Ancho total del canvas en píxeles.
 * @param canvasHeight - Alto total del canvas en píxeles.
 * @param marginLeft - Margen izquierdo en píxeles.
 * @param marginBottom - Margen inferior en píxeles.
 * @param marginTop - Margen superior en píxeles.
 * @param marginRight - Margen derecho en píxeles.
 */
export interface CanvasLayout {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly marginLeft: number;
  readonly marginBottom: number;
  readonly marginTop: number;
  readonly marginRight: number;
}

/**
 * Gestiona la transformación afín entre el dominio matemático
 * [mathStart, mathEnd] × [mathYMin, mathYMax] y el espacio de píxeles
 * del canvas dentro del área dibujable (canvas menos márgenes).
 */
export class CoordinateTransformer {
  private readonly scaleX: number;
  private readonly scaleY: number;
  private readonly originPixelX: number;
  private readonly originPixelY: number;
  private readonly drawableWidth: number;
  private readonly drawableHeight: number;

  /**
   * @param layout - Dimensiones del canvas y márgenes.
   * @param domain - Dominio matemático X e Y a mapear.
   */
  constructor(
    private readonly layout: CanvasLayout,
    private readonly domain: CoordinateDomain,
  ) {
    this.drawableWidth =
      layout.canvasWidth - layout.marginLeft - layout.marginRight;
    this.drawableHeight =
      layout.canvasHeight - layout.marginTop - layout.marginBottom;

    const domainWidth = domain.mathEnd - domain.mathStart;
    const rangeHeight = domain.mathYMax - domain.mathYMin;

    this.scaleX = domainWidth !== 0 ? this.drawableWidth / domainWidth : 1;
    this.scaleY = rangeHeight !== 0 ? this.drawableHeight / rangeHeight : 1;
    this.originPixelX = layout.marginLeft;
    this.originPixelY = layout.canvasHeight - layout.marginBottom;
  }

  /**
   * Transforma una coordenada X matemática en píxeles de canvas.
   * mathStart → marginLeft, mathEnd → canvasWidth - marginRight.
   * @param mathX - Valor X en el dominio matemático.
   * @returns Coordenada X en píxeles.
   */
  toPixelX(mathX: number): number {
    return this.originPixelX +
      (mathX - this.domain.mathStart) * this.scaleX;
  }

  /**
   * Transforma una coordenada Y matemática en píxeles de canvas.
   * mathYMin → borde inferior del área dibujable (Y alto en px).
   * mathYMax → borde superior del área dibujable (Y bajo en px).
   * El eje Y del canvas está invertido respecto al matemático.
   * @param mathY - Valor Y en el rango matemático.
   * @returns Coordenada Y en píxeles.
   */
  toPixelY(mathY: number): number {
    return this.originPixelY -
      (mathY - this.domain.mathYMin) * this.scaleY;
  }

  /**
   * Píxel X correspondiente al extremo izquierdo del dominio (mathStart).
   * Los ejes usan este valor como punto de partida de la línea del eje X.
   * @returns Coordenada X del borde izquierdo del área dibujable en píxeles.
   */
  getOriginPixelX(): number {
    return this.originPixelX;
  }

  /**
   * Píxel Y correspondiente al extremo inferior del rango (mathYMin).
   * Los ejes usan este valor como punto de partida de la línea del eje Y.
   * @returns Coordenada Y del borde inferior del área dibujable en píxeles.
   */
  getOriginPixelY(): number {
    return this.originPixelY;
  }

  /**
   * Píxeles por unidad matemática en el eje X.
   * @returns Factor de escala X en px/unidad.
   */
  getScaleX(): number {
    return this.scaleX;
  }

  /**
   * Píxeles por unidad matemática en el eje Y.
   * @returns Factor de escala Y en px/unidad.
   */
  getScaleY(): number {
    return this.scaleY;
  }

  /**
   * Devuelve el dominio matemático activo.
   * @returns Dominio inmutable.
   */
  getDomain(): CoordinateDomain {
    return this.domain;
  }

  /**
   * Devuelve el layout del canvas activo.
   * @returns Layout inmutable.
   */
  getLayout(): CanvasLayout {
    return this.layout;
  }
}
