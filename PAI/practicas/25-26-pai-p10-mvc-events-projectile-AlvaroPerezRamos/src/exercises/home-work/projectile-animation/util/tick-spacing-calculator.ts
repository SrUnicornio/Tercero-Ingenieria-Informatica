/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file tick-spacing-calculator.ts
 * @description
 *   Calcula el espaciado "bonito" de los ticks de los ejes en función
 *   del rango visible y el número deseado de divisiones.
 *
 *   Centraliza la lógica de espaciado para que tanto los ejes como
 *   la cuadrícula usen la misma fuente de verdad (DRY).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/** Número mínimo de ticks mayores en cada eje. */
const MIN_MAJOR_TICKS = 5;

/** Número máximo de ticks mayores en cada eje. */
const MAX_MAJOR_TICKS = 10;

/**
 * @class TickSpacingCalculator
 * @classdesc
 *   Calcula el espaciado de ticks mayores para un rango de eje dado.
 *   Garantiza siempre entre {@link MIN_MAJOR_TICKS} y
 *   {@link MAX_MAJOR_TICKS} ticks visibles, usando espaciados
 *   "bonitos" de la forma 1, 2, 5 × 10^n.
 *
 * @example
 * ```typescript
 * const spacingMeters = TickSpacingCalculator.compute(350);
 * // → 50 (7 ticks visibles de 0 a 350)
 * ```
 */
export class TickSpacingCalculator {
  /**
   * @method compute
   * @description
   *   Calcula el espaciado bonito para el rango dado.
   *
   * @param rangeMeters - Rango visible del eje en metros.
   * @returns Espaciado en metros para los ticks mayores.
   */
  static compute(rangeMeters: number): number {
    const targetTicks = (MIN_MAJOR_TICKS + MAX_MAJOR_TICKS) / 2;
    const rawSpacing = rangeMeters / targetTicks;
    const magnitude = Math.pow(
      10,
      Math.floor(Math.log10(rawSpacing)),
    );
    const normalized = rawSpacing / magnitude;

    let niceNormalized: number;
    if (normalized < 1.5) {
      niceNormalized = 1;
    } else if (normalized < 3.5) {
      niceNormalized = 2;
    } else if (normalized < 7.5) {
      niceNormalized = 5;
    } else {
      niceNormalized = 10;
    }
    
    return niceNormalized * magnitude;
  }
}