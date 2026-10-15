/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-result-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Sub-vista del panel de resultado de Póker-2.
 *   Muestra el nombre de la jugada de cada mano y el ganador.
 *   Formato:
 *     First hand: <jugada>
 *     Second hand: <jugada>
 *     <First player wins. | Second player wins. | It's a tie.>
 */

import {type RoundResult} from '../model/poker2-model';

/** ID del elemento de jugada de la primera mano. */
const FIRST_HAND_NAME_ID = 'poker2-first-hand-name';
/** ID del elemento de jugada de la segunda mano. */
const SECOND_HAND_NAME_ID = 'poker2-second-hand-name';
/** ID del elemento del mensaje de ganador. */
const WINNER_MESSAGE_ID = 'poker2-winner-message';

/** Mensaje de victoria del primer jugador. */
const MSG_FIRST_WINS = 'First player wins.';
/** Mensaje de victoria del segundo jugador. */
const MSG_SECOND_WINS = 'Second player wins.';
/** Mensaje de empate. */
const MSG_TIE = `It's a tie.`;

/**
 * Vista del panel de resultado de Póker-2.
 *   Responsabilidad única: actualizar los tres elementos de texto
 *   que muestran las jugadas y el ganador.
 */
export class Poker2ResultView {
  private readonly firstHandName: HTMLElement;
  private readonly secondHandName: HTMLElement;
  private readonly winnerMessage: HTMLElement;

  constructor() {
    this.firstHandName = this.getElement(FIRST_HAND_NAME_ID);
    this.secondHandName = this.getElement(SECOND_HAND_NAME_ID);
    this.winnerMessage = this.getElement(WINNER_MESSAGE_ID);
  }

  /**
   * Actualiza el panel con el resultado de la ronda actual.
   * @param result Resultado con nombres de jugadas y ganador.
   */
  showResult(result: RoundResult): void {
    this.firstHandName.textContent =
      `First hand: ${result.firstHandName}`;
    this.secondHandName.textContent =
      `Second hand: ${result.secondHandName}`;

    if (result.winner === 0) {
      this.winnerMessage.textContent = MSG_FIRST_WINS;
    } else if (result.winner === 1) {
      this.winnerMessage.textContent = MSG_SECOND_WINS;
    } else {
      this.winnerMessage.textContent = MSG_TIE;
    }
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
}
