/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-manager.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Gestiona la mano actual del jugador: selección de cartas,
 *   límite de selección, reposición tras jugar o descartar, y ordenación.
 *
 *   Los eventos son privados y se exponen mediante métodos `onXxx(listener)`
 *   conforme a la guía de estilo de Google TypeScript.
 */

import {Card} from './card';
import {Deck} from './deck';
import {Event} from '../../observer/event';
import {
  type CardToggledData,
  type ScorePreviewData,
} from '../../types/event-payloads';
import {HandEvaluator} from '../poker/hand-evaluator';
import {calculateCardChips} from '../poker/hand-calculator';

/** Número máximo de cartas seleccionables para jugar una mano. */
const MAX_SELECTED_CARDS = 5;

/**
 * Gestor del estado de la mano actual del jugador.
 *   Responsabilidades: seleccionar/deseleccionar cartas, reponerlas tras
 *   jugar o descartar, y ordenar la mano según criterio.
 */
export class HandManager {
  private currentHand: Card[] = [];
  private readonly selectedIndices: Set<number> = new Set();

  private readonly cardToggledEvent = new Event<CardToggledData>();
  private readonly scorePreviewEvent = new Event<ScorePreviewData>();

  /**
   * @param deck Mazo del que se reparten las cartas.
   */
  constructor(private readonly deck: Deck) {}

  /**
   * Registra un listener para el evento de cambio de selección.
   * @param listener Función llamada con los datos del toggle.
   */
  onCardToggled(listener: (data: CardToggledData) => void): void {
    this.cardToggledEvent.addListener(listener);
  }

  /**
   * Registra un listener para el evento de previsualización.
   * @param listener Función llamada con el preview actualizado.
   */
  onScorePreview(listener: (data: ScorePreviewData) => void): void {
    this.scorePreviewEvent.addListener(listener);
  }

  /**
   * Reparte `count` cartas del mazo y limpia la selección previa.
   * @param count Número de cartas a repartir.
   */
  dealInitialHand(count: number): void {
    this.currentHand = this.deck.deal(count);
    this.selectedIndices.clear();
  }

  /**
   * Alterna la selección de una carta. Ignora índices fuera de
   *   rango y bloquea la selección al llegar al límite de MAX_SELECTED_CARDS.
   * @param cardIndex Índice de la carta a alternar (0-based).
   */
  toggleCard(cardIndex: number): void {
    if (this.isInvalidIndex(cardIndex)) return;
    if (this.selectedIndices.has(cardIndex)) {
      this.deselect(cardIndex);
    } else {
      this.select(cardIndex);
    }
    this.emitScorePreview();
  }

  /**
   * Descarta las cartas seleccionadas y las repone del mazo.
   *   El tamaño de la mano no varía. Limpia la selección tras operar.
   * @returns Los índices reemplazados y las cartas nuevas.
   */
  discardSelected(): {replacedIndices: number[]; replacementCards: Card[]} {
    const replacedIndices = this.sortedSelectedIndices();
    const replacementCards = this.deck.deal(replacedIndices.length);
    for (let i = 0; i < replacedIndices.length; i++) {
      this.currentHand[replacedIndices[i]] = replacementCards[i];
    }
    this.selectedIndices.clear();
    this.emitScorePreview();
    return {replacedIndices, replacementCards};
  }

  /**
   * Limpia la selección sin modificar las cartas de la mano.
   */
  clearSelection(): void {
    this.selectedIndices.clear();
    this.emitScorePreview();
  }

  /**
   * Ordena la mano in-place preservando la selección actual.
   *   Antes de ordenar guarda las referencias a las cartas seleccionadas;
   *   tras ordenar recalcula sus nuevos índices y los restaura en
   *   `selectedIndices`, de modo que el jugador no pierde su selección.
   *
   *   - `'rank'` → ascendente por rango numérico (2 … A).
   *   - `'suit'` → alfabético por palo, luego por rango ascendente.
   *
   * @param criterion Criterio de ordenación.
   */
  sortHand(criterion: 'rank' | 'suit'): void {
    // Guardar las cartas seleccionadas por referencia antes de ordenar.
    const selectedCards = new Set(
        [...this.selectedIndices].map((index) => this.currentHand[index]),
    );

    if (criterion === 'rank') {
      this.currentHand.sort(
          (cardA, cardB) => cardA.getRank() - cardB.getRank(),
      );
    } else {
      this.currentHand.sort((cardA, cardB) => {
        const suitOrder = cardA.getSuit().localeCompare(cardB.getSuit());
        if (suitOrder !== 0) return suitOrder;
        return cardA.getRank() - cardB.getRank();
      });
    }

    // Recalcular los índices correspondientes a las cartas que estaban
    // seleccionadas, ahora que han cambiado de posición en el array.
    this.selectedIndices.clear();
    this.currentHand.forEach((card, newIndex) => {
      if (selectedCards.has(card)) {
        this.selectedIndices.add(newIndex);
      }
    });

    this.emitScorePreview();
  }

  /**
   * Devuelve la mano actual (solo lectura).
   * @returns Array inmutable de cartas.
   */
  getHand(): readonly Card[] {
    return this.currentHand;
  }

  /**
   * Devuelve el conjunto de índices seleccionados (solo lectura).
   * @returns Set inmutable con los índices marcados.
   */
  getSelectedCardIndices(): ReadonlySet<number> {
    return this.selectedIndices;
  }

  /**
   * Devuelve las cartas correspondientes a los índices seleccionados.
   * @returns Array de cartas seleccionadas en orden de índice.
   */
  getSelectedCards(): Card[] {
    return [...this.selectedIndices].map((index) => this.currentHand[index]);
  }

  /** Devuelve el máximo número de cartas que pueden ser seleccionadas. */
  getMaxSelectionSize(): number {
    return MAX_SELECTED_CARDS;
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  private isInvalidIndex(index: number): boolean {
    return index < 0 || index >= this.currentHand.length;
  }

  private select(cardIndex: number): void {
    if (this.selectedIndices.size >= MAX_SELECTED_CARDS) return;
    this.selectedIndices.add(cardIndex);
    this.cardToggledEvent.trigger({cardIndex, isSelected: true});
  }

  private deselect(cardIndex: number): void {
    this.selectedIndices.delete(cardIndex);
    this.cardToggledEvent.trigger({cardIndex, isSelected: false});
  }

  private sortedSelectedIndices(): number[] {
    return [...this.selectedIndices].sort((indexA, indexB) => indexA - indexB);
  }

  /**
   * Emite el preview con la jugada detectada en la selección actual.
   *   Los chips se calculan solo sobre las scoring cards de la jugada.
   */
  private emitScorePreview(): void {
    if (this.selectedIndices.size === 0) {
      this.scorePreviewEvent.trigger({handResult: null, cardBonusChips: 0});
      return;
    }
    const selectedCards = this.getSelectedCards();
    const handResult = HandEvaluator.evaluate(selectedCards);
    const cardBonusChips =
      calculateCardChips(handResult.scoringCards);
    this.scorePreviewEvent.trigger({handResult, cardBonusChips});
  }
}
