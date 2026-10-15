/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file lissajous-params.ts
 * @description Parámetros de la curva de Lissajous y sus valores por defecto.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface LissajousParams
 * @description Parámetros que definen completamente una curva de Lissajous.
 *   x(t) = amplitudeX · sin(frequencyX · t + phaseShift · π)
 *   y(t) = amplitudeY · sin(frequencyY · t)
 */
export interface LissajousParams {
  /** Frecuencia del movimiento armónico en el eje X (entero positivo). */
  readonly frequencyX: number;
  /** Frecuencia del movimiento armónico en el eje Y (entero positivo). */
  readonly frequencyY: number;
  /** Desfase en múltiplos de π (0 → 0 rad, 1 → π rad, 2 → 2π rad). */
  readonly phaseShift: number;
  /** Amplitud horizontal en píxeles. */
  readonly amplitudeX: number;
  /** Amplitud vertical en píxeles. */
  readonly amplitudeY: number;
  /** Si `true`, el desfase se incrementa automáticamente en cada frame. */
  readonly isPhaseAnimated: boolean;
}

/**
 * @constant DEFAULT_LISSAJOUS_PARAMS
 * @description Valores iniciales de la curva al arrancar la aplicación.
 */
export const DEFAULT_LISSAJOUS_PARAMS: LissajousParams = {
  frequencyX: 3,
  frequencyY: 2,
  phaseShift: 0.5,
  amplitudeX: 200,
  amplitudeY: 200,
  isPhaseAnimated: true,
};