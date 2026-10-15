/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-view-input-router.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Enrutador de inputs de usuario de Póker-2.
 *   Expone el punto de suscripción al clic en los botones de nueva
 *   mano, delegando en {@link Poker2ControlsView}.
 */

import {Poker2ControlsView} from './poker2-controls-view';
import {type PlayerIndex} from '../model/poker2-model';

/**
 * Enrutador de eventos de usuario de Póker-2.
 *   Responsabilidad única: exponer `onNewHand` al controlador,
 *   delegando en la sub-vista de controles.
 */
export class Poker2ViewInputRouter {
  /**
   * @param controlsView Sub-vista que emite los clics de botón.
   */
  constructor(
    private readonly controlsView: Poker2ControlsView,
  ) {}

  /**
   * Registra un listener para el clic en "New Hand 1" o "New Hand 2".
   * @param listener Función llamada con el índice del jugador (0 o 1).
   */
  onNewHand(listener: (playerIndex: PlayerIndex) => void): void {
    this.controlsView.onNewHand(listener);
  }
}
