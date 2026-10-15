/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-model.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Modelo del ejercicio de evaluación Póker-1.
 *   Gestiona una mano de 5 cartas y un mazo de 52.
 *   Cuando el jugador clica una carta, la sustituye por la carta
 *   del mismo palo con rango inmediatamente superior o inferior
 *   (según el modo activo), sacándola del mazo.
 *
 *   IMPORTANTE: en este ejercicio el As vale 1 (rango mínimo),
 *   no 14 como en Balatro. El orden es A(1) < 2 < 3 < ... < K(13).
 *   Para este reordenamiento se usa un mapa de conversión local;
 *   la clase Card de Balatro no se modifica.
 */

import {Card} from
  '../../home-work/balatro/model/game/card';
import {type Suit, type RankLabel} from
  '../../home-work/balatro/types/card-types';
import {Event} from
  '../../home-work/balatro/observer/event';

// ── Tipos de eventos ──────────────────────────────────────────────────────────

/** Payload emitido al iniciar la partida. */
export interface GameStartedData {
  readonly hand: readonly Card[];
}

/** Payload emitido al sustituir una carta con éxito. */
export interface CardReplacedData {
  readonly slotIndex: number;
  readonly newCard: Card;
}

// ── Constantes de rango ───────────────────────────────────────────────────────

/**
 * Orden de rangos para este ejercicio: As = 1 (mínimo), K = 13 (máximo).
 * El valor numérico que almacena Card (14 para el As) no coincide con
 * el orden del enunciado, por lo que se usa este mapa de conversión.
 */
const POKER1_RANK_ORDER: ReadonlyMap<RankLabel, number> = new Map([
  ['A', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5],
  ['6', 6], ['7', 7], ['8', 8], ['9', 9], ['10', 10],
  ['J', 11], ['Q', 12], ['K', 13],
]);

/** Número de cartas en la mano inicial. */
const HAND_SIZE = 5;

/** Número total de cartas en la baraja. */
const DECK_SIZE = 52;

/** Ruta base de las imágenes SVG (igual que en Deck de Balatro). */
const CARD_IMAGE_BASE_PATH =
  `${import.meta.env.BASE_URL}img/SVG-cards-1.3`;

/** Prefijo de fichero SVG para cada etiqueta de rango. */
const FILE_PREFIX_BY_LABEL: ReadonlyMap<RankLabel, string> = new Map([
  ['A', 'ace'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
  ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'],
  ['J', 'jack'], ['Q', 'queen'], ['K', 'king'],
]);

/** Nombre de fichero SVG para cada palo. */
const FILE_NAME_BY_SUIT: ReadonlyMap<Suit, string> = new Map([
  ['spades', 'spades'], ['hearts', 'hearts'],
  ['diamonds', 'diamonds'], ['clubs', 'clubs'],
]);

// ── Helpers de construcción del mazo ─────────────────────────────────────────

/**
 * Construye las 52 cartas de la baraja francesa.
 * @returns Array con las 52 cartas sin barajar.
 */
function buildFullDeck(): Card[] {
  const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  const labels = [...POKER1_RANK_ORDER.keys()] as RankLabel[];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const label of labels) {
      const rank = POKER1_RANK_ORDER.get(label)!;
      const filePrefix = FILE_PREFIX_BY_LABEL.get(label)!;
      const suitFile = FILE_NAME_BY_SUIT.get(suit)!;
      const imagePath =
        `${CARD_IMAGE_BASE_PATH}/${filePrefix}_of_${suitFile}.svg`;
      deck.push(new Card(rank, suit, label, imagePath));
    }
  }
  return deck;
}

/**
 * Baraja un array in-place con el algoritmo Fisher-Yates.
 * @param cards Array a barajar.
 */
function shuffleInPlace(cards: Card[]): void {
  for (let i = cards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }
}

// ── Modelo ────────────────────────────────────────────────────────────────────

/**
 * Modelo del juego Póker-1.
 *   Responsabilidades:
 *   - Construir y barajar un mazo de 52 cartas.
 *   - Repartir una mano inicial de 5 cartas.
 *   - Sustituir una carta de la mano por la carta del mazo del mismo palo
 *     con rango inmediatamente superior o inferior según el modo activo.
 *   - Emitir eventos tipados para que el controlador actualice la vista.
 */
export class Poker1Model {
  /** Cartas que aún no han sido repartidas ni usadas como sustitución. */
  private deckCards: Card[] = [];
  /** Mano actual del jugador (5 slots). */
  private handCards: Card[] = [];

  // ── Canales de eventos ────────────────────────────────────────────────────
  private readonly gameStartedEvent = new Event<GameStartedData>();
  private readonly cardReplacedEvent = new Event<CardReplacedData>();
  private readonly noSuitableCardEvent = new Event<void>();
  private readonly deckEmptyEvent = new Event<void>();

