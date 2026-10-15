/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file cartesian-config.ts
 * @description
 *   Configuración visual del plano cartesiano: rango de los ejes,
 *   colores de ejes y cuadrícula, tamaño de los puntos.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface CartesianConfig
 * @description Parámetros visuales del plano cartesiano.
 */
export interface CartesianConfig {
  /** Valor mínimo del eje X (en unidades de mundo). */
  readonly xMin: number;
  /** Valor máximo del eje X (en unidades de mundo). */
  readonly xMax: number;
  /** Valor mínimo del eje Y (en unidades de mundo). */
  readonly yMin: number;
  /** Valor máximo del eje Y (en unidades de mundo). */
  readonly yMax: number;
  /** Color CSS del eje principal. */
  readonly axisColor: string;
  /** Grosor en px del eje principal. */
  readonly axisLineWidth: number;
  /** Color CSS de las líneas de la cuadrícula. */
  readonly gridColor: string;
  /** Grosor en px de las líneas de cuadrícula. */
  readonly gridLineWidth: number;
  /** Radio en px de los puntos marcadores. */
  readonly pointRadius: number;
}

/**
 * @constant DEFAULT_CARTESIAN_CONFIG
 * @description Configuración por defecto: rango [-8, 5] en ambos ejes
 *   (enunciado ejercicio 1).
 */
export const DEFAULT_CARTESIAN_CONFIG: CartesianConfig = {
  xMin: -8,
  xMax: 5,
  yMin: -8,
  yMax: 5,
  axisColor: 'black',
  axisLineWidth: 1.5,
  gridColor: 'lightgray',
  gridLineWidth: 0.5,
  pointRadius: 6,
};