/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file lissajous-point.ts
 * @description Punto normalizado en el espacio [-1, 1]² de la curva.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface LissajousPoint
 * @description Punto (x, y) en coordenadas normalizadas [-1, 1].
 *   La vista escala estos valores con las amplitudes antes de dibujar.
 */
export interface LissajousPoint {
  /** Coordenada horizontal normalizada en [-1, 1]. */
  readonly x: number;
  /** Coordenada vertical normalizada en [-1, 1]. */
  readonly y: number;
}