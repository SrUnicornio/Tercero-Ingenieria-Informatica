/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file types.ts
 * @description Tipos y constantes para la simulación de Monte Carlo de π.
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 * @module Types
 */

/**
 * Configuración del sistema de coordenadas y dimensiones.
 * Representa un sistema cartesiano desde axisMin hasta axisMax,
 * donde se dibuja un círculo centrado en el origen.
 *
 * @typedef {Object} CoordinateSystemConfig
 * @property {number} axisMin Valor mínimo del eje (ej. -5).
 * @property {number} axisMax Valor máximo del eje (ej. 5).
 * @property {number} circleRadius Radio del círculo (ej. 4).
 * @property {number} axisLabelMarginPx Margen en píxeles para etiquetas.
 * @property {number} axisTickLengthPx Longitud de las marcas de los ejes.
 */
export interface CoordinateSystemConfig {
  axisMin: number;
  axisMax: number;
  circleRadius: number;
  axisLabelMarginPx: number;
  axisTickLengthPx: number;
}

/**
 * Esquema de colores utilizado en la visualización.
 *
 * @typedef {Object} ColorScheme
 * @property {string} ullPurple Color principal para figuras.
 * @property {string} axisColor Color de los ejes.
 * @property {string} gridLineColor Color de la cuadrícula.
 */
export interface ColorScheme {
  ullPurple: string;
  axisColor: string;
  gridLineColor: string;
}
