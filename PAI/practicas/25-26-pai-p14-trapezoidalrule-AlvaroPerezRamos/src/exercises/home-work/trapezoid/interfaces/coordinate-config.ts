/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-config.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Interfaz unificada de configuración del sistema de coordenadas.
 *   Reemplaza las antiguas grid-config.ts y axis-config.ts, que
 *   manejaban dos sistemas independientes con orígenes distintos.
 */

/**
 * @interface CoordinateConfig
 * @description
 *   Parámetros que controlan los márgenes del canvas, el estilo
 *   visual de la cuadrícula y el estilo visual de los ejes.
 */
export interface CoordinateConfig {
  // ── Márgenes del canvas ───────────────────────────────────────────────────
  readonly marginLeft: number;
  readonly marginBottom: number;
  readonly marginTop: number;
  readonly marginRight: number;

  // ── Grid ──────────────────────────────────────────────────────────────────
  readonly minorLineColor: string;
  readonly majorLineColor: string;
  readonly minorLineWidth: number;
  readonly majorLineWidth: number;
  readonly minorSubdivisions: number;
  readonly targetMajorDivisions: number;

  // ── Ejes ──────────────────────────────────────────────────────────────────
  readonly axisColor: string;
  readonly labelColor: string;
  readonly majorTickSizePx: number;
  readonly minorTickSizePx: number;
  readonly font: string;
  readonly labelOffsetPx: number;
}

/**
 * @description
 *   Configuración por defecto. Los márgenes reservan espacio suficiente
 *   para etiquetas de una cifra y la flecha del eje.
 */
export const DEFAULT_COORDINATE_CONFIG: CoordinateConfig = {
  marginLeft: 50,
  marginBottom: 30,
  marginTop: 10,
  marginRight: 10,

  minorLineColor: 'lightgray',
  majorLineColor: 'darkgray',
  minorLineWidth: 0.5,
  majorLineWidth: 1,
  minorSubdivisions: 5,
  targetMajorDivisions: 8,

  axisColor: 'black',
  labelColor: 'darkslategray',
  majorTickSizePx: 6,
  minorTickSizePx: 3,
  font: '11px Arial, sans-serif',
  labelOffsetPx: 14,
};
