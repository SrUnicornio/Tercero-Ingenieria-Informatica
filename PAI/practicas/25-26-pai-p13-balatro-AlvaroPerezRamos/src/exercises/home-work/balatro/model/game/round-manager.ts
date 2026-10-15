/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file round-manager.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Gestiona el estado de la ronda: manos disponibles,
 *   descartes disponibles y acumulación de puntuación hasta el objetivo.
 *   No conoce nada de cartas ni de la vista; solo maneja contadores y
 *   la condición de victoria/derrota.
 */

/** Manos disponibles por nivel (Small Blind). */
const HANDS_PER_LEVEL = 3;

/** Descartes disponibles por nivel (Small Blind). */
const DISCARDS_PER_LEVEL = 3;

/** Puntuación objetivo del Small Blind. */
export const SMALL_BLIND_GOAL = 300;

/**
 * Gestiona el estado de la ronda.
 */
export class RoundManager {
  // Estado interno de la ronda.
  private totalScore: number = 0;
  private handsLeft: number = HANDS_PER_LEVEL;
  private discardsLeft: number = DISCARDS_PER_LEVEL;

  /**
   * Reinicia todos los contadores y la puntuación al estado inicial del nivel.
   * Se llama al arrancar o reiniciar la partida.
   */
  reset(): void {
    this.totalScore = 0;
    this.handsLeft = HANDS_PER_LEVEL;
    this.discardsLeft = DISCARDS_PER_LEVEL;
  }

  /**
   * Acumula la puntuación de una mano jugada y descuenta una mano disponible.
   * @param roundScore - Puntuación obtenida en la mano recién jugada.
   * @returns La puntuación total acumulada tras registrar esta mano.
   */
  registerHandScore(roundScore: number): number {
    this.totalScore += roundScore;
    this.handsLeft--;
    return this.totalScore;
  }

  /**
   * Descuenta un descarte disponible.
   */
  useDiscard(): void {
    this.discardsLeft--;
  }

  /**
   * Devuelve la puntuación total acumulada en la ronda.
   * @returns Chips acumulados hasta el momento.
   */
  getScore(): number {
    return this.totalScore;
  }

  /**
   * Devuelve el número de manos que le quedan al jugador.
   * @returns Manos disponibles restantes (0 o más).
   */
  getHandsRemaining(): number {
    return this.handsLeft;
  }

  /**
   * Devuelve el número de descartes que le quedan al jugador.
   * @returns Descartes disponibles restantes (0 o más).
   */
  getDiscardsRemaining(): number {
    return this.discardsLeft;
  }

  /**
   * Devuelve la puntuación objetivo que debe superarse para ganar el nivel.
   * @returns Chips necesarios para superar el Small Blind.
   */
  getScoreGoal(): number {
    return SMALL_BLIND_GOAL;
  }

  /**
   * Indica si el jugador ha alcanzado o superado el objetivo de puntuación.
   * @returns `true` si la puntuación acumulada es mayor o igual al objetivo.
   */
  getIsVictory(): boolean {
    return this.totalScore >= SMALL_BLIND_GOAL;
  }

  /**
   * Indica si el jugador ha perdido: se ha quedado sin manos y no ha
   * alcanzado el objetivo de puntuación.
   * @returns `true` si no quedan manos y la puntuación no alcanza el objetivo.
   */
  getIsDefeated(): boolean {
    return this.handsLeft <= 0 && this.totalScore < SMALL_BLIND_GOAL;
  }

  /** Devuelve el número de manos iniciales del nivel. */
  getInitialHands(): number {
    return HANDS_PER_LEVEL;
  }

  /** Devuelve el número de descartes iniciales del nivel. */
  getInitialDiscards(): number {
    return DISCARDS_PER_LEVEL;
  }
}
