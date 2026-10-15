/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-table.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Tabla pública de jugadas de póker para Balatro.
 *   Expone los datos estáticos de cada jugada (nombre, chips base y
 *   multiplicador) en un formato libre de lógica interna, destinado
 *   exclusivamente a la presentación HandInfoView).
 *
 *   Las constantes {@link HIGH_CARD_BASE_CHIPS} y
 *   {@link HIGH_CARD_BASE_MULTIPLIER} se exportan para que tanto este
 *   módulo como hand-evaluator puedan usarlas sin duplicación.
 */

import {
  hasNOfAKind,
  hasTwoPair,
  hasFullHouse,
  hasFlush,
  hasStraight,
} from './hand-detectors';
import {
  extractNOfAKind,
  extractTwoPair,
  extractAllCards,
} from './hand-extractors';
import {Card} from '../game/card';

/**
 * @interface HandTableEntry
 * Fila de la tabla de jugadas expuesta públicamente.
 *   Contiene solo nombre, chips base y multiplicador; sin funciones internas.
 */
export interface HandTableEntry {
  readonly name: string;
  readonly chips: number;
  readonly multiplier: number;
}

/**
 * Estructura interna que combina nombre, puntuación y funciones de
 * detección/extracción para una jugada concreta.
 * No se exporta: es un detalle de implementación de este módulo
 * y de hand-evaluator.
 */
export interface HandDefinition {
  readonly name: string;
  readonly chips: number;
  readonly multiplier: number;
  readonly matches: (cards: readonly Card[]) => boolean;
  readonly extractScoringCards: (cards: readonly Card[]) => readonly Card[];
}

/** Chips base de la jugada High Card. Exportado para evitar duplicación. */
export const HIGH_CARD_BASE_CHIPS = 5;
/** Multiplicador de la jugada High Card. Exportado para evitar duplicación. */
export const HIGH_CARD_BASE_MULTIPLIER = 1;

/**
 * Tabla de jugadas en orden descendente de valor.
 *   El evaluador recorre esta tabla y devuelve la primera coincidencia.
 *   Se exporta para que HandEvaluator pueda iterarla.
 */
export const HAND_DEFINITIONS: readonly HandDefinition[] = [
  {
    name: 'Straight Flush', chips: 100, multiplier: 8,
    matches: (cards) => hasStraight(cards) && hasFlush(cards),
    extractScoringCards: extractAllCards,
  },
  {
    name: 'Four of a Kind', chips: 60, multiplier: 7,
    matches: (cards) => hasNOfAKind(cards, 4),
    extractScoringCards: (cards) => extractNOfAKind(cards, 4),
  },
  {
    name: 'Full House', chips: 40, multiplier: 4,
    matches: (cards) => hasFullHouse(cards),
    extractScoringCards: extractAllCards,
  },
  {
    name: 'Flush', chips: 35, multiplier: 4,
    matches: (cards) => hasFlush(cards),
    extractScoringCards: extractAllCards,
  },
  {
    name: 'Straight', chips: 30, multiplier: 4,
    matches: (cards) => hasStraight(cards),
    extractScoringCards: extractAllCards,
  },
  {
    name: 'Three of a Kind', chips: 30, multiplier: 3,
    matches: (cards) => hasNOfAKind(cards, 3),
    extractScoringCards: (cards) => extractNOfAKind(cards, 3),
  },
  {
    name: 'Two Pair', chips: 20, multiplier: 2,
    matches: (cards) => hasTwoPair(cards),
    extractScoringCards: extractTwoPair,
  },
  {
    name: 'Pair', chips: 10, multiplier: 2,
    matches: (cards) => hasNOfAKind(cards, 2),
    extractScoringCards: (cards) => extractNOfAKind(cards, 2),
  },
];

/**
 * Devuelve la tabla de jugadas en orden descendente de valor,
 *   incluyendo High Card al final. Solo expone nombre, chips y multiplicador,
 *   sin las funciones internas de detección y extracción.
 *   Consumido por HandInfoView para renderizar el modal de información.
 * @returns Array de {@link HandTableEntry} de mayor a menor valor.
 */
export function getHandTable(): readonly HandTableEntry[] {
  const table: HandTableEntry[] = HAND_DEFINITIONS.map(
      ({name, chips, multiplier}) => ({name, chips, multiplier}),
  );
  table.push({
    name: 'High Card',
    chips: HIGH_CARD_BASE_CHIPS,
    multiplier: HIGH_CARD_BASE_MULTIPLIER,
  });
  return table;
}
