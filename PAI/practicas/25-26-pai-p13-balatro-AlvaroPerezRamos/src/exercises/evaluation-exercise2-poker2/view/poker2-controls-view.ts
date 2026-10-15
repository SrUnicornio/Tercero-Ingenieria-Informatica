/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-controls-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Sub-vista de los controles de Póker-2.
 *   Gestiona los botones "New Hand 1" y "New Hand 2" y el mensaje
 *   de estado (mazo insuficiente).
 */

import {Event} from
  '../../home-work/balatro/observer/event';
import {type PlayerIndex} from '../model/poker2-model';

/** ID del botón "New Hand 1" en el DOM. */
const NEW_HAND_1_BUTTON_ID = 'poker2-new-hand-1';
/** ID del botón "New Hand 2" en el DOM. */
const NEW_HAND_2_BUTTON_ID = 'poker2-new-hand-2';
/** ID del párrafo de mensaje de estado en el DOM. */
const STATUS_MESSAGE_ID = 'poker2-status-message';

/** Mensaje de mazo sin cartas suficientes. */
const MSG_DECK_INSUFFICIENT =
  'No hay cartas disponibles en el mazo';

/**
 * Vista de los controles de Póker-2.
 *   Responsabilidad única: gestionar los dos botones de nueva mano
 *   y el mensaje de estado.
 */
export class Poker2ControlsView {
  private readonly newHandEvent = new Event<PlayerIndex>();

  private readonly newHand1Button: HTMLButtonElement;
  private readonly newHand2Button: HTMLButtonElement;
  private readonly statusMessage: HTMLElement;

  constructor() {
    this.newHand1Button =
      this.getButtonElement(NEW_HAND_1_BUTTON_ID);
    this.newHand2Button =
      this.getButtonElement(NEW_HAND_2_BUTTON_ID);
    this.statusMessage = this.getElement(STATUS_MESSAGE_ID);

    this.newHand1Button.addEventListener('click', () => {
      this.newHandEvent.trigger(0);
    });
    this.newHand2Button.addEventListener('click', () => {
      this.newHandEvent.trigger(1);
    });
  }

  /**
   * Registra un listener para el clic en cualquiera de los dos botones.
   * @param listener Función llamada con el índice del jugador (0 o 1).
   */
  onNewHand(listener: (playerIndex: PlayerIndex) => void): void {
    this.newHandEvent.addListener(listener);
  }

  /**
   * Muestra el mensaje de mazo insuficiente.
   */
  showDeckInsufficientMessage(): void {
    this.statusMessage.textContent = MSG_DECK_INSUFFICIENT;
  }

  /**
   * Limpia el mensaje de estado.
   */
  clearMessage(): void {
    this.statusMessage.textContent = '';
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Obtiene un elemento del DOM por su ID.
   * @throws {Error} Si el elemento no existe.
   */
  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Elemento DOM no encontrado: #${id}`);
    return element;
  }

  /**
   * Obtiene un `<button>` del DOM por su ID.
   * @throws {Error} Si el elemento no existe.
   */
  private getButtonElement(id: string): HTMLButtonElement {
    const element =
      document.getElementById(id) as HTMLButtonElement | null;
    if (!element) {
      throw new Error(`Botón DOM no encontrado: #${id}`);
    }
    return element;
  }
}
