/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-detectors.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Tests unitarios de las funciones de detección de jugadas
 *   de póker (hand-detectors.ts). Un describe por función exportada.
 */

import {
  hasNOfAKind,
  hasTwoPair,
  hasFullHouse,
  hasFlush,
  hasStraight,
} from '../../../balatro/model/poker/hand-detectors';
import {Card} from '../../../balatro/model/game/card';
import {describe, it, expect} from 'vitest';

function makeCard(
    rank: number,
    suit: 'spades' | 'hearts' | 'diamonds' | 'clubs' = 'spades',
): Card {
  const LABELS: Record<number, string> = {
    2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
    7: '7', 8: '8', 9: '9', 10: '10',
    11: 'J', 12: 'Q', 13: 'K', 14: 'A',
  };
  return new Card(rank, suit, LABELS[rank] as never, '');
}

describe('hasNOfAKind', () => {
  it('detecta un par', () => {
    expect(hasNOfAKind([makeCard(8), makeCard(8), makeCard(3)], 2)).toBe(true);
  });
  it('detecta un trío', () => {
    expect(hasNOfAKind([makeCard(7), makeCard(7), makeCard(7)], 3)).toBe(true);
  });
  it('detecta un póker', () => {
    const cards = [makeCard(9), makeCard(9), makeCard(9),
      makeCard(9), makeCard(2)];
    expect(hasNOfAKind(cards, 4)).toBe(true);
  });
  it('devuelve false si no hay suficientes repeticiones', () => {
    expect(hasNOfAKind([makeCard(2), makeCard(3), makeCard(4)], 2)).toBe(false);
  });
});

describe('hasTwoPair', () => {
  it('detecta doble par', () => {
    const cards = [makeCard(6), makeCard(6), makeCard(9),
      makeCard(9), makeCard(2)];
    expect(hasTwoPair(cards)).toBe(true);
  });
  it('devuelve false con un solo par', () => {
    expect(hasTwoPair([makeCard(6), makeCard(6), makeCard(9)])).toBe(false);
  });
});

describe('hasFullHouse', () => {
  it('detecta full house con 5 cartas', () => {
    const cards = [
      makeCard(10), makeCard(10), makeCard(10), makeCard(5), makeCard(5),
    ];
    expect(hasFullHouse(cards)).toBe(true);
  });
  it('devuelve false con menos de 5 cartas', () => {
    expect(hasFullHouse([makeCard(10), makeCard(10),
      makeCard(10)])).toBe(false);
  });
});

describe('hasFlush', () => {
  it('detecta color con 5 cartas del mismo palo', () => {
    const cards = [
      makeCard(2, 'clubs'), makeCard(5, 'clubs'), makeCard(7, 'clubs'),
      makeCard(9, 'clubs'), makeCard(13, 'clubs'),
    ];
    expect(hasFlush(cards)).toBe(true);
  });
  it('devuelve false con palos distintos', () => {
    const cards = [
      makeCard(2, 'clubs'), makeCard(5, 'hearts'), makeCard(7, 'clubs'),
      makeCard(9, 'clubs'), makeCard(13, 'clubs'),
    ];
    expect(hasFlush(cards)).toBe(false);
  });
  it('devuelve false con menos de 5 cartas', () => {
    const cards = [makeCard(2, 'clubs'), makeCard(5, 'clubs'),
      makeCard(7, 'clubs'), makeCard(9, 'clubs')];
    expect(hasFlush(cards)).toBe(false);
  });
});

describe('hasStraight', () => {
  it('detecta escalera estándar', () => {
    const cards = [makeCard(3), makeCard(4), makeCard(5),
      makeCard(6), makeCard(7)];
    expect(hasStraight(cards)).toBe(true);
  });
  it('detecta escalera baja A-2-3-4-5', () => {
    const cards = [makeCard(14), makeCard(2), makeCard(3),
      makeCard(4), makeCard(5)];
    expect(hasStraight(cards)).toBe(true);
  });
  it('detecta escalera alta 10-J-Q-K-A', () => {
    const cards = [makeCard(10), makeCard(11), makeCard(12),
      makeCard(13), makeCard(14)];
    expect(hasStraight(cards)).toBe(true);
  });
  it('rechaza wrap-around Q-K-A-2-3', () => {
    const cards = [makeCard(12), makeCard(13), makeCard(14),
      makeCard(2), makeCard(3)];
    expect(hasStraight(cards)).toBe(false);
  });
  it('devuelve false con menos de 5 cartas', () => {
    const cards = [makeCard(3), makeCard(4), makeCard(5), makeCard(6)];
    expect(hasStraight(cards)).toBe(false);
  });
});
