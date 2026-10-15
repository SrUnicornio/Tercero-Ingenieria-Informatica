/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trochoid-params.ts
 * @description
 *   Parámetros que definen el estado de la aplicación Trochoid.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface CircleStyle
 * @description Configuración visual de un círculo.
 */
export interface CircleStyle {
  /** Color CSS del trazo. */
  readonly strokeColor: string;
  /** Grosor del trazo en píxeles. */
  readonly strokeWidth: number;
  /** Indica si el círculo debe ser relleno. */
  readonly isFilled: boolean;
  /** Color CSS de relleno (solo si isFilled es true). */
  readonly fillColor?: string;
}

/**
 * @interface CircleData
 * @description Datos completos de un círculo a dibujar.
 */
export interface CircleData {
  /** Centro X en coordenadas de mundo. */
  readonly centerX: number;
  /** Centro Y en coordenadas de mundo. */
  readonly centerY: number;
  /** Radio en unidades de mundo. */
  readonly radius: number;
  /** Estilo visual del círculo. */
  readonly style: CircleStyle;
}

/**
 * @interface SegmentData
 * @description Datos completos de un segmento a dibujar.
 */
export interface SegmentData {
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
  readonly color: string;
  readonly lineWidth: number;
}

/**
 * @interface PointData
 * @description Datos completos de un punto a dibujar.
 */
export interface PointData {
  readonly centerX: number;
  readonly centerY: number;
  readonly radiusPx: number;
  readonly color: string;
}

/**
 * @constant DEFAULT_CIRCLE_STYLES
 */
export const DEFAULT_CIRCLE_STYLES = {
  ROLLING_CIRCLE: {
    strokeColor: 'black',
    strokeWidth: 1.5,
    isFilled: false,
  } as CircleStyle,
  OUTER_CIRCLE: {
    strokeColor: 'red',
    strokeWidth: 1.5,
    isFilled: false,
  } as CircleStyle,
  TRACER_POINT: {
    strokeColor: 'red',
    strokeWidth: 0,
    isFilled: true,
    fillColor: 'red',
  } as CircleStyle,
  CENTER_POINT: {
    strokeColor: 'blue',
    strokeWidth: 0,
    isFilled: true,
    fillColor: 'blue',
  } as CircleStyle,
};