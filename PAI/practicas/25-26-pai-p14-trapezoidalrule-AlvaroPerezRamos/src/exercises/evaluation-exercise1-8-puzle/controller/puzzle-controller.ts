/**
 * Universidad de La Laguna — PAI P14
 * @file puzzle-controller.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since May 2026
 * @description Controlador del 8-Puzzle. Conecta las entradas de
 *              la vista con el modelo y suscribe la vista a los
 *              eventos del modelo.
 */

import {PuzzleModel} from '../model/puzzle-model.js';
import {PuzzleView} from '../view/puzzle-view.js';

/**
 * Orquesta la comunicación entre PuzzleModel y PuzzleView.
 * No contiene lógica de negocio ni de presentación.
 */
export class PuzzleController {
  private readonly model: PuzzleModel;
  private readonly view: PuzzleView;

  /**
   * @param model - Instancia del modelo del puzzle.
   * @param view - Instancia de la fachada de la vista.
   */
  constructor(model: PuzzleModel, view: PuzzleView) {
    this.model = model;
    this.view = view;
  }

  /**
   * Conecta eventos de entrada (vista→modelo) y de salida
   * (modelo→vista), y sincroniza el estado inicial.
   */
  run(): void {
    this.bindInputEvents();
    this.bindModelEvents();
    this.renderInitialState();
  }

  /**
   * Suscribe el modelo a los eventos de la vista. Por ejemplo, al
   * cambiar el checkbox de Show numbers, el modelo actualiza su estado y
   * emite un evento que la vista usa para actualizar las imágenes de las piezas.
   */
  private bindInputEvents(): void {
    const controls = this.view.getControlsView();

    controls.onShowNumbersToggled.addListener((showNumbers) => {
      this.model.setShowNumbers(showNumbers);
    });

    controls.onShuffleRequested.addListener(() => {
      this.model.shuffle();
    });

    controls.onSolveRequested.addListener(() => {
      this.model.solve();
    });

    this.view.getBoardView().onTileClicked.addListener((cellIndex) => {
      this.model.moveTile(cellIndex);
    });
  }

  private bindModelEvents(): void {
    const channels = this.model.getChannels();

    channels.onBoardChanged.addListener(({board, showNumbers}) => {
      this.view.renderBoard(board, showNumbers);
    });

    channels.onShowNumbersChanged.addListener(({board, showNumbers}) => {
      this.view.updateTileImages(board, showNumbers);
    });
  }

  /**
   * El constructor de BoardView ya muestra la imagen completa.
   * Solo sincronizamos el checkbox con el modelo.
   */
  private renderInitialState(): void {
    this.view.setShowNumbersCheckbox(this.model.getShowNumbers());
  }
}
