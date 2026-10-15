/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-calculator.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Calculador de chips de bonificación por carta individual.
 *   Responsabilidad única: dado un conjunto de scoring cards ya extraídas
 *   por HandEvaluator, devolver la suma de sus chips de bonificación
 *   según la tabla oficial de Balatro.
 *
 *   Separado de hand-evaluator porque opera sobre cartas individuales,
 *   no sobre jugadas de póker: es un cálculo de valor de carta, no de mano.
 */

import {Card} from '../game/card';

/**
 * @constant CARD_CHIP_VALUES
 * @description Chips de bonificación por carta según la tabla oficial de Balatro.
 *   J/Q/K (rangos 11–13) = 10; As (rango 14) = 11; números = su rango numérico.
 */
const CARD_CHIP_VALUES: ReadonlyMap<number, number> = new Map([
  [2, 2], [3, 3], [4, 4], [5, 5], [6, 6],
  [7, 7], [8, 8], [9, 9], [10, 10],
  [11, 10], [12, 10], [13, 10], [14, 11],
]);

/**
 * Suma los chips de bonificación de las scoring cards recibidas
 *   según la tabla oficial de Balatro (J/Q/K=10, A=11, resto=rango numérico).
 *
 *   Debe recibir únicamente las `scoringCards` del HandResult,
 *   nunca la selección completa del jugador.
 *
 * @param scoringCards - Cartas cuyas bonificaciones se suman.
 * @returns Total de chips de bonificación.
 */
export function calculateCardChips(scoringCards: readonly Card[]): number {
  return scoringCards.reduce(
      (accumulated, card) =>
        accumulated + (CARD_CHIP_VALUES.get(card.getRank()) ?? card.getRank()),
      0,
  );
}
