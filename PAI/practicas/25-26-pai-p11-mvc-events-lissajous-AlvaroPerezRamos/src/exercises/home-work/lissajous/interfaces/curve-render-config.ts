/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file curve-render-config.ts
 * @description Configuración visual de la línea de la curva de Lissajous y sus valores por defecto.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface CurveRenderConfig
 * @description Parámetros visuales de la línea de la curva sobre el canvas.
 */
export interface CurveRenderConfig {
  /** Color CSS de la línea de la curva. */
  readonly curveColor: string;
  /** Grosor en píxeles de la línea de la curva. */
  readonly curveLineWidth: number;
}

/**
 * @constant DEFAULT_CURVE_RENDER_CONFIG
 * @description Estilo por defecto: línea negra de 1.5 px.
 */
export const DEFAULT_CURVE_RENDER_CONFIG: CurveRenderConfig = {
  curveColor: 'black',
  curveLineWidth: 1.5,
};