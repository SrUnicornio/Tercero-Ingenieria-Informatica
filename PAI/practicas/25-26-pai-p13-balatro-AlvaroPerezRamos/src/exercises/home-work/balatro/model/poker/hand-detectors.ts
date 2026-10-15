/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-detectors.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Funciones puras de detección de jugadas de póker.
 *   Cada función recibe las cartas seleccionadas y devuelve un booleano.
 *   No contienen lógica de extracción ni de puntuación: esa responsabilidad
 *   pertenece a {@link hand-extractors.ts} y a {@link HandEvaluator}.
 *
 *   Todas las funciones son puras (sin efectos laterales) y se exportan
 *   para ser consumidas por {@link HAND_DEFINITIONS} en hand-evaluator.ts
 *   y por los tests unitarios.
 */

import {Card} from '../game/card';

// ── Utilidad interna compartida ───────────────────────────────────────────────

/**
 * @function buildRankFrequencyMap
 * Construye un mapa rango → frecuencia para las cartas dadas.
 * @param cards Cartas a analizar.
 * @returns Map<rango numérico, número de apariciones>.
 */
export function buildRankFrequencyMap(
    cards: readonly Card[],
): Map<number, number> {
  const frequencyMap = new Map<number, number>();
  for (const card of cards) {
    frequencyMap.set(
        card.getRank(),
        (frequencyMap.get(card.getRank()) ?? 0) + 1,
    );
  }
  return frequencyMap;
}

// ── Detectores ────────────────────────────────────────────────────────────────

/**
 * @function hasNOfAKind
 * Comprueba si hay al menos N cartas con el mismo rango.
 * @param cards       Cartas a evaluar.
 * @param repetitions Número de repeticiones buscado (2=par, 3=trío, 4=póker).
 * @returns `true` si algún rango aparece al menos `repetitions` veces.
 */
export function hasNOfAKind(
    cards: readonly Card[],
    repetitions: number,
): boolean {
  const counts = [...buildRankFrequencyMap(cards).values()];
  return counts.some((count) => count >= repetitions);
}

/**
 * @function hasTwoPair
 * Comprueba si hay al menos dos rangos distintos con 2 o más
 *   cartas cada uno (doble par).
 * @param cards Cartas a evaluar.
 * @returns `true` si hay dos pares o más.
 */
export function hasTwoPair(cards: readonly Card[]): boolean {
  const counts = [...buildRankFrequencyMap(cards).values()];
  return counts.filter((count) => count >= 2).length >= 2;
}

/**
 * @function hasFullHouse
 * Comprueba si hay un trío y un par con distinto rango.
 *   Requiere exactamente 5 cartas.
 * @param cards Cartas a evaluar.
 * @returns `true` si hay full house.
 */
export function hasFullHouse(cards: readonly Card[]): boolean {
  if (cards.length < 5) return false;
  const counts = [...buildRankFrequencyMap(cards).values()];
  return counts.includes(3) && counts.includes(2);
}

/**
 * @function hasFlush
 * Comprueba si las 5 cartas son del mismo palo.
 *   Requiere exactamente 5 cartas.
 * @param cards Cartas a evaluar.
 * @returns `true` si todas son del mismo palo.
 */
export function hasFlush(cards: readonly Card[]): boolean {
  if (cards.length < 5) return false;
  const firstSuit = cards[0].getSuit();
  return cards.every((card) => card.getSuit() === firstSuit);
}

/**
 * @function hasStraight
 * Comprueba si las cartas forman una escalera (5 rangos consecutivos).
 *   El As puede valer 14 (escalera alta: 10-J-Q-K-A) o 1 (escalera baja: A-2-3-4-5).
 *   La escalera Q-K-A-2-3 NO es válida.
 *   Requiere exactamente 5 cartas.
 * @param cards Cartas a evaluar.
 * @returns `true` si las 5 cartas forman una escalera válida.
 */
export function hasStraight(cards: readonly Card[]): boolean {
  if (cards.length < 5) return false;
  const sortedRanks = cards
      .map((card) => card.getRank())
      .sort((rankA, rankB) => rankA - rankB);

  const isConsecutive = sortedRanks.every(
      (rank, index) => index === 0 || rank === sortedRanks[index - 1] + 1,
  );
  if (isConsecutive) return true;

  const LOW_ACE_STRAIGHT = [1, 2, 3, 4, 5];
  const normalizedRanks = sortedRanks
      .map((rank) => (rank === 14 ? 1 : rank))
      .sort((rankA, rankB) => rankA - rankB);
  return normalizedRanks.every(
      (rank, index) => rank === LOW_ACE_STRAIGHT[index],
  );
}
