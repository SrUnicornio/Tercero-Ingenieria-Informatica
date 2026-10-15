/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file view-renderer.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Actualiza el DOM en respuesta a los eventos del modelo.
 *   Agrupa los métodos `onXxx(data)` que antes vivían mezclados en
 *   {@link BalatroView} con los métodos de suscripción a inputs del usuario.
 *
 *   Responsabilidad única: traducir los payloads del modelo en cambios
 *   visibles en {@link HandAreaView}, {@link ScorePanelView} y {@link ControlsView}.
 */

import {HandAreaView} from './hand-area-view';
import {ScorePanelView} from './score-panel-view';
import {ControlsView} from './controls-view';
import {Card} from '../model/game/card';
import {
  type GameStartedData,
  type HandPlayedData,
  type CardsDiscardedData,
  type ScorePreviewData,
  type GameEndedData,
  type CardToggledData,
} from '../types/event-payloads';


/**
 * Renderizador de la vista. Aplica los cambios de estado del modelo
 *   a las tres sub-vistas sin contener lógica de juego.
 */
export class ViewRenderer {
  private maxHandSize!: number;
  private initialHands!: number;
  private initialDiscards!: number;
  /**
   * @param handArea - Sub-vista de la mano del jugador.
   * @param scorePanel - Sub-vista del panel de puntuación.
   * @param controls - Sub-vista de los controles y botones.
   */
  constructor(
    private readonly handArea: HandAreaView,
    private readonly scorePanel: ScorePanelView,
    private readonly controls: ControlsView,
  ) {}

  /**
   * Reinicia todos los elementos visuales al estado inicial del nivel.
   * @param data - Datos del evento: mano inicial y cartas restantes en el mazo.
   */
  onGameStarted(
      data: GameStartedData,
  ): void {
    this.maxHandSize = data.maxHandSize;
    this.initialHands = data.initialHands;
    this.initialDiscards = data.initialDiscards;
    this.controls.resetForNewGame();
    this.handArea.renderHand(data.hand);
    this.scorePanel.updateDeckRemaining(data.deckRemaining);
    this.scorePanel.updateTotalScore(0);
    this.scorePanel.updateScorePreview(null, 0);
    this.controls.updateCounters(this.initialHands, this.initialDiscards);
    this.controls.updateButtonStates(
        false, this.initialHands, this.initialDiscards, false,
    );
  }

  /**
   * Actualiza el estado visual de la carta y los botones de acción.
   * @param data - Índice y nuevo estado de selección.
   * @param handsLeft - Manos disponibles restantes.
   * @param discardsLeft - Descartes disponibles restantes.
   * @param selectionSize - Número de cartas actualmente seleccionadas.
   */
  onCardToggled(
      data: CardToggledData,
      handsLeft: number,
      discardsLeft: number,
      selectionSize: number,
  ): void {
    this.handArea.setCardSelected(data.cardIndex, data.isSelected);
    this.controls.updateButtonStates(
        selectionSize > 0, handsLeft, discardsLeft, false,
    );
    this.scorePanel.updateHandSizeIndicator(selectionSize, this.maxHandSize);
  }

  /**
   * Re-renderiza la mano, actualiza puntuación total y contadores.
   * @param data - Puntuación, estado de recursos y mano actualizada.
   */
  onHandPlayed(data: HandPlayedData): void {
    this.handArea.renderHand(data.hand);
    this.scorePanel.updateTotalScore(data.totalScore);
    this.scorePanel.updateDeckRemaining(data.deckRemaining);
    this.scorePanel.updateScorePreview(null, 0);
    this.controls.updateCounters(data.handsLeft, null);
    this.controls.updateButtonStates(false, data.handsLeft, Infinity, false);
  }

  /**
   * Repinta la mano tras ordenarla, restaurando el estado visual de
   *   selección en los nuevos índices calculados por HandManager.
   * @param hand - Mano reordenada.
   * @param selectedIndices - Índices seleccionados tras el reordenamiento.
   * @param handsLeft - Manos restantes (para habilitar Play Hand).
   * @param discardsLeft - Descartes restantes (para habilitar Discard).
   */
  onHandSorted(
      hand: readonly Card[],
      selectedIndices: ReadonlySet<number>,
      handsLeft: number,
      discardsLeft: number,
  ): void {
    this.handArea.renderHand(hand);
    // Restaurar la selección visual en las nuevas posiciones.
    for (const index of selectedIndices) {
      this.handArea.setCardSelected(index, true);
    }
    const hasSelection = selectedIndices.size > 0;
    this.controls.updateButtonStates(hasSelection, handsLeft,
        discardsLeft, false,
    );
  }

  /**
   * Sustituye visualmente las cartas descartadas y actualiza contadores.
   * @param data - Cartas nuevas e índices de los slots afectados.
   */
  onCardsDiscarded(data: CardsDiscardedData): void {
    this.handArea.renderHand(data.hand);
    this.scorePanel.updateDeckRemaining(data.deckRemaining);
    this.controls.updateCounters(null, data.discardsLeft);
    this.controls.updateButtonStates(
        false, Infinity, data.discardsLeft, false,
    );
  }

  /**
   * Actualiza el bloque 5 con la jugada detectada en la selección.
   * @param data - Jugada evaluada o `null` si no hay selección.
   */
  onScorePreview(data: ScorePreviewData): void {
    this.scorePanel.updateScorePreview(data.handResult, data.cardBonusChips);
  }

  /**
   * Muestra el mensaje de fin de partida y deshabilita los botones.
   * @param data - Resultado y puntuación final.
   */
  onGameEnded(data: GameEndedData): void {
    this.controls.showGameResult(data.playerWon, data.finalScore);
    this.controls.updateButtonStates(false, 0, 0, true);
    this.scorePanel.updateHandSizeIndicator(0, this.maxHandSize);
  }
}