  // ── Suscripción a eventos ─────────────────────────────────────────────────

  /**
   * Registra un listener para el inicio de partida.
   * @param listener Función llamada con la mano inicial.
   */
  onGameStarted(listener: (data: GameStartedData) => void): void {
    this.gameStartedEvent.addListener(listener);
  }

  /**
   * Registra un listener para la sustitución exitosa de una carta.
   * @param listener Función llamada con el slot y la carta nueva.
   */
  onCardReplaced(listener: (data: CardReplacedData) => void): void {
    this.cardReplacedEvent.addListener(listener);
  }

  /**
   * Registra un listener para cuando no hay carta adecuada en el mazo.
   * @param listener Función invocada sin payload.
   */
  onNoSuitableCard(listener: () => void): void {
    this.noSuitableCardEvent.addListener(listener);
  }

  /**
   * Registra un listener para cuando el mazo está vacío.
   * @param listener Función invocada sin payload.
   */
  onDeckEmpty(listener: () => void): void {
    this.deckEmptyEvent.addListener(listener);
  }

  // ── Acciones ──────────────────────────────────────────────────────────────

  /**
   * Inicializa el mazo, lo baraja y reparte la mano inicial de 5 cartas.
   * Emite {@link gameStartedEvent} con la mano inicial.
   */
  startGame(): void {
    this.deckCards = buildFullDeck();
    shuffleInPlace(this.deckCards);
    this.handCards = this.deckCards.splice(0, HAND_SIZE);
    this.gameStartedEvent.trigger({hand: [...this.handCards]});
  }

  /**
   * Intenta sustituir la carta en `slotIndex` por la carta del mazo del
   *   mismo palo con rango inmediatamente superior (modo mayor) o
   *   inmediatamente inferior (modo menor).
   *
   *   Prioridad de comprobaciones:
   *   1. Si el mazo está vacío → emite {@link deckEmptyEvent}.
   *   2. Si no existe carta adecuada → emite {@link noSuitableCardEvent}.
   *   3. Si existe → sustituye, emite {@link cardReplacedEvent}.
   *
   * @param slotIndex  Índice de la carta a sustituir (0-based).
   * @param wantHigher `true` para buscar mayor valor; `false` para menor.
   */
  replaceCard(slotIndex: number, wantHigher: boolean): void {
    if (this.deckCards.length === 0) {
      this.deckEmptyEvent.trigger(undefined as void);
      return;
    }

    const currentCard = this.handCards[slotIndex];
    const currentRank = POKER1_RANK_ORDER.get(
        currentCard.getLabel() as RankLabel,
    )!;
    const targetIndex = this.findTargetCardIndex(
        currentCard.getSuit(),
        currentRank,
        wantHigher,
    );

    if (targetIndex === -1) {
      this.noSuitableCardEvent.trigger(undefined as void);
      return;
    }

    const [newCard] = this.deckCards.splice(targetIndex, 1);
    this.handCards[slotIndex] = newCard;
    this.cardReplacedEvent.trigger({slotIndex, newCard});
  }

  // ── Consultas ─────────────────────────────────────────────────────────────

  /**
   * Devuelve el número de cartas disponibles en el mazo.
   * @returns Cartas restantes sin repartir.
   */
  getDeckSize(): number {
    return this.deckCards.length;
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Busca en el mazo la carta del mismo palo con rango inmediatamente
   *   superior (si `wantHigher`) o inferior (si no) al rango dado.
   *   De entre todos los candidatos válidos, elige el de menor distancia
   *   al rango actual para garantizar "inmediatamente adyacente".
   *
   * @param suit        Palo que debe tener la carta buscada.
   * @param currentRank Rango actual de la carta a sustituir (1–13).
   * @param wantHigher  `true` para buscar mayor; `false` para menor.
   * @returns Índice en `deckCards` de la mejor carta encontrada, o -1.
   */
  private findTargetCardIndex(
      suit: Suit,
      currentRank: number,
      wantHigher: boolean,
  ): number {
    let bestIndex = -1;
    let bestRank = wantHigher ? DECK_SIZE : -1;

    this.deckCards.forEach((card, index) => {
      if (card.getSuit() !== suit) return;
      const cardRank = POKER1_RANK_ORDER.get(
          card.getLabel() as RankLabel,
      )!;
      if (wantHigher && cardRank > currentRank && cardRank < bestRank) {
        bestRank = cardRank;
        bestIndex = index;
      }
      if (!wantHigher && cardRank < currentRank && cardRank > bestRank) {
        bestRank = cardRank;
        bestIndex = index;
      }
    });

    return bestIndex;
  }
}
