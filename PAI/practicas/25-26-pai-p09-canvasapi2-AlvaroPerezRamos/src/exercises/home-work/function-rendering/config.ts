/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file config.ts
 * @description
 *   Configuración para el sistema de coordenadas cartesianas.
 *   Define tipos e interfaces compartidos en la aplicación de representación de funciones.
 * 
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  30 March 2026
 */

/**
 * @typedef Point
 * @description Representa un punto en el espacio 2D.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * @interface CartesianGridConfig
 * @description Configuración para el sistema de coordenadas cartesianas.
 * Permite personalizar la apariencia y el comportamiento del grid.
 */
export interface CartesianGridConfig {
  /* Tamaño en píxeles entre líneas mayores (ejes) */
  majorStepPx: number;
  /* Tamaño en píxeles entre líneas menores (grid) */
  minorStepPx: number;
  /* Número de píxeles que representan una unidad en el eje X */
  unitsPerTickX: number;
  /* Número de píxeles que representan una unidad en el eje Y */
  unitsPerTickY: number;
  /* Color de las líneas menores del grid */
  gridMinorColor: string;
  /* Color de las líneas mayores del grid (ejes) */
  gridMajorColor: string;
  /* Color de los ejes X e Y */
  axisColor: string;
  /* Color de las etiquetas de los ejes */
  labelColor: string;
  /* Tamaño en píxeles de las marcas de los ejes */
  tickSizePx: number;
  /* Fuente para las etiquetas de los ejes */
  font: string;
}

/**
 * @constant DEFAULT_CARTESIAN_GRID_CONFIG
 * @description Configuración por defecto para el sistema de coordenadas cartesianas.
 * Se puede sobrescribir al crear una instancia de CartesianCoordinateSystem.
 */
export const DEFAULT_CARTESIAN_GRID_CONFIG: CartesianGridConfig = {
  majorStepPx: 50,
  minorStepPx: 10,
  unitsPerTickX: 2,
  unitsPerTickY: 1,
  gridMinorColor: 'lightgray',
  gridMajorColor: 'darkgray',
  axisColor: 'black',
  labelColor: 'darkslategray',
  tickSizePx: 6,
  font: '12px Arial, sans-serif',
};