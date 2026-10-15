/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file deck.test.ts
 * @description Tests unitarios de la clase Deck.
 *   Cubre: tamaño inicial, comportamiento de deal(), remainingCount(),
 *   ausencia de duplicados y cobertura de los 4 palos y 13 rangos.
 *
 *   Nota: Deck usa import.meta.env.BASE_URL para construir las rutas de imagen.
 *   En el entorno vitest (jsdom) esa variable no existe, por lo que la imagePath
 *   de cada carta contendrá "undefined/…". Esto es correcto en tests: no
 *   probamos rutas de imagen sino la estructura lógica del mazo.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {Deck} from '../../../balatro/model/game/deck';
import {describe, it, expect} from 'vitest';

/** Número de cartas en una baraja francesa estándar. */
const STANDARD_DECK_SIZE = 52;

describe('Deck', () => {
  describe('remainingCount', () => {
    it('un mazo nuevo debe tener 52 cartas disponibles', () => {
      const deck = new Deck();
      expect(deck.remainingCount()).toBe(STANDARD_DECK_SIZE);
    });

    it('debe decrementar en n tras deal(n)', () => {
      const deck = new Deck();
      deck.deal(5);
      expect(deck.remainingCount()).toBe(STANDARD_DECK_SIZE - 5);
    });

    it('debe llegar a 0 tras repartir todas las cartas', () => {
      const deck = new Deck();
      deck.deal(STANDARD_DECK_SIZE);
      expect(deck.remainingCount()).toBe(0);
    });
  });

  // ── deal ────────────────────────────────────────────────────────────────

  describe('deal', () => {
    it('debe devolver exactamente n cartas cuando quedan suficientes', () => {
      const deck = new Deck();
      const hand = deck.deal(8);
      expect(hand).toHaveLength(8);
    });

    it('cuando quedan menos cartas de las pedidas, devuelve las que quedan', () => {
      const deck = new Deck();
      deck.deal(50);
      const lastCards = deck.deal(5);
      expect(lastCards).toHaveLength(2);
    });

    it('con el mazo agotado, devuelve un array vacío', () => {
      const deck = new Deck();
      deck.deal(STANDARD_DECK_SIZE);
      expect(deck.deal(1)).toHaveLength(0);
    });

    it('las cartas repartidas tienen rank en el rango 2–14', () => {
      const deck = new Deck();
      const cards = deck.deal(STANDARD_DECK_SIZE);
      const allValid = cards.every((card) =>
        card.getRank() >= 2 && card.getRank() <= 14);
      expect(allValid).toBe(true);
    });
  });

  // ── integridad del mazo ────────────────────────────────────────────────

  describe('integridad del mazo', () => {
    it('no debe haber cartas duplicadas (identificadas por label+suit)', () => {
      const deck = new Deck();
      const allCards = deck.deal(STANDARD_DECK_SIZE);
      const identifiers = allCards.map((card) => `${card.getLabel()}-${card.getSuit()}`);
      const uniqueIdentifiers = new Set(identifiers);
      expect(uniqueIdentifiers.size).toBe(STANDARD_DECK_SIZE);
    });

    it('debe cubrir los 4 palos exactamente', () => {
      const deck = new Deck();
      const allCards = deck.deal(STANDARD_DECK_SIZE);
      const suits = new Set(allCards.map((card) => card.getSuit()));
      expect(suits.size).toBe(4);
      expect(suits.has('spades')).toBe(true);
      expect(suits.has('hearts')).toBe(true);
      expect(suits.has('diamonds')).toBe(true);
      expect(suits.has('clubs')).toBe(true);
    });

    it('debe cubrir los 13 rangos numéricos exactamente', () => {
      const deck = new Deck();
      const allCards = deck.deal(STANDARD_DECK_SIZE);
      const ranks = new Set(allCards.map((card) => card.getRank()));
      expect(ranks.size).toBe(13);
    });

    it('debe haber exactamente 4 cartas de cada rango (una por palo)', () => {
      const deck = new Deck();
      const allCards = deck.deal(STANDARD_DECK_SIZE);
      const rankFrequency = new Map<number, number>();
      for (const card of allCards) {
        rankFrequency.set(card.getRank(),
            (rankFrequency.get(card.getRank()) ?? 0) + 1);
      }
      for (const count of rankFrequency.values()) {
        expect(count).toBe(4);
      }
    });
  });
});
