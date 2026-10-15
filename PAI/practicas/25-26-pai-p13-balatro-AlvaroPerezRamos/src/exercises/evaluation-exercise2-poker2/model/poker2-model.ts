/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-model.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Modelo del ejercicio de evaluación Póker-2.
 *   Gestiona un único mazo compartido y dos manos de 5 cartas.
 *   Cuando un jugador pide nueva mano, reparte 5 cartas nuevas sin
 *   devolver las anteriores al mazo.
 *   Tras cada cambio evalúa ambas manos y determina el ganador.
 */

import {Deck} from
  '../../home-work/balatro/model/game/deck';
import {Card} from
  '../../home-work/balatro/model/game/card';
import {HandEvaluator} from
  '../../home-work/balatro/model/poker/hand-evaluator';
import {HAND_DEFINITIONS} from
  '../../home-work/balatro/model/poker/hand-table';
import {Event} from
  '../../home-work/balatro/observer/event';

// ── Constantes ────────────────────────────────────────────────────────────────

/** Número de cartas por mano. */
const HAND_SIZE = 5;

/** Número de jugadores. */
const PLAYER_COUNT = 2;

/** Cartas mínimas necesarias para poder repartir una mano completa. */
const MIN_CARDS_FOR_DEAL = HAND_SIZE;

// ── Tipos ─────────────────────────────────────────────────────────────────────

/** Identificador de jugador. */
export type PlayerIndex = 0 | 1;

/**
 * @interface HandEvaluation
 * Resultado de evaluar una mano: nombre de la jugada y su rango
 * jerárquico (0 = Straight Flush, mayor valor; N = menor valor).
 */
export interface HandEvaluation {
  readonly handName: string;
  /** Índice en HAND_DEFINITIONS: menor índice → mayor jerarquía. */
  readonly rankIndex: number;
}

/**
 * @interface RoundResult
 * Resultado de la ronda tras evaluar ambas manos.
 */
export interface RoundResult {
  readonly firstHandName: string;
  readonly secondHandName: string;
  /** 0 = primer jugador gana, 1 = segundo jugador gana, null = empate. */
  readonly winner: PlayerIndex | null;
}

/**
 * @interface GameStartedData
 * Payload emitido al iniciar la partida.
 */
export interface GameStartedData {
  readonly firstHand: readonly Card[];
  readonly secondHand: readonly Card[];
  readonly result: RoundResult;
  readonly deckRemaining: number;
}

/**
 * @interface NewHandData
 * Payload emitido cuando un jugador recibe una nueva mano.
 */
export interface NewHandData {
  readonly playerIndex: PlayerIndex;
  readonly hand: readonly Card[];
  readonly result: RoundResult;
  readonly deckRemaining: number;
}

// ── Modelo ────────────────────────────────────────────────────────────────────

/**
 * Modelo del juego Póker-2.
 *   Responsabilidades:
 *   - Mantener un mazo compartido y dos manos de 5 cartas.
 *   - Repartir nuevas manos sin restituir las anteriores.
 *   - Evaluar ambas manos y determinar el ganador tras cada cambio.
 *   - Emitir eventos tipados para que el controlador actualice la vista.
 */
export class Poker2Model {
  private deck: Deck = new Deck();
  private readonly hands: [Card[], Card[]] = [[], []];

  // ── Canales de eventos ────────────────────────────────────────────────────
  private readonly gameStartedEvent = new Event<GameStartedData>();
  private readonly newHandEvent = new Event<NewHandData>();
  private readonly deckInsufficientEvent = new Event<void>();

  // ── Suscripción ───────────────────────────────────────────────────────────

  /**
   * Registra un listener para el inicio de partida.
   * @param listener Función llamada con las dos manos iniciales y resultado.
   */
  onGameStarted(listener: (data: GameStartedData) => void): void {
    this.gameStartedEvent.addListener(listener);
  }

  /**
   * Registra un listener para cuando un jugador recibe nueva mano.
   * @param listener Función con índice del jugador, mano y resultado.
   */
  onNewHand(listener: (data: NewHandData) => void): void {
    this.newHandEvent.addListener(listener);
  }

  /**
   * Registra un listener para cuando el mazo no tiene cartas suficientes.
   * @param listener Función invocada sin payload.
   */
  onDeckInsufficient(listener: () => void): void {
    this.deckInsufficientEvent.addListener(listener);
  }

  // ── Acciones ──────────────────────────────────────────────────────────────

  /**
   * Inicializa un mazo nuevo, reparte 5 cartas a cada jugador y emite
   * {@link gameStartedEvent} con las manos iniciales y el resultado.
   */
  startGame(): void {
    this.deck = new Deck();
    for (let i = 0; i < PLAYER_COUNT; i++) {
      this.hands[i as PlayerIndex] = this.deck.deal(HAND_SIZE);
    }
    this.gameStartedEvent.trigger({
      firstHand: [...this.hands[0]],
      secondHand: [...this.hands[1]],
      result: this.evaluateRound(),
      deckRemaining: this.deck.remainingCount(),
    });
  }

  /**
   * Reparte una nueva mano de 5 cartas al jugador indicado sin devolver
   * las anteriores al mazo. Si no hay suficientes cartas emite
   * {@link deckInsufficientEvent} y no modifica el estado.
   * @param playerIndex Índice del jugador (0 = primero, 1 = segundo).
   */
  dealNewHand(playerIndex: PlayerIndex): void {
    if (this.deck.remainingCount() < MIN_CARDS_FOR_DEAL) {
      this.deckInsufficientEvent.trigger(undefined as void);
      return;
    }
    this.hands[playerIndex] = this.deck.deal(HAND_SIZE);
    this.newHandEvent.trigger({
      playerIndex,
      hand: [...this.hands[playerIndex]],
      result: this.evaluateRound(),
      deckRemaining: this.deck.remainingCount(),
    });
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Evalúa ambas manos y construye el {@link RoundResult}.
   * La jerarquía se determina por el índice en HAND_DEFINITIONS:
   * menor índice → mayor valor. High Card (fallback) recibe el índice
   * siguiente al último de la tabla.
   * @returns Resultado con nombres de jugadas y ganador.
   */
  private evaluateRound(): RoundResult {
    const firstEval = this.evaluateHand(this.hands[0]);
    const secondEval = this.evaluateHand(this.hands[1]);

    let winner: PlayerIndex | null;
    if (firstEval.rankIndex < secondEval.rankIndex) {
      winner = 0;
    } else if (secondEval.rankIndex < firstEval.rankIndex) {
      winner = 1;
    } else {
      winner = null;
    }

    return {
      firstHandName: firstEval.handName,
      secondHandName: secondEval.handName,
      winner,
    };
  }

  /**
   * Evalúa una mano y devuelve su nombre y rango jerárquico.
   * @param hand Cartas de la mano a evaluar.
   * @returns Nombre de la jugada e índice en HAND_DEFINITIONS.
   */
  private evaluateHand(hand: readonly Card[]): HandEvaluation {
    const handResult = HandEvaluator.evaluate(hand);
    const rankIndex = HAND_DEFINITIONS.findIndex(
        (definition) => definition.name === handResult.handName,
    );
    // High Card no está en HAND_DEFINITIONS: le asignamos el índice
    // siguiente al último, garantizando que siempre es el de menor valor.
    const resolvedRankIndex =
      rankIndex === -1 ? HAND_DEFINITIONS.length : rankIndex;
    return {
      handName: handResult.handName,
      rankIndex: resolvedRankIndex,
    };
  }
}
