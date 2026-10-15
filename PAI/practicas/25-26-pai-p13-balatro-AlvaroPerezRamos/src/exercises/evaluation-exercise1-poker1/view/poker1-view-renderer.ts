/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-view-renderer.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Renderizador de la vista de Póker-1.
 *   Aplica los cambios de estado del modelo al DOM delegando en las
 *   sub-vistas. No contiene lógica de juego.
 */

import {Poker1HandView} from './poker1-hand-view';
import {Poker1ControlsView} from './poker1-controls-view';
import {type GameStartedData, type CardReplacedData} from
  '../model/poker1-model';

/** Mensaje mostrado cuando no hay carta adecuada en el mazo. */
const MSG_NO_SUITABLE_CARD = 'No hay cartas adecuadas';
/** Mensaje mostrado cuando el mazo está vacío. */
const MSG_DECK_EMPTY = 'No hay cartas en el mazo';

/**
 * Renderizador de Póker-1.
 *   Métodos `onXxx` llamados por el controlador en respuesta a eventos
 *   del modelo. Cada método hace escritura pura en el DOM.
 */
export class Poker1ViewRenderer {
  /**
   * @param handView     Sub-vista del área de cartas.
   * @param controlsView Sub-vista de controles y mensajes.
   */
  constructor(
    private readonly handView: Poker1HandView,
    private readonly controlsView: Poker1ControlsView,
  ) {}

  /**
   * Renderiza la mano inicial y limpia cualquier mensaje previo.
   * @param data Payload del evento de inicio de partida.
   */
  onGameStarted(data: GameStartedData): void {
    this.handView.renderHand(data.hand);
    this.controlsView.clearMessage();
  }

  /**
   * Actualiza visualmente la carta sustituida y limpia el mensaje.
   * @param data Payload con el slot y la nueva carta.
   */
  onCardReplaced(data: CardReplacedData): void {
    this.handView.replaceCard(data.slotIndex, data.newCard);
    this.controlsView.clearMessage();
  }

  /**
   * Muestra el mensaje "No hay cartas adecuadas".
   */
  onNoSuitableCard(): void {
    this.controlsView.showMessage(MSG_NO_SUITABLE_CARD);
  }

  /**
   * Muestra el mensaje "No hay cartas en el mazo".
   */
  onDeckEmpty(): void {
    this.controlsView.showMessage(MSG_DECK_EMPTY);
  }
}
