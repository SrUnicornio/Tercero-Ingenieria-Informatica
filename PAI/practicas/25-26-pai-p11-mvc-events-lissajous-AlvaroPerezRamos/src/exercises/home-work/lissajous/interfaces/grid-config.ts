/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file grid-config.ts
 * @description Configuración visual de la cuadrícula de fondo y sus valores por defecto.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface GridConfig
 * @description Parámetros visuales de la cuadrícula de dos niveles (menor y mayor).
 */
export interface GridConfig {
  /** Color CSS de las líneas menores. */
  readonly minorLineColor: string;
  /** Color CSS de las líneas mayores. */
  readonly majorLineColor: string;
  /** Grosor en px de las líneas menores. */
  readonly minorLineWidth: number;
  /** Grosor en px de las líneas mayores. */
  readonly majorLineWidth: number;
  /** Número de celdas mayores por eje. */
  readonly majorDivisionCount: number;
  /** Número de celdas menores por celda mayor. */
  readonly minorSubdivisionCount: number;
}

/**
 * @constant DEFAULT_GRID_CONFIG
 * @description Estilo de cuadrícula por defecto (gris claro/oscuro, fondo blanco).
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
  minorLineColor: 'lightgray',
  majorLineColor: 'darkgray',
  minorLineWidth: 0.5,
  majorLineWidth: 1,
  majorDivisionCount: 8,
  minorSubdivisionCount: 5,
};