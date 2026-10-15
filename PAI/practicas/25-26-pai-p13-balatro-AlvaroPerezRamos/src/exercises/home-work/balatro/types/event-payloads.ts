/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file event-payloads.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Payloads tipados que viajan por los canales {@link Event}
 *   del sistema Observer. Cada interface `XxxData` transporta exactamente
 *   los campos que el listener correspondiente necesita; nada más.
 *
 *   Importar desde este módulo en lugar de desde el antiguo game-types.ts.
 */

import {Card} from '../model/game/card';
import {HandResult} from './hand-result';

/**
 * @interface GameStartedData
 * Payload del evento emitido cuando el juego arranca o se reinicia.
 * @param hand - Cartas de la mano inicial del jugador.
 * @param deckRemaining - Cartas que quedan sin repartir en el mazo.
 */
export interface GameStartedData {
  readonly hand: readonly Card[];
  readonly deckRemaining: number;
  readonly initialHands: number;
  readonly initialDiscards: number;
  readonly maxHandSize: number;
}

/**
 * @interface CardToggledData
 * Payload del evento emitido cuando el jugador alterna la selección
 *   de una carta (clic en una carta de la mano).
 * @param cardIndex - Índice de la carta en la mano (0-based).
 * @param isSelected - `true` si pasa a seleccionada; `false` si se deselecciona.
 */
export interface CardToggledData {
  readonly cardIndex: number;
  readonly isSelected: boolean;
}

/**
 * @interface HandPlayedData
 * Payload del evento emitido tras jugar una mano.
 * @param handResult - Jugada detectada con chips, mult y scoring cards.
 * @param roundScore - Puntuación obtenida en esta mano.
 * @param totalScore - Puntuación acumulada tras esta mano.
 * @param handsLeft - Manos disponibles restantes.
 * @param deckRemaining - Cartas que quedan en el mazo.
 * @param hand - Estado de la mano tras reponer las cartas jugadas.
 * @param replacedIndices - Índices de los slots reemplazados por cartas nuevas.
 * @param replacementCards - Cartas nuevas con las que se repusieron los slots.
 */
export interface HandPlayedData {
  readonly handResult: HandResult;
  readonly roundScore: number;
  readonly totalScore: number;
  readonly handsLeft: number;
  readonly deckRemaining: number;
  readonly hand: readonly Card[];
  readonly replacedIndices: readonly number[];
  readonly replacementCards: readonly Card[];
}

/**
 * @interface CardsDiscardedData
 * Payload del evento emitido tras un descarte.
 * @param replacementCards - Cartas nuevas que sustituyen a las descartadas.
 * @param replacedIndices - Índices de los slots descartados y repuestos.
 * @param deckRemaining - Cartas que quedan en el mazo.
 * @param discardsLeft - Descartes disponibles restantes.
 * @param hand - Estado completo de la mano tras descartar y re-ordenar.
 */
export interface CardsDiscardedData {
  readonly replacementCards: readonly Card[];
  readonly replacedIndices: readonly number[];
  readonly deckRemaining: number;
  readonly discardsLeft: number;
  readonly hand: readonly Card[];
}

/**
 * @interface ScorePreviewData
 * Payload del evento emitido al cambiar la selección del jugador.
 * @param handResult - Jugada detectada, o `null` si no hay selección.
 * @param cardBonusChips - Chips de bonificación de las scoring cards seleccionadas.
 */
export interface ScorePreviewData {
  readonly handResult: HandResult | null;
  readonly cardBonusChips: number;
}

/**
 * @interface GameEndedData
 * Payload del evento emitido al terminar el nivel.
 * @param playerWon -`true` si el jugador superó el objetivo de chips.
 * @param finalScore - Puntuación total acumulada al terminar.
 */
export interface GameEndedData {
  readonly playerWon: boolean;
  readonly finalScore: number;
}
