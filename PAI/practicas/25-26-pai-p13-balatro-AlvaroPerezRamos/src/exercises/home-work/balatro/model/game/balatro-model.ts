/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file balatro-model.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Fachada del modelo del juego Balatro (Small Blind).
 *   Compone {@link GameEventPublisher} y {@link GameActions} y expone
 *   al controlador una superficie única con dos responsabilidades claras:
 *   - Suscripción a eventos (`onXxx`) → delegada en GameEventPublisher.
 *   - Ejecución de acciones y consultas → delegada en GameActions.
 *
 *   Atributos: 2 (uno por cada colaborador). El flag `isGameOver` se ha
 *   movido a esta fachada porque es la única que conoce ambos colaboradores
 *   y puede decidir si una acción debe bloquearse.
 */

import {Card} from './card';
import {GameEventPublisher} from './game-event-publisher';
import {GameActions} from './game-actions';
import {
  type GameStartedData,
  type CardToggledData,
  type HandPlayedData,
  type CardsDiscardedData,
  type ScorePreviewData,
  type GameEndedData,
} from '../../types/event-payloads';

/**
 * Fachada del modelo. Compone el publicador de eventos y el
 *   ejecutor de acciones, bloqueando las acciones cuando la partida ha
 *   terminado y verificando la condición de fin tras cada mano jugada.
 */
export class BalatroModel {
  private readonly publisher = new GameEventPublisher();
  private readonly actions = new GameActions(this.publisher.channels());
  private isGameOver: boolean = false;

  // ── Suscripción a eventos ─────────────────────────────────────────────────

  /**
   * Registra un listener para el inicio/reinicio de partida.
   * @param listener Función llamada con la mano inicial y el mazo restante.
   */
  onGameStarted(listener: (data: GameStartedData) => void): void {
    this.publisher.onGameStarted(listener);
  }

  /**
   * Registra un listener para el cambio de selección de carta.
   * @param listener Función llamada con índice y estado de selección.
   */
  onCardToggled(listener: (data: CardToggledData) => void): void {
    this.publisher.onCardToggled(listener);
  }

  /**
   * Registra un listener para la mano jugada.
   * @param listener Función llamada con resultado y estado de recursos.
   */
  onHandPlayed(listener: (data: HandPlayedData) => void): void {
    this.publisher.onHandPlayed(listener);
  }

  /**
   * Registra un listener para el descarte de cartas.
   * @param listener Función llamada con cartas nuevas y estado actualizado.
   */
  onCardsDiscarded(listener: (data: CardsDiscardedData) => void): void {
    this.publisher.onCardsDiscarded(listener);
  }

  /**
   * Registra un listener para la previsualización de puntuación.
   * @param listener Función llamada con la jugada detectada en la selección.
   */
  onScorePreview(listener: (data: ScorePreviewData) => void): void {
    this.publisher.onScorePreview(listener);
  }

  /**
   * Registra un listener para el fin de partida.
   * @param listener Función llamada con resultado y puntuación final.
   */
  onGameEnded(listener: (data: GameEndedData) => void): void {
    this.publisher.onGameEnded(listener);
  }

  // ── Acciones del jugador ──────────────────────────────────────────────────

  /**
   * Reinicia el estado y arranca una nueva partida.
   */
  startGame(): void {
    this.isGameOver = false;
    this.actions.startGame();
  }

  /**
   * Alterna la selección de una carta. Sin efecto si el juego terminó.
   * @param cardIndex Índice de la carta en la mano (0-based).
   */
  toggleCard(cardIndex: number): void {
    if (this.isGameOver) return;
    this.actions.toggleCard(cardIndex);
  }

  /**
   * Juega la mano seleccionada y comprueba el fin de partida.
   *   Sin efecto si el juego terminó.
   */
  playHand(): void {
    if (this.isGameOver) return;
    const played = this.actions.playHand();
    if (played) this.checkEndCondition();
  }

  /**
   * Descarta las cartas seleccionadas. Sin efecto si el juego terminó.
   */
  discard(): void {
    if (this.isGameOver) return;
    this.actions.discard();
  }

  /**
   * Ordena la mano según el criterio. Sin efecto si el juego terminó.
   * @param criterion 'rank' | 'suit'.
   */
  sortHand(criterion: 'rank' | 'suit'): void {
    if (this.isGameOver) return;
    this.actions.sortHand(criterion);
  }

  // ── Consultas de estado ───────────────────────────────────────────────────

  /** Devuelve las manos restantes. */
  getHandsRemaining(): number {
    return this.actions.getHandsRemaining();
  }

  /** Devuelve los descartes restantes. */
  getDiscardsRemaining(): number {
    return this.actions.getDiscardsRemaining();
  }

  /** Devuelve el objetivo de puntuación. */
  getScoreGoal(): number {
    return this.actions.getScoreGoal();
  }

  /** Devuelve la puntuación actual. */
  getScore(): number {
    return this.actions.getScore();
  }

  /** Devuelve la mano del jugador. */
  getHand(): readonly Card[] {
    return this.actions.getHand();
  }

  /** Devuelve los índices de las cartas seleccionadas. */
  getSelectedCardIndices(): ReadonlySet<number> {
    return this.actions.getSelectedCardIndices();
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Comprueba victoria o derrota tras jugar una mano.
   *   Es responsabilidad de la fachada porque requiere coordinar
   *   {@link GameActions} (para leer el estado) y {@link GameEventPublisher}
   *   (para emitir el evento de fin), lo cual ninguno de los dos conoce
   *   por separado.
   */
  private checkEndCondition(): void {
    if (this.actions.isVictory() || this.actions.isDefeated()) {
      this.isGameOver = true;
      this.publisher.channels().triggerGameEnded({
        playerWon: this.actions.isVictory(),
        finalScore: this.actions.getFinalScore(),
      });
    }
  }
}
