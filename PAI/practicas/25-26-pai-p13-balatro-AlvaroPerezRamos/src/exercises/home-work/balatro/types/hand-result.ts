/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-result.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Contrato de retorno del evaluador de manos de póker.
 *   Se separa de los payloads de evento para que HandEvaluator
 *   pueda importarlo sin arrastrar la dependencia de Card a game-types.
 */

import {Card} from '../model/game/card';

/**
 * @interface HandResult
 * Resultado de evaluar una mano de póker.
 *   Producido por HandEvaluator.evaluate y transportado
 *   por HandPlayedData y ScorePreviewData.
 *
 * @param handName     Nombre de la jugada (p.ej. "Full House", "Pair").
 * @param chips        Chips base antes de sumar las scoring cards.
 * @param multiplier   Multiplicador aplicado al total de chips.
 * @param scoringCards Subconjunto de cartas seleccionadas que suman chips:
 *   - High Card      → 1 carta (la de mayor rango).
 *   - Pair           → 2 cartas (el par).
 *   - Two Pair       → 4 cartas (los dos pares).
 *   - Three of a Kind → 3 cartas.
 *   - Four of a Kind  → 4 cartas.
 *   - Straight / Flush / Full House / Straight Flush → las 5 cartas.
 */
export interface HandResult {
  readonly handName: string;
  readonly chips: number;
  readonly multiplier: number;
  readonly scoringCards: readonly Card[];
}
