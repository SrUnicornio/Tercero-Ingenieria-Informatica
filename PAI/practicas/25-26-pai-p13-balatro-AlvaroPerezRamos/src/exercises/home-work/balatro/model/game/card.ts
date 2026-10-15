/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file card.ts (model/game/card.ts)
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Carta inmutable de la baraja francesa. Almacena su rango
 *   numérico, palo, etiqueta visual y ruta de imagen. No contiene lógica
 *   de juego: es un modelo de datos puro e inmutable (value object).
 */

import {type Suit, type RankLabel} from '../../types/card-types';

/**
 * Representación inmutable de una carta de la baraja francesa.
 */
export class Card {
  // Propiedades privadas de la carta, inicializadas en el constructor.
  private readonly rankValue: number;
  private readonly suitValue: Suit;
  private readonly labelValue: RankLabel;
  private readonly imagePathValue: string;

  /**
   * @param rankValue -Valor numérico (2–14, donde 14 es el As).
   * @param suitValue - Palo de la carta.
   * @param labelValue - Etiqueta visible ('2'–'10', 'J', 'Q', 'K', 'A').
   * @param imagePathValue - Ruta al fichero SVG, construida por Deck.
   */
  constructor(
      rankValue: number,
      suitValue: Suit,
      labelValue: RankLabel,
      imagePathValue: string,
  ) {
    this.rankValue = rankValue;
    this.suitValue = suitValue;
    this.labelValue = labelValue;
    this.imagePathValue = imagePathValue;
  }

  /**
   * Valor numérico de la carta (2–14, donde 14 es el As).
   * @returns Valor numérico de la carta.
   */
  getRank(): number {
    return this.rankValue;
  }

  /**
   * Palo de la carta.
   * @returns Palo de la carta.
   */
  getSuit(): Suit {
    return this.suitValue;
  }

  /**
   * Etiqueta visible de la carta.
   * @returns Etiqueta visible de la carta.
   */
  getLabel(): RankLabel {
    return this.labelValue;
  }

  /**
   * Ruta al fichero SVG de la carta.
   * @returns Ruta al fichero SVG de la carta.
   */
  getImagePath(): string {
    return this.imagePathValue;
  }

  /**
   * Representación textual de la carta, útil para depuración y tests.
   * @returns Cadena con etiqueta y símbolo del palo (p.ej. "A♠", "10♥").
   */
  toString(): string {
    const SUIT_SYMBOLS: Record<Suit, string> = {
      spades: '♠',
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
    };
    return `${this.labelValue}${SUIT_SYMBOLS[this.suitValue]}`;
  }
}
