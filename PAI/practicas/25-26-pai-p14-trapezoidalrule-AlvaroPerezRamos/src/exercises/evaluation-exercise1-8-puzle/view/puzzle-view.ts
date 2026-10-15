/**
 * Universidad de La Laguna — PAI P14
 * @file puzzle-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since May 2026
 * @description Fachada de la vista. Agrega BoardView y ControlsView
 *              y expone una interfaz unificada al Controller.
 */

import {BoardView} from './board-view.js';
import {ControlsView} from './controls-view.js';

const PUZZLE_CONTAINER_ID = 'puzzle-container';

/**
 * Fachada de la vista del 8-Puzzle.
 * El Controller interactúa únicamente con esta clase.
 */
export class PuzzleView {
  private readonly boardView: BoardView;
  private readonly controlsView: ControlsView;

  constructor() {
    this.boardView = new BoardView(PUZZLE_CONTAINER_ID);
    this.controlsView = new ControlsView();
  }

  /**
   * @returns La sub-vista del tablero para suscribirse a onTileClicked.
   */
  getBoardView(): BoardView {
    return this.boardView;
  }

  /** @returns La sub-vista de controles para suscripción del Controller. */
  getControlsView(): ControlsView {
    return this.controlsView;
  }

  /**
   * Reconstruye el grid completo (tras Shuffle o movimiento).
   * @param board - Array de 9 posiciones con los ids de pieza.
   * @param showNumbers - Si true muestra piezas con número.
   */
  renderBoard(board: readonly number[], showNumbers: boolean): void {
    this.boardView.render(board, showNumbers);
  }

  /**
   * Actualiza solo las imágenes del grid (al cambiar Show numbers).
   * @param board - Estado actual del tablero.
   * @param showNumbers - Nuevo estado del flag.
   */
  updateTileImages(
      board: readonly number[],
      showNumbers: boolean,
  ): void {
    this.boardView.updateTileImages(board, showNumbers);
  }

  /**
   * Sincroniza el checkbox con el estado del modelo.
   * @param value - Estado del flag showNumbers.
   */
  setShowNumbersCheckbox(value: boolean): void {
    this.controlsView.setShowNumbers(value);
  }
}
