/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-evaluator.test.ts
 * @description Tests unitarios de HandEvaluator.
 *   Un describe por jugada de póker. Cubre: detección correcta de cada
 *   jugada, valores de chips y multiplicador, casos límite (escalera baja
 *   A-2-3-4-5, escalera alta 10-J-Q-K-A, wrap-around inválido Q-K-A-2-3,
 *   Full House con menos de 5 cartas) y fallback a High Card.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HandEvaluator} from '../../../balatro/model/poker/hand-evaluator';
import {Card} from '../../../balatro/model/game/card';
import {type HandResult} from '../../../balatro/types/hand-result';
import {describe, it, expect} from 'vitest';

// ── Utilidad de construcción ───────────────────────────────────────────────────

/**
 * Crea una carta de test con los valores mínimos que usa HandEvaluator.
 * La imagePath queda vacía: no influye en la lógica de evaluación.
 * @param rank Valor numérico (2–14, donde 14 es el As).
 * @param suit Palo de la carta.
 * @returns Instancia de Card lista para los tests.
 */
function makeCard(
    rank: number,
    suit: 'spades' | 'hearts' | 'diamonds' | 'clubs' = 'spades',
): Card {
  const RANK_TO_LABEL: Record<number, string> = {
    2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
    7: '7', 8: '8', 9: '9', 10: '10',
    11: 'J', 12: 'Q', 13: 'K', 14: 'A',
  };
  return new Card(rank, suit, RANK_TO_LABEL[rank] as never, '');
}

/**
 * Afirma que evaluate devuelve la jugada con el nombre esperado.
 * @param cards    Cartas a evaluar.
 * @param expected Nombre exacto de la jugada esperada.
 */
