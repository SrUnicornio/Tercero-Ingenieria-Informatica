/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-extractors.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Funciones puras de extracción de scoring cards para cada
 *   jugada de póker. Devuelven el subconjunto de cartas seleccionadas que
 *   realmente contribuyen chips de bonificación según la regla de Balatro:
 *   solo las cartas que forman la jugada suman sus chips.
 *
 *   Todas las funciones son puras y se exportan para ser consumidas por
 *   {@link HAND_DEFINITIONS} en hand-evaluator.ts y por los tests unitarios.
 */

import {Card} from '../game/card';
import {buildRankFrequencyMap} from './hand-detectors';

/**
 * @function extractNOfAKind
 * Devuelve exactamente N cartas que comparten el rango dominante
 *   (el de mayor frecuencia con al menos N apariciones).
 *
 *   Ejemplo: [A♣, A♦, K♥] con N=2 → [A♣, A♦].
 *
 * @param cards       Cartas a analizar.
 * @param repetitions Cartas iguales que forman la jugada (2=par, 3=trío, 4=póker).
 * @returns Array con exactamente `repetitions` cartas del rango dominante.
 */
export function extractNOfAKind(
    cards: readonly Card[],
    repetitions: number,
): readonly Card[] {
  const rankFrequency = buildRankFrequencyMap(cards);
  const dominantRank = [...rankFrequency.entries()]
      .find(([, count]) => count >= repetitions)?.[0];

  if (dominantRank === undefined) return [];

  return cards
      .filter((card) => card.getRank() === dominantRank)
      .slice(0, repetitions);
}

/**
 * @function extractTwoPair
 * Devuelve las 4 cartas que forman el doble par:
 *   2 del par de mayor rango + 2 del par de menor rango.
 *
 *   Ejemplo: [K♣, K♦, 5♥, 5♠, A♣] → [K♣, K♦, 5♥, 5♠].
 *
 * @param cards Cartas a analizar.
 * @returns Array con las 4 cartas de los dos pares.
 */
export function extractTwoPair(cards: readonly Card[]): readonly Card[] {
  const rankFrequency = buildRankFrequencyMap(cards);
  const pairRanks = [...rankFrequency.entries()]
      .filter(([, count]) => count >= 2)
      .map(([rank]) => rank)
      .sort((rankA, rankB) => rankB - rankA)
      .slice(0, 2);

  const scoringCards: Card[] = [];
  for (const pairRank of pairRanks) {
    const pairCards = cards
        .filter((card) => card.getRank() === pairRank)
        .slice(0, 2);
    scoringCards.push(...pairCards);
  }
  return scoringCards;
}

/**
 * @function extractAllCards
 * Devuelve todas las cartas recibidas como scoring cards.
 *   Usado para jugadas en las que todas las cartas contribuyen:
 *   Straight Flush, Full House, Flush, Straight.
 * @param cards Cartas a analizar.
 * @returns Copia superficial del array de entrada.
 */
export function extractAllCards(cards: readonly Card[]): readonly Card[] {
  return [...cards];
}

/**
 * @function extractHighCard
 * Devuelve únicamente la carta de mayor rango.
 *   Usada cuando la jugada es High Card.
 * @param cards Cartas a analizar (puede ser vacío).
 * @returns Array con la carta de mayor rango, o vacío si no hay cartas.
 */
export function extractHighCard(cards: readonly Card[]): readonly Card[] {
  if (cards.length === 0) return [];
  const sorted = [...cards].sort(
      (cardA, cardB) => cardB.getRank() - cardA.getRank(),
  );
  return [sorted[0]];
}
