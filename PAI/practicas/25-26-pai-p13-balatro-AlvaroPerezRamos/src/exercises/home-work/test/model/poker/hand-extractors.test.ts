/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-extractors.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Tests unitarios de las funciones de extracción de scoring cards
 *   (hand-extractors.ts). Verifica que cada extractor devuelve exactamente
 *   las cartas correctas para su jugada.
 */

import {
  extractNOfAKind,
  extractTwoPair,
  extractAllCards,
  extractHighCard,
} from '../../../balatro/model/poker/hand-extractors';
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

describe('extractNOfAKind', () => {
  it('extrae exactamente 2 cartas del par', () => {
    const ace1 = makeCard(14, 'clubs');
    const ace2 = makeCard(14, 'diamonds');
    const king = makeCard(13, 'hearts');
    const result = extractNOfAKind([ace1, ace2, king], 2);
    expect(result).toHaveLength(2);
    expect(result).toContain(ace1);
    expect(result).toContain(ace2);
    expect(result).not.toContain(king);
  });

  it('extrae exactamente 3 cartas del trío', () => {
    const cards = [makeCard(7), makeCard(7), makeCard(7),
      makeCard(2), makeCard(4)];
    const result = extractNOfAKind(cards, 3);
    expect(result).toHaveLength(3);
    result.forEach((card) => expect(card.getRank()).toBe(7));
  });

  it('extrae exactamente 4 cartas del póker', () => {
    const cards = [makeCard(9), makeCard(9), makeCard(9),
      makeCard(9), makeCard(2)];
    const result = extractNOfAKind(cards, 4);
    expect(result).toHaveLength(4);
    result.forEach((card) => expect(card.getRank()).toBe(9));
  });

  it('devuelve [] si no existe el rango dominante', () => {
    expect(extractNOfAKind([makeCard(2), makeCard(3)], 3)).toHaveLength(0);
  });
});

describe('extractTwoPair', () => {
  it('extrae las 4 cartas de los dos pares', () => {
    const k1 = makeCard(13, 'clubs');
    const k2 = makeCard(13, 'diamonds');
    const f1 = makeCard(5, 'hearts');
    const f2 = makeCard(5, 'spades');
    const ace = makeCard(14, 'clubs');
    const result = extractTwoPair([k1, k2, f1, f2, ace]);
    expect(result).toHaveLength(4);
    expect(result).toContain(k1);
    expect(result).toContain(k2);
    expect(result).toContain(f1);
    expect(result).toContain(f2);
    expect(result).not.toContain(ace);
  });
});

describe('extractAllCards', () => {
  it('devuelve todas las cartas recibidas', () => {
    const cards = [makeCard(3), makeCard(5), makeCard(7)];
    expect(extractAllCards(cards)).toHaveLength(3);
  });
});

describe('extractHighCard', () => {
  it('devuelve solo la carta de mayor rango', () => {
    const cards = [makeCard(2), makeCard(13), makeCard(7)];
    const result = extractHighCard(cards);
    expect(result).toHaveLength(1);
    expect(result[0].getRank()).toBe(13);
  });

  it('devuelve [] con array vacío', () => {
    expect(extractHighCard([])).toHaveLength(0);
  });
});
