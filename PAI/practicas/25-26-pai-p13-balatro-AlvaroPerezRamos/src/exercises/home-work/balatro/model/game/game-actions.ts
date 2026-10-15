/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file game-actions.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Lógica de las acciones del juego Balatro (Small Blind).
 *   Coordina {@link Deck}, {@link HandManager} y {@link RoundManager}
 *   para ejecutar cada acción del jugador, y delega la emisión de eventos
 *   en los canales proporcionados por {@link GameEventPublisher}.
 *
 *   Responsabilidad única: ejecutar la lógica del juego y emitir el
 *   evento correspondiente tras cada acción.
 *   No conoce la vista, ni el sistema de suscripción (eso es GameEventPublisher).
 */

import {Deck} from './deck';
import {Card} from './card';
import {HandEvaluator} from '../poker/hand-evaluator';
import {calculateCardChips} from '../poker/hand-calculator';
import {HandManager} from './hand-manager';
import {RoundManager} from './round-manager';
import {type GameEventChannels} from './game-event-publisher';

/** Cartas repartidas al inicio del nivel (Small Blind). */
const INITIAL_HAND_SIZE = 8;

/**
 * Ejecutor de acciones del juego Balatro.
 *   Cada método público corresponde a una acción del jugador
 *   (iniciar partida, jugar mano, descartar, ordenar).
 *   Tras ejecutar la lógica, emite el evento correspondiente
 *   a través de los canales inyectados en el constructor.
 *
 *   Atributos (3 de estado + 1 de comunicación):
 *   - `deck` / `handManager`: recreados en cada `startGame`.
 *   - `roundManager`: reutilizado y reiniciado entre partidas.
 *   - `channels`: referencia a los trigger del publicador de eventos.
 */
export class GameActions {
  private deck: Deck = new Deck();
  private handManager: HandManager = new HandManager(this.deck);
  private readonly roundManager: RoundManager = new RoundManager();
  private activeSortCriterion: 'rank' | 'suit' = 'rank';

  /**
   * @param channels - Canales de emisión proporcionados por {@link GameEventChannels}.
   * GameActions solo emite; nunca suscribe ni gestiona listeners.
   */
  constructor(private readonly channels: GameEventChannels) {
    this.wireHandManagerEvents();
  }

  // ── Acciones del jugador ──────────────────────────────────────────────────

  /**
   * Crea un mazo fresco, reinicia la ronda, reparte la mano
   *   inicial y emite triggerGameStarted con los datos iniciales.
   */
  startGame(): void {
    this.deck = new Deck();
    this.handManager = new HandManager(this.deck);
    this.wireHandManagerEvents();
    this.roundManager.reset();
    this.handManager.dealInitialHand(INITIAL_HAND_SIZE);
    this.handManager.sortHand(this.activeSortCriterion);
    this.channels.triggerGameStarted({
      hand: this.handManager.getHand(),
      deckRemaining: this.deck.remainingCount(),
      initialHands: this.roundManager.getHandsRemaining(),
      initialDiscards: this.roundManager.getDiscardsRemaining(),
      maxHandSize: this.handManager.getMaxSelectionSize(),
    });
  }

  /**
   * Alterna la selección de una carta en la mano.
   * El {@link HandManager} emite los eventos internos a través del cableado.
   * @param cardIndex Índice de la carta (0-based).
   */
  toggleCard(cardIndex: number): void {
    this.handManager.toggleCard(cardIndex);
  }

