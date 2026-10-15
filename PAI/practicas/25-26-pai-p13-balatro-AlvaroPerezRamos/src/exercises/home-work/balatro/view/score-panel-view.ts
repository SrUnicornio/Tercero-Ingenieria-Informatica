/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file score-panel-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Vista del panel de puntuación. Gestiona tres bloques del HTML:
 *   - Bloque 1 ("Deck"): cartas restantes en el mazo.
 *   - Bloque 3 ("Score"): puntuación acumulada, objetivo y barra de progreso.
 *   - Bloque 5 ("Current Hand"): previsualización de la jugada seleccionada.
 *
 *   Para reducir los parámetros del constructor (code smell "Long Parameter List"),
 *   los elementos del DOM se agrupan en dos interfaces de configuración:
 *   {@link ScoreDisplayElements} para los bloques 1 y 3, y
 *   {@link PreviewDisplayElements} para el bloque 5.
 *
 *   No contiene lógica de juego: todos sus métodos son escritura pura en el DOM.
 */

import {type HandResult} from '../types/hand-result';
import {SMALL_BLIND_GOAL} from '../model/game/round-manager';

/**
 * @interface ScoreDisplayElements
 * Elementos del DOM necesarios para los bloques 1 - 3 (estado de partida).
 * @param deckRemaining - Elemento con id="deck-remaining-display".
 * @param scoreTotal - Elemento con id="score-total-display".
 * @param progressFill - Elemento `<div class="progress-fill">` con id="score-progress-bar".
 * @param progressText - Elemento de texto con id="score-progress-text".
*/
export interface ScoreDisplayElements {
  readonly deckRemaining: HTMLElement;
  readonly scoreTotal: HTMLElement;
  readonly progressFill: HTMLElement;
  readonly progressText: HTMLElement;
}

/**
 * @interface PreviewDisplayElements
 * Elementos del DOM necesarios para el bloque 4-6 (previsualización).
 * @param handName - Elemento con id="preview-hand-name".
 * @param chips - Elemento con id="preview-chips-display".
 * @param multiplier - Elemento con id="preview-mult-display".
 * @param total - Elemento con id="preview-total-display".
*/
export interface PreviewDisplayElements {
  readonly handSizeIndicator: HTMLElement;
  readonly handName: HTMLElement;
  readonly chips: HTMLElement;
  readonly multiplier: HTMLElement;
  readonly total: HTMLElement;
}

/**
 * Vista del panel de puntuación y previsualización.
 *   Recibe dos objetos de configuración en lugar de seis parámetros sueltos,
 *   eliminando el code smell de constructor con lista larga de parámetros.
 */
export class ScorePanelView {
  /**
   * @param scoreElements - Elementos del DOM para los bloques 1 y 3.
   * @param previewElements - Elementos del DOM para el bloque 5.
   */
  constructor(
    private readonly scoreElements: ScoreDisplayElements,
    private readonly previewElements: PreviewDisplayElements,
  ) {}

  /**
   * Actualiza el contador de cartas restantes en el mazo (Bloque 1, "Deck").
   * @param remaining - Cartas que quedan sin repartir.
   */
  updateDeckRemaining(remaining: number): void {
    this.scoreElements.deckRemaining.textContent = String(remaining) + '/52';
  }

  /**
   * Actualiza la puntuación acumulada (Bloque 3, "Total") y la barra
   *   de progreso hacia el objetivo del nivel.
   * @param total - Chips acumulados hasta el momento.
   */
  updateTotalScore(total: number): void {
    this.scoreElements.scoreTotal.textContent = String(total);

    const progressPercent = Math.min((total / SMALL_BLIND_GOAL) * 100, 100);
    this.scoreElements.progressFill.style.width = `${progressPercent}%`;

    if (progressPercent >= 100) {
      this.scoreElements.progressFill.classList.add('progress-fill--complete');
    } else {
      this.scoreElements.progressFill.classList.remove('progress-fill--complete');
    }

    this.scoreElements.progressText.textContent =
      `${Math.round(progressPercent)}%`;
  }

  /**
   * Actualiza el indicador del tamaño de la mano (Bloque 4, "Your Hand").
   */
  updateHandSizeIndicator(currentSize: number, maxSize: number): void {
    this.previewElements.handSizeIndicator.textContent =
      `${currentSize} / ${maxSize}`;
  }

  /**
   * Actualiza la previsualización de la jugada seleccionada (Bloque 5).
   *   Con `null` resetea todos los campos al estado neutro (sin selección).
   * @param handResult - Jugada evaluada, o `null` si no hay selección.
   * @param cardBonusChips - Chips de bonificación de las scoring cards.
   */
  updateScorePreview(
      handResult: HandResult | null,
      cardBonusChips: number = 0,
  ): void {
    if (handResult === null) {
      this.previewElements.handName.textContent = '—';
      this.previewElements.chips.textContent = '0';
      this.previewElements.multiplier.textContent = '0';
      this.previewElements.total.textContent = '';
      return;
    }

    const totalChips = handResult.chips + cardBonusChips;
    const totalPoints = totalChips * handResult.multiplier;
    this.previewElements.handName.textContent = handResult.handName;
    this.previewElements.chips.textContent = String(totalChips);
    this.previewElements.multiplier.textContent = String(handResult.multiplier);
    this.previewElements.total.textContent =
      `${totalChips} chips × ${handResult.multiplier} mult = ${totalPoints} pts`;
  }
}
