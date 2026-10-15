/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file deck.ts (model/game/deck.ts)
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Mazo de 52 cartas de la baraja francesa. Genera las cartas,
 *   las baraja con el algoritmo Fisher-Yates y las reparte al modelo bajo
 *   demanda. Usa las imágenes SVG del directorio public/img/SVG-cards-1.3.
 */

import {Card} from './card';
import {type Suit, type RankLabel} from '../../types/card-types';

/**
 * Ruta base de las imágenes SVG de las cartas, relativa al directorio public/.
 * `import.meta.env.BASE_URL` es inyectado por Vite; en desarrollo es '/',
 * en producción es el base configurado en vite.config.ts.
 */
const CARD_IMAGE_BASE_PATH = `${import.meta.env.BASE_URL}img/SVG-cards-1.3`;

/** Número total de cartas en una baraja francesa estándar. */
const STANDARD_DECK_SIZE = 52;

/**
 * Definición de rango: valor numérico, etiqueta visual y prefijo del
 * nombre de fichero SVG (p.ej. "ace", "jack", "10").
 */
interface RankDefinition {
  readonly rank: number;
  readonly label: RankLabel;
  readonly filePrefix: string;
}

/**
 * Los 13 rangos en orden ascendente de valor.
 * `filePrefix` coincide con el nombre usado en los SVG del directorio
 * public/img/SVG-cards-1.3 (p.ej. "jack_of_spades.svg").
 */
const RANK_DEFINITIONS: readonly RankDefinition[] = [
  {rank: 2, label: '2', filePrefix: '2'},
  {rank: 3, label: '3', filePrefix: '3'},
  {rank: 4, label: '4', filePrefix: '4'},
  {rank: 5, label: '5', filePrefix: '5'},
  {rank: 6, label: '6', filePrefix: '6'},
  {rank: 7, label: '7', filePrefix: '7'},
  {rank: 8, label: '8', filePrefix: '8'},
  {rank: 9, label: '9', filePrefix: '9'},
  {rank: 10, label: '10', filePrefix: '10'},
  {rank: 11, label: 'J', filePrefix: 'jack'},
  {rank: 12, label: 'Q', filePrefix: 'queen'},
  {rank: 13, label: 'K', filePrefix: 'king'},
  {rank: 14, label: 'A', filePrefix: 'ace'},
];

/** Los cuatro palos con su nombre tal como aparece en los ficheros SVG. */
const SUIT_FILE_NAMES: readonly {suit: Suit; fileName: string}[] = [
  {suit: 'spades', fileName: 'spades'},
  {suit: 'hearts', fileName: 'hearts'},
  {suit: 'diamonds', fileName: 'diamonds'},
  {suit: 'clubs', fileName: 'clubs'},
];

/**
 * Mazo de cartas de la baraja francesa. Genera las 52 cartas,
 *   las baraja con el algoritmo Fisher-Yates y reparte al modelo bajo
 *   demanda. Cada carta conoce su propia ruta de imagen SVG.
 */
export class Deck {
  // Cartas del mazo, barajadas. `dealIndex` indica la siguiente carta a repartir.
  private readonly cards: Card[];
  private dealIndex: number = 0;

  constructor() {
    this.cards = this.buildDeck();
    this.shuffle();
  }

  /**
   * Número de cartas que aún no han sido repartidas.
   * @returns Cartas disponibles en el mazo.
   */
  remainingCount(): number {
    return STANDARD_DECK_SIZE - this.dealIndex;
  }

  /**
   * Reparte las siguientes `count` cartas del mazo.
   * @param count Número de cartas a repartir.
   * @returns Array de cartas repartidas (puede ser más corto que `count`).
   */
  deal(count: number): Card[] {
    const available = Math.min(count, this.remainingCount());
    const dealt = this.cards.slice(this.dealIndex, this.dealIndex + available);
    this.dealIndex += available;
    return dealt;
  }

  /**
   * Construye el mazo de 52 cartas combinando los 13 rangos con los 4 palos.
   * Cada carta se inicializa con su valor numérico, palo, etiqueta visual y ruta de imagen.
   * @returns Array con las 52 cartas sin barajar.
   */
  private buildDeck(): Card[] {
    const deck: Card[] = [];
    for (const {suit, fileName: suitFileName} of SUIT_FILE_NAMES) {
      for (const {rank, label, filePrefix} of RANK_DEFINITIONS) {
        const imagePath =
          `${CARD_IMAGE_BASE_PATH}/${filePrefix}_of_${suitFileName}.svg`;
        deck.push(new Card(rank, suit, label, imagePath));
      }
    }
    return deck;
  }

  /**
   * Baraja las cartas in-place con el algoritmo Fisher-Yates.
   * Garantiza una distribución uniforme de todas las permutaciones posibles.
   */
  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[randomIndex]] =
        [this.cards[randomIndex], this.cards[i]];
    }
  }
}