  /**
   * Evalúa la selección actual, calcula la puntuación usando
   * únicamente las scoring cards, repone las cartas jugadas y emite
   * triggerHandPlayed con los datos de la jugada.
   * Sin efecto si no hay manos restantes o no hay selección.
   * @returns `false` si la acción no pudo ejecutarse, `true` si sí.
   */
  playHand(): boolean {
    if (this.roundManager.getHandsRemaining() <= 0) return false;
    if (this.handManager.getSelectedCardIndices().size === 0) return false;

    const selectedCards = this.handManager.getSelectedCards();
    const handResult = HandEvaluator.evaluate(selectedCards);
    const cardBonusChips =
      calculateCardChips(handResult.scoringCards);
    const roundScore =
      (handResult.chips + cardBonusChips) * handResult.multiplier;

    const {replacedIndices, replacementCards} =
      this.handManager.discardSelected();
    this.handManager.sortHand(this.activeSortCriterion);
    const totalScore = this.roundManager.registerHandScore(roundScore);

    this.channels.triggerHandPlayed({
      handResult,
      roundScore,
      totalScore,
      handsLeft: this.roundManager.getHandsRemaining(),
      deckRemaining: this.deck.remainingCount(),
      hand: this.handManager.getHand(),
      replacedIndices,
      replacementCards,
    });
    return true;
  }

  /**
   * Descarta las cartas seleccionadas, repone del mazo y emite triggerCardsDiscarded.
   * Sin efecto si no hay descartes restantes o no hay selección.
   * @returns `false` si la acción no pudo ejecutarse, `true` si sí.
   */
  discard(): boolean {
    if (this.roundManager.getDiscardsRemaining() <= 0) return false;
    if (this.handManager.getSelectedCardIndices().size === 0) return false;

    const {replacedIndices, replacementCards} =
      this.handManager.discardSelected();
    this.handManager.sortHand(this.activeSortCriterion);
    this.roundManager.useDiscard();
    this.channels.triggerCardsDiscarded({
      replacementCards,
      replacedIndices,
      deckRemaining: this.deck.remainingCount(),
      discardsLeft: this.roundManager.getDiscardsRemaining(),
      hand: this.handManager.getHand(),
    });
    return true;
  }

  /**
   * Ordena la mano según el criterio indicado.
   * @param criterion 'rank' | 'suit'.
   */
  sortHand(criterion: 'rank' | 'suit'): void {
    this.activeSortCriterion = criterion;
    this.handManager.sortHand(criterion);
  }

  /**
   * Devuelve el criterio de ordenación que está activo en este momento.
   * Usado por BalatroModel para inicializar el botón Sort Hand.
   * @returns 'rank' | 'suit'
   */
  getActiveSortCriterion(): 'rank' | 'suit' {
    return this.activeSortCriterion;
  }

  // ── Consultas de estado (getters para BalatroModel) ───────────────────────

  /** Devuelve el número de manos disponibles restantes. */
  getHandsRemaining(): number {
    return this.roundManager.getHandsRemaining();
  }

  /** Devuelve el número de descartes disponibles restantes. */
  getDiscardsRemaining(): number {
    return this.roundManager.getDiscardsRemaining();
  }

  /** Devuelve el objetivo de puntuación para la ronda actual. */
  getScoreGoal(): number {
    return this.roundManager.getScoreGoal();
  }

  /** Devuelve la puntuación actual de la ronda. */
  getScore(): number {
    return this.roundManager.getScore();
  }

  /** Devuelve la mano actual. */
  getHand(): readonly Card[] {
    return this.handManager.getHand();
  }

  /** Devuelve los índices de las cartas seleccionadas. */
  getSelectedCardIndices(): ReadonlySet<number> {
    return this.handManager.getSelectedCardIndices();
  }

  /** true si el jugador ha superado el objetivo de puntuación, false si no. */
  isVictory(): boolean {
    return this.roundManager.getIsVictory();
  }

  /** true si el jugador se ha quedado sin manos y descartes, false si no. */
  isDefeated(): boolean {
    return this.roundManager.getIsDefeated();
  }

  /** Devuelve la puntuación final del jugador. */
  getFinalScore(): number {
    return this.roundManager.getScore();
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Conecta los eventos internos del {@link HandManager} actual
   * con los canales de emisión. Se llama al inicio y en cada `startGame`.
   */
  private wireHandManagerEvents(): void {
    this.handManager.onCardToggled((data) =>
      this.channels.triggerCardToggled(data));
    this.handManager.onScorePreview((data) =>
      this.channels.triggerScorePreview(data));
  }
}
