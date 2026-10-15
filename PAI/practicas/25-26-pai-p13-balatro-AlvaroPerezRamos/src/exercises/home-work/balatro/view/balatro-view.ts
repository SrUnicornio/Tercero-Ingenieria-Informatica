/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file balatro-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Fachada de la vista (patrón Facade). Construye las sub-vistas
 *   a partir del DOM, las compone en un {@link ViewInputRouter} y un
 *   {@link ViewRenderer}, y expone ambos al controlador como una superficie única.
 *
 *   Responsabilidad única: instanciar y cablear las sub-vistas.
 *   La lógica de suscripción a inputs pertenece a {@link ViewInputRouter}.
 *   La lógica de actualización del DOM pertenece a {@link ViewRenderer}.
 */

import {HandAreaView} from './hand-area-view';
import {ScorePanelView} from './score-panel-view';
import {ControlsView} from './controls-view';
import {ViewInputRouter} from './view-input-router';
import {ViewRenderer} from './view-renderer';
import {HandInfoView} from './hand-info-view';

/** IDs de todos los elementos del DOM que gestiona esta fachada. */
const DOM_IDS = {
  handArea: 'hand-area',
  // Contenedor principal de la mano del jugador.
  deckRemaining: 'deck-remaining-display',
  scoreTotal: 'score-total-display',
  progressText: 'score-progress-text',
  progressBar: 'score-progress-bar',
  // Área de cartas del jugador.
  previewHandName: 'preview-hand-name',
  previewChips: 'preview-chips-display',
  previewMult: 'preview-mult-display',
  previewTotal: 'preview-total-display',
  previewHandSizeIndicator: 'preview-hand-size-indicator',
  // Botones.
  playHandButton: 'play-hand-button',
  discardButton: 'discard-button',
  newGameButton: 'new-game-button',
  infoButton: 'hand-info-button',
  sortHandButton: 'sort-hand-button',
  // Contadores y mensajes de estado.
  handsLeft: 'hands-left-display',
  discardsLeft: 'discards-left-display',
} as const;

/**
 * Fachada de la vista. Construye las sub-vistas desde el DOM y
 *   expone al controlador las dos superficies: inputs ({@link ViewInputRouter})
 *   y rendering ({@link ViewRenderer}).
 */
export class BalatroView {
  /** Enruta los inputs del jugador hacia el controlador. */
  private readonly inputs: ViewInputRouter;
  /** Aplica los cambios del modelo al DOM. */
  private readonly renderer: ViewRenderer;
  /** Gestiona el modal de información de jugadas. */
  private readonly handInfo: HandInfoView;

  constructor() {
    const handArea = new HandAreaView(
        this.getElement(DOM_IDS.handArea),
    );

    const scorePanel = new ScorePanelView(
        {
          deckRemaining: this.getElement(DOM_IDS.deckRemaining),
          scoreTotal: this.getElement(DOM_IDS.scoreTotal),
          progressFill: this.getElement(
              DOM_IDS.progressBar,
          ),
          progressText: this.getElement(DOM_IDS.progressText),
        },
        {
          handName: this.getElement(DOM_IDS.previewHandName),
          chips: this.getElement(DOM_IDS.previewChips),
          multiplier: this.getElement(DOM_IDS.previewMult),
          total: this.getElement(DOM_IDS.previewTotal),
          handSizeIndicator: this.getElement(DOM_IDS.previewHandSizeIndicator),
        },
    );

    const controls = new ControlsView(
        this.getElement<HTMLButtonElement>(DOM_IDS.playHandButton),
        this.getElement<HTMLButtonElement>(DOM_IDS.discardButton),
        this.getElement<HTMLButtonElement>(DOM_IDS.newGameButton),
        this.getElement<HTMLButtonElement>(DOM_IDS.infoButton),
        this.getElement(DOM_IDS.handsLeft),
        this.getElement(DOM_IDS.discardsLeft),
        this.getElement<HTMLButtonElement>(DOM_IDS.sortHandButton),
    );

    this.inputs = new ViewInputRouter(handArea, controls);
    this.renderer = new ViewRenderer(handArea, scorePanel, controls);
    this.handInfo = new HandInfoView();
  }

  /** Exposición de la superficie de inputs para el controlador. */
  getInputRouter(): ViewInputRouter {
    return this.inputs;
  }

  /** Exposición de la superficie de rendering para el controlador. */
  getViewRenderer(): ViewRenderer {
    return this.renderer;
  }

  /** Exposición del modal de información de jugadas para el controlador. */
  getHandInfoView(): HandInfoView {
    return this.handInfo;
  }

  // ── Métodos privados ──────────────────────────────────────────────────────
  /**
   * Obtiene un elemento del DOM por su ID con tipo seguro.
   *   Lanza un error en tiempo de ejecución si el elemento no existe,
   *   fallando rápido durante el desarrollo.
   * @param id ID del elemento a obtener.
   * @returns El elemento tipado como `ElementType`.
   * @throws {Error} Si el elemento no está en el DOM.
   */
  private getElement<ElementType extends HTMLElement = HTMLElement>(
      id: string,
  ): ElementType {
    const element = document.getElementById(id) as ElementType | null;
    if (!element) throw new Error(`Elemento DOM no encontrado: #${id}`);
    return element;
  }
}
