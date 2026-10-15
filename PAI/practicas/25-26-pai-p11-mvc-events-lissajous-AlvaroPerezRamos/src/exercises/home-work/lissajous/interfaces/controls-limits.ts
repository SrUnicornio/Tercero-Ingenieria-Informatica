/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file controls-limits.ts
 * @description Límites de validación de los controles del panel y sus valores por defecto.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface ControlsLimits
 * @description Rango [min, max] de cada parámetro editable en el panel de controles.
 */
export interface ControlsLimits {
  readonly frequencyMin: number;
  readonly frequencyMax: number;
  readonly phaseShiftMin: number;
  readonly phaseShiftMax: number;
  readonly amplitudeMin: number;
  readonly amplitudeMax: number;
}

/**
 * @constant DEFAULT_CONTROLS_LIMITS
 * @description Límites por defecto de los controles del panel.
 */
export const DEFAULT_CONTROLS_LIMITS: ControlsLimits = {
  frequencyMin: 1,
  frequencyMax: 20,
  phaseShiftMin: 0,
  phaseShiftMax: 2,
  amplitudeMin: 10,
  amplitudeMax: 400,
};