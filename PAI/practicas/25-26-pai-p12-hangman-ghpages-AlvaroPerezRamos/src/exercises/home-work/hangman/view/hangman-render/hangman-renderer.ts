/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-renderer.ts
 * @description Clase abstracta que define el contrato de todo renderer del ahorcado.
 *   Cualquier implementación concreta (canvas, imágenes PNG, SVG…) debe extender
 *   esta clase e implementar `render`. El resto del sistema (HangmanView) depende
 *   únicamente de esta abstracción, no de ninguna implementación concreta (DIP).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

/** Número de estados de fallo posibles: 0 (sin fallos) a 6 (ahorcado completo). */
export const HANGMAN_STAGE_COUNT = 7;

/**
 * Contrato que deben cumplir todos los renderers del ahorcado.
 * Cada subclase concreta decide cómo representar visualmente cada estado.
 */
export abstract class HangmanRenderer {
  /**
   * Renderiza el estado del ahorcado correspondiente al número de fallos.
   * @param failedAttempts Número de intentos fallidos acumulados (0–6).
   */
  abstract render(failedAttempts: number): void;
}
