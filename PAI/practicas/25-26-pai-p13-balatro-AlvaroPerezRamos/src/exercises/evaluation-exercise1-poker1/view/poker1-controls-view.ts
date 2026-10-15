/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-controls-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Sub-vista de los controles de Póker-1.
 *   Gestiona el checkbox "Carta mayor" y el área de mensajes de estado.
 *   Emite un evento cuando cambia el estado del checkbox.
 */

import {Event} from
  '../../home-work/balatro/observer/event';

/** ID del checkbox en el DOM. */
const CHECKBOX_ID = 'poker1-higher-checkbox';
/** ID del párrafo de mensaje de estado en el DOM. */
const STATUS_MESSAGE_ID = 'poker1-status-message';

/**
 * Vista de los controles de Póker-1.
 *   Responsabilidad única: gestionar el checkbox y el mensaje de estado.
 */
export class Poker1ControlsView {
  private readonly checkboxChangedEvent = new Event<boolean>();

  private readonly checkbox: HTMLInputElement;
  private readonly statusMessage: HTMLElement;

  constructor() {
    this.checkbox = this.getInputElement(CHECKBOX_ID);
    this.statusMessage = this.getElement(STATUS_MESSAGE_ID);

    this.checkbox.addEventListener('change', () => {
      this.checkboxChangedEvent.trigger(this.checkbox.checked);
    });
  }

  /**
   * Registra un listener para el cambio del checkbox.
   * @param listener Función llamada con `true` si está marcado, `false` si no.
   */
  onCheckboxChanged(listener: (wantHigher: boolean) => void): void {
    this.checkboxChangedEvent.addListener(listener);
  }

  /**
   * Devuelve el estado actual del checkbox.
   * @returns `true` si "Carta mayor" está activo.
   */
  isHigherModeActive(): boolean {
    return this.checkbox.checked;
  }

  /**
   * Muestra un mensaje de estado bajo las cartas.
   * @param message Texto a mostrar. Cadena vacía para ocultar.
   */
  showMessage(message: string): void {
    this.statusMessage.textContent = message;
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
   * Obtiene un `<input>` del DOM por su ID.
   * @throws {Error} Si el elemento no existe.
   */
  private getInputElement(id: string): HTMLInputElement {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (!element) throw new Error(`Input DOM no encontrado: #${id}`);
    return element;
  }
}
