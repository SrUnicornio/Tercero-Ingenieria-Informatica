/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file tick-calculator.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Calcula el espaciado «bonito» de los ticks de los ejes y de la
 *   cuadrícula para un rango visible dado.
 */

/** Número aproximado de ticks mayores objetivo por eje. */
const TARGET_TICK_COUNT = 7.5;

/**
 * Calcula el espaciado «bonito» para los ticks mayores de un eje dado
 * su rango visible en unidades matemáticas.
 */
export class TickCalculator {
  /**
   * Devuelve el espaciado bonito (1, 2 ó 5 × 10ⁿ) que produce
   * aproximadamente TARGET_TICK_COUNT divisiones mayores
   * en el rango dado.
   *
   * @param rangeSize - Tamaño del rango visible en unidades matemáticas
   *   (siempre positivo; si es 0 se devuelve 1 por seguridad).
   * @returns Espaciado en unidades matemáticas para los ticks mayores.
   */
  static compute(rangeSize: number): number {
    if (rangeSize <= 0) return 1;

    const rawSpacing = rangeSize / TARGET_TICK_COUNT;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawSpacing)));
    const normalized = rawSpacing / magnitude;

    if (normalized < 1.5) return 1 * magnitude;
    if (normalized < 3.5) return 2 * magnitude;
    if (normalized < 7.5) return 5 * magnitude;
    return 10 * magnitude;
  }
}
