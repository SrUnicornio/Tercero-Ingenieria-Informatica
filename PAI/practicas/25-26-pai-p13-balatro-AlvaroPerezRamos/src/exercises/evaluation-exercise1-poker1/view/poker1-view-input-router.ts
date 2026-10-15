/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-view-input-router.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Enrutador de inputs de usuario de Póker-1.
 *   Expone los puntos de suscripción a entradas del jugador,
 *   delegando en las sub-vistas correspondientes.
 */

import {Poker1HandView} from './poker1-hand-view';
import {Poker1ControlsView} from './poker1-controls-view';

/**
 * Enrutador de eventos de usuario de Póker-1.
 *   Responsabilidad única: exponer los `onXxx` de suscripción
 *   a inputs, delegando en {@link Poker1HandView} y
 *   {@link Poker1ControlsView}.
 */
export class Poker1ViewInputRouter {
  /**
   * @param handView     Sub-vista que emite clics en cartas.
   * @param controlsView Sub-vista que emite cambios del checkbox.
   */
  constructor(
    private readonly handView: Poker1HandView,
    private readonly controlsView: Poker1ControlsView,
  ) {}

  /**
   * Registra un listener para el clic en una carta.
   * @param listener Función llamada con el índice (0-based) de la carta.
   */
  onCardClicked(listener: (slotIndex: number) => void): void {
    this.handView.onCardClicked(listener);
  }

  /**
   * Registra un listener para el cambio del checkbox.
   * @param listener Función llamada con `true` si "Carta mayor" está activo.
   */
  onCheckboxChanged(listener: (wantHigher: boolean) => void): void {
    this.controlsView.onCheckboxChanged(listener);
  }

  /**
   * Devuelve el modo activo en el momento de la consulta.
   * El controlador lo usa al procesar un clic en carta.
   * @returns `true` si el modo "Carta mayor" está activo.
   */
  isHigherModeActive(): boolean {
    return this.controlsView.isHigherModeActive();
  }
}
