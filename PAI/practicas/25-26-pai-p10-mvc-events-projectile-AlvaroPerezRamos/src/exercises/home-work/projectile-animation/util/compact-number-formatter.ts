/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file compact-number-formatter.ts
 * @description
 *   Formateador compacto de números para las etiquetas de los ejes.
 *
 *   Convierte valores numéricos grandes en representaciones legibles
 *   con sufijos métricos estándar (k, M, G), evitando etiquetas largas
 *   que saturen el espacio visual de los ejes.
 *
 *   La parte decimal se omite cuando es cero para mantener
 *   las etiquetas lo más compactas posible (DRY, SRP).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface MetricPrefix
 * @description Par umbral–sufijo para el formateo con prefijo métrico.
 */
interface MetricPrefix {
  /** Valor a partir del cual aplica este sufijo. */
  readonly threshold: number;
  /** Sufijo métrico a mostrar (ej. "k", "M", "G"). */
  readonly suffix: string;
}

/**
 * Tabla de prefijos métricos ordenada de mayor a menor umbral.
 * La búsqueda se hace con `Array.find`, que devuelve el primero
 * que cumpla la condición — por eso el orden importa.
 */
const METRIC_PREFIXES: readonly MetricPrefix[] = [
  { threshold: 1_000_000_000, suffix: 'G' },
  { threshold: 1_000_000, suffix: 'M' },
  { threshold: 1_000, suffix: 'k' },
];

/**
 * @class CompactNumberFormatter
 * @classdesc
 *   Formatea números con sufijos métricos (k, M, G) para etiquetas
 *   de ejes cartesianos.
 *
 * @example
 * ```typescript
 * CompactNumberFormatter.format(1500);  // "1.5k"
 * CompactNumberFormatter.format(2000000); // "2M"
 * CompactNumberFormatter.format(300);   // "300"
 * ```
 */
export class CompactNumberFormatter {
  /**
   * @method format
   * @description
   *   Devuelve la representación compacta del valor dado.
   *   Si el valor es inferior a 1000, lo devuelve como entero redondeado.
   *
   * @param value - Valor numérico en metros a formatear.
   * @returns La cadena de texto compacta lista para mostrar en el eje.
   */
  static format(value: number): string {
    if (value === 0) return '0';

    const matchedPrefix = METRIC_PREFIXES.find(
      (prefix) => Math.abs(value) >= prefix.threshold,
    );

    if (matchedPrefix === undefined) {
      return String(Math.round(value));
    }

    const scaledValue = value / matchedPrefix.threshold;
    const formattedNumber = CompactNumberFormatter
      .formatDecimal(scaledValue);

    return `${formattedNumber}${matchedPrefix.suffix}`;
  }

  // -------------------------------------------------------------------------
  // Privados
  // -------------------------------------------------------------------------

  /**
   * Formatea un número eliminando el decimal si es cero.
   * Usa un decimal de precisión para valores no enteros.
   *
   * @param value - Valor ya escalado al prefijo elegido.
   * @returns La cadena sin decimal innecesario (ej. "1" en vez de "1.0").
   */
  private static formatDecimal(value: number): string {
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toFixed(1);
  }
}