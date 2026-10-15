/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file view-input-router.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Enruta los eventos de usuario (clics del jugador) desde las
 *   sub-vistas hacia el controlador. Agrupa los métodos `onXxx(listener)`
 *   que antes vivían mezclados en {@link BalatroView} con los métodos de
 *   actualización del DOM.
 *
 *   Responsabilidad única: exponer los puntos de suscripción a entradas
 *   del usuario, delegando en {@link HandAreaView} y {@link ControlsView}.
 */

import {HandAreaView} from './hand-area-view';
import {ControlsView} from './controls-view';

/**
 * Enrutador de eventos de usuario. Delega en las sub-vistas
 *   que gestionan cada tipo de interacción (carta, botones).
 */
export class ViewInputRouter {
  /**
   * @param handArea Sub-vista que gestiona los clics en cartas.
   * @param controls Sub-vista que gestiona los botones de acción.
   */
  constructor(
    private readonly handArea: HandAreaView,
    private readonly controls: ControlsView,
  ) {}

  /**
   * Registra un listener para el clic en una carta de la mano.
   * @param listener - Función llamada con el índice (0-based) de la carta.
   */
  onCardClicked(listener: (cardIndex: number) => void): void {
    this.handArea.onCardClicked(listener);
  }

  /**
   * Registra un listener para el clic en "Play Hand".
   * @param listener - Función invocada cuando el jugador pulsa el botón.
   */
  onPlayHand(listener: () => void): void {
    this.controls.onPlayHand(listener);
  }

  /**
   * Registra un listener para el clic en "Discard".
   * @param listener - Función invocada cuando el jugador pulsa el botón.
   */
  onDiscard(listener: () => void): void {
    this.controls.onDiscard(listener);
  }

  /**
   * Registra un listener para el clic en "New Game".
   * @param listener - Función invocada cuando el jugador pulsa el botón.
   */
  onNewGame(listener: () => void): void {
    this.controls.onNewGame(listener);
  }

  /**
   * Registra un listener para el clic en "Sort Hand".
   * @param listener - Función invocada con el criterio 'rank' | 'suit'.
   */
  onSortHand(listener: (criterion: 'rank' | 'suit') => void): void {
    this.controls.onSortHand(listener);
  }

  /**
   * Registra un listener para el clic en "Hand Info".
   * @param listener - Función invocada cuando el jugador pulsa el botón.
   */
  onHandInfo(listener: () => void): void {
    this.controls.onHandInfo(listener);
  }
}
