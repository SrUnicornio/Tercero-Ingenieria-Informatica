/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-evaluator.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Evaluador de manos de póker para Balatro.
 *   Responsabilidad única: dado un conjunto de cartas seleccionadas,
 *   determinar la jugada de mayor valor y devolver el {@link HandResult}
 *   completo con las scoring cards.
 *
 *   Delega en:
 *   - {@link hand-table} para la tabla de jugadas y las constantes de High Card.
 *   - {@link hand-extractors} para extraer la carta más alta en el fallback.
 */

import {Card} from '../game/card';
import {HandResult} from '../../types/hand-result';
import {extractHighCard} from './hand-extractors';
import {
  HAND_DEFINITIONS,
  HIGH_CARD_BASE_CHIPS,
  HIGH_CARD_BASE_MULTIPLIER,
} from './hand-table';

/**
 * Evaluador estático de manos de póker para Balatro.
 *   Todos los métodos son estáticos; no es necesario instanciar la clase.
 *   Responsabilidad única: determinar la jugada de mayor valor recorriendo
 *   {@link HAND_DEFINITIONS} y devolver el HandResult correspondiente.
 */
export class HandEvaluator {
  /**
   * Evalúa las cartas y retorna el HandResult de mayor valor,
   *   incluyendo las scoring cards que acumulan chips de bonificación.
   *
   *   Si ninguna jugada de la tabla aplica, devuelve High Card con la carta
   *   de mayor rango como única scoring card.
   *
   * @param cards - Cartas seleccionadas por el jugador (1–5).
   * @returns HandResult con nombre, chips base, multiplicador y scoring cards.
   */
  static evaluate(cards: readonly Card[]): HandResult {
    if (cards.length === 0) {
      return {
        handName: 'High Card',
        chips: HIGH_CARD_BASE_CHIPS,
        multiplier: HIGH_CARD_BASE_MULTIPLIER,
        scoringCards: [],
      };
    }

    for (const definition of HAND_DEFINITIONS) {
      if (definition.matches(cards)) {
        return {
          handName: definition.name,
          chips: definition.chips,
          multiplier: definition.multiplier,
          scoringCards: definition.extractScoringCards(cards),
        };
      }
    }

    return {
      handName: 'High Card',
      chips: HIGH_CARD_BASE_CHIPS,
      multiplier: HIGH_CARD_BASE_MULTIPLIER,
      scoringCards: extractHighCard(cards),
    };
  }
}
