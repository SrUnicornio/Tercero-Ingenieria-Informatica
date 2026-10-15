/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-view-renderer.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Renderizador de la vista de Póker-2.
 *   Aplica los cambios de estado del modelo al DOM delegando en las
 *   sub-vistas. No contiene lógica de juego.
 */

import {Poker2HandView} from './poker2-hand-view';
import {Poker2ControlsView} from './poker2-controls-view';
import {Poker2ResultView} from './poker2-result-view';
import {
  type GameStartedData,
  type NewHandData,
} from '../model/poker2-model';

/**
 * Renderizador de Póker-2.
 *   Métodos `onXxx` llamados por el controlador en respuesta a
 *   eventos del modelo. Cada método hace escritura pura en el DOM.
 */
export class Poker2ViewRenderer {
  /**
   * @param firstHandView  Sub-vista de la primera fila de cartas.
   * @param secondHandView Sub-vista de la segunda fila de cartas.
   * @param controlsView   Sub-vista de botones y mensaje de estado.
   * @param resultView     Sub-vista del panel de resultado.
   */
  constructor(
    private readonly firstHandView: Poker2HandView,
    private readonly secondHandView: Poker2HandView,
    private readonly controlsView: Poker2ControlsView,
    private readonly resultView: Poker2ResultView,
  ) {}

  /**
   * Renderiza las dos manos iniciales, el resultado y limpia mensajes.
   * @param data Payload del evento de inicio de partida.
   */
  onGameStarted(data: GameStartedData): void {
    this.firstHandView.renderHand(data.firstHand);
    this.secondHandView.renderHand(data.secondHand);
    this.resultView.showResult(data.result);
    this.controlsView.clearMessage();
  }

  /**
   * Actualiza la fila del jugador que recibió nueva mano y el resultado.
   * @param data Payload con índice del jugador, mano y resultado.
   */
  onNewHand(data: NewHandData): void {
    if (data.playerIndex === 0) {
      this.firstHandView.renderHand(data.hand);
    } else {
      this.secondHandView.renderHand(data.hand);
    }
    this.resultView.showResult(data.result);
    this.controlsView.clearMessage();
  }

  /**
   * Muestra el mensaje de mazo insuficiente.
   */
  onDeckInsufficient(): void {
    this.controlsView.showDeckInsufficientMessage();
  }
}