function expectHandName(cards: Card[], expected: string): void {
  const result: HandResult = HandEvaluator.evaluate(cards);
  expect(result.handName).toBe(expected);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HandEvaluator', () => {
  describe('evaluate — array vacío', () => {
    it('con 0 cartas debe devolver High Card', () => {
      expectHandName([], 'High Card');
    });
  });

  // ── Straight Flush ────────────────────────────────────────────────────

  describe('Straight Flush', () => {
    it('debe detectar una escalera de color estándar', () => {
      const cards = [
        makeCard(7, 'hearts'), makeCard(8, 'hearts'), makeCard(9, 'hearts'),
        makeCard(10, 'hearts'), makeCard(11, 'hearts'),
      ];
      expectHandName(cards, 'Straight Flush');
    });

    it('debe devolver chips=100 y multiplier=8', () => {
      const cards = [
        makeCard(7, 'hearts'), makeCard(8, 'hearts'), makeCard(9, 'hearts'),
        makeCard(10, 'hearts'), makeCard(11, 'hearts'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(100);
      expect(result.multiplier).toBe(8);
    });

    it('no debe detectar Straight Flush si las cartas no son del mismo palo', () => {
      const cards = [
        makeCard(7, 'hearts'), makeCard(8, 'spades'), makeCard(9, 'hearts'),
        makeCard(10, 'hearts'), makeCard(11, 'hearts'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.handName).not.toBe('Straight Flush');
    });
  });

  // ── Four of a Kind ────────────────────────────────────────────────────

  describe('Four of a Kind', () => {
    it('debe detectar cuatro cartas del mismo rango', () => {
      const cards = [
        makeCard(9, 'spades'), makeCard(9, 'hearts'),
        makeCard(9, 'diamonds'), makeCard(9, 'clubs'), makeCard(2, 'spades'),
      ];
      expectHandName(cards, 'Four of a Kind');
    });

    it('debe devolver chips=60 y multiplier=7', () => {
      const cards = [
        makeCard(9, 'spades'), makeCard(9, 'hearts'),
        makeCard(9, 'diamonds'), makeCard(9, 'clubs'), makeCard(2, 'spades'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(60);
      expect(result.multiplier).toBe(7);
    });
  });

  // ── Full House ────────────────────────────────────────────────────────

  describe('Full House', () => {
    it('debe detectar trío + par con 5 cartas', () => {
      const cards = [
        makeCard(10, 'spades'), makeCard(10, 'hearts'), makeCard(10, 'diamonds'),
        makeCard(5, 'clubs'), makeCard(5, 'spades'),
      ];
      expectHandName(cards, 'Full House');
    });

    it('debe devolver chips=40 y multiplier=4', () => {
      const cards = [
        makeCard(10, 'spades'), makeCard(10, 'hearts'), makeCard(10, 'diamonds'),
        makeCard(5, 'clubs'), makeCard(5, 'spades'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(40);
      expect(result.multiplier).toBe(4);
    });

    it('con menos de 5 cartas NO debe detectar Full House', () => {
      // Trío solo (sin el par): imposible tener Full House
      const cards = [
        makeCard(10, 'spades'), makeCard(10, 'hearts'), makeCard(10, 'diamonds'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.handName).not.toBe('Full House');
    });
  });

  // ── Flush ─────────────────────────────────────────────────────────────

  describe('Flush', () => {
    it('debe detectar 5 cartas del mismo palo (no escalera)', () => {
      const cards = [
        makeCard(2, 'clubs'), makeCard(5, 'clubs'), makeCard(7, 'clubs'),
        makeCard(9, 'clubs'), makeCard(13, 'clubs'),
      ];
      expectHandName(cards, 'Flush');
    });

    it('debe devolver chips=35 y multiplier=4', () => {
      const cards = [
        makeCard(2, 'clubs'), makeCard(5, 'clubs'), makeCard(7, 'clubs'),
        makeCard(9, 'clubs'), makeCard(13, 'clubs'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(35);
      expect(result.multiplier).toBe(4);
    });

    it('4 cartas del mismo palo NO es Flush', () => {
      const cards = [
        makeCard(2, 'clubs'), makeCard(5, 'clubs'),
        makeCard(7, 'clubs'), makeCard(9, 'clubs'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.handName).not.toBe('Flush');
    });
  });

  // ── Straight ──────────────────────────────────────────────────────────

  describe('Straight', () => {
    it('debe detectar una escalera normal de distintos palos', () => {
      const cards = [
        makeCard(3, 'spades'), makeCard(4, 'hearts'), makeCard(5, 'diamonds'),
        makeCard(6, 'clubs'), makeCard(7, 'spades'),
      ];
      expectHandName(cards, 'Straight');
    });

    it('debe detectar la escalera baja A-2-3-4-5', () => {
      const cards = [
        makeCard(14, 'spades'), makeCard(2, 'hearts'), makeCard(3, 'diamonds'),
        makeCard(4, 'clubs'), makeCard(5, 'spades'),
      ];
      expectHandName(cards, 'Straight');
    });

    it('debe detectar la escalera alta 10-J-Q-K-A', () => {
      const cards = [
        makeCard(10, 'spades'), makeCard(11, 'hearts'), makeCard(12, 'diamonds'),
        makeCard(13, 'clubs'), makeCard(14, 'spades'),
      ];
      expectHandName(cards, 'Straight');
    });

    it('Q-K-A-2-3 (wrap-around) NO debe ser escalera', () => {
      const cards = [
        makeCard(12, 'spades'), makeCard(13, 'hearts'), makeCard(14, 'diamonds'),
        makeCard(2, 'clubs'), makeCard(3, 'spades'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.handName).not.toBe('Straight');
      expect(result.handName).not.toBe('Straight Flush');
    });

    it('con menos de 5 cartas NO debe detectar Straight', () => {
      const cards = [
        makeCard(3, 'spades'), makeCard(4, 'hearts'), makeCard(5, 'diamonds'),
        makeCard(6, 'clubs'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.handName).not.toBe('Straight');
    });

    it('debe devolver chips=30 y multiplier=4', () => {
      const cards = [
        makeCard(3, 'spades'), makeCard(4, 'hearts'), makeCard(5, 'diamonds'),
        makeCard(6, 'clubs'), makeCard(7, 'spades'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(30);
      expect(result.multiplier).toBe(4);
    });
  });

  // ── Three of a Kind ───────────────────────────────────────────────────

  describe('Three of a Kind', () => {
    it('debe detectar tres cartas del mismo rango', () => {
      const cards = [
        makeCard(7, 'spades'), makeCard(7, 'hearts'), makeCard(7, 'diamonds'),
        makeCard(2, 'clubs'), makeCard(4, 'spades'),
      ];
      expectHandName(cards, 'Three of a Kind');
    });

    it('debe devolver chips=30 y multiplier=3', () => {
      const cards = [
        makeCard(7, 'spades'), makeCard(7, 'hearts'), makeCard(7, 'diamonds'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(30);
      expect(result.multiplier).toBe(3);
    });
  });

  // ── Two Pair ──────────────────────────────────────────────────────────

  describe('Two Pair', () => {
    it('debe detectar dos pares distintos', () => {
      const cards = [
        makeCard(6, 'spades'), makeCard(6, 'hearts'),
        makeCard(9, 'diamonds'), makeCard(9, 'clubs'), makeCard(2, 'spades'),
      ];
      expectHandName(cards, 'Two Pair');
    });

    it('debe devolver chips=20 y multiplier=2', () => {
      const cards = [
        makeCard(6, 'spades'), makeCard(6, 'hearts'),
        makeCard(9, 'diamonds'), makeCard(9, 'clubs'),
      ];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(20);
      expect(result.multiplier).toBe(2);
    });
  });

  // ── Pair ──────────────────────────────────────────────────────────────

  describe('Pair', () => {
    it('debe detectar un par', () => {
      const cards = [
        makeCard(8, 'spades'), makeCard(8, 'hearts'),
        makeCard(3, 'diamonds'), makeCard(5, 'clubs'), makeCard(13, 'spades'),
      ];
      expectHandName(cards, 'Pair');
    });

    it('debe devolver chips=10 y multiplier=2', () => {
      const cards = [makeCard(8, 'spades'), makeCard(8, 'hearts')];
      const result = HandEvaluator.evaluate(cards);
      expect(result.chips).toBe(10);
      expect(result.multiplier).toBe(2);
    });
  });

  // ── High Card ─────────────────────────────────────────────────────────

  describe('High Card', () => {
    it('debe devolver High Card cuando ninguna jugada aplica', () => {
      const cards = [
        makeCard(2, 'spades'), makeCard(5, 'hearts'),
        makeCard(7, 'diamonds'), makeCard(9, 'clubs'), makeCard(13, 'spades'),
      ];
      expectHandName(cards, 'High Card');
    });

    it('debe devolver chips=5 y multiplier=1', () => {
      const result = HandEvaluator.evaluate([makeCard(2, 'spades')]);
      expect(result.chips).toBe(5);
      expect(result.multiplier).toBe(1);
    });
  });
});
