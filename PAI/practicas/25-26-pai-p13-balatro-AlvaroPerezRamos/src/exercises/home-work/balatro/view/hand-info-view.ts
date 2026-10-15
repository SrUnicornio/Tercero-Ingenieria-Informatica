/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-info-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Vista del modal "Poker Hands". Muestra la tabla de jugadas
 *   de póker con sus chips base y multiplicador, obtenida directamente de
 *   {@link HandEvaluator.getHandTable}.
 *
 *   Responsabilidad única: construir y controlar el ciclo de vida del
 *   `<dialog>` nativo HTML. No contiene lógica de juego.
 *
 *   El modal se abre al pulsar "Hand Info" y se cierra con el botón ✕
 *   o pulsando fuera del cuadro de diálogo (clic en el backdrop).
 */

import {getHandTable} from '../model/poker/hand-table';

/** ID del elemento `<dialog>` en el DOM. */
const MODAL_ID = 'hand-info-modal';
/** ID del botón de cierre dentro del modal. */
const CLOSE_BUTTON_ID = 'hand-info-close';
/** ID del contenedor de filas dentro del modal. */
const TABLE_CONTAINER_ID = 'hand-info-table';

/**
 * Gestiona el `<dialog>` de información de jugadas.
 *   Se construye una sola vez en BalatroView; el controlador
 *   llama a {@link open} cuando el jugador pulsa "Hand Info".
 *
 *   La tabla de jugadas se genera una única vez en el constructor
 *   (es estática: las puntuaciones no cambian durante la partida).
 */
export class HandInfoView {
  private readonly modal: HTMLDialogElement;

  /**
   * @throws {Error} Si el elemento `<dialog id="hand-info-modal">` no existe en el DOM.
   */
  constructor() {
    const modal = document.getElementById(MODAL_ID) as HTMLDialogElement | null;
    if (!modal) throw new Error(`Elemento DOM no encontrado: #${MODAL_ID}`);
    this.modal = modal;

    this.buildHandTable();
    this.wireCloseEvents();
  }

  /**
   * Abre el modal con la tabla de jugadas.
   */
  open(): void {
    this.modal.showModal();
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Genera las filas de la tabla a partir de `HandEvaluator.getHandTable()`
   *    y las inserta en `#hand-info-table`.
   *   Se llama una sola vez en el constructor.
   */
  private buildHandTable(): void {
    const container = document.getElementById(TABLE_CONTAINER_ID);
    if (!container) return;

    const handTable = getHandTable();
    container.innerHTML = handTable
        .map((entry: { name: string; chips: number; multiplier: number }) =>
          this.buildHandRow(entry.name, entry.chips, entry.multiplier))
        .join('');
  }

  /**
   * Construye el HTML de una fila de jugada.
   * @param name - Nombre de la jugada (p.ej. "Straight Flush").
   * @param chips      Chips base de la jugada.
   * @param multiplier Multiplicador de la jugada.
   * @returns Cadena HTML de la fila.
   */
  private buildHandRow(
      name: string,
      chips: number,
      multiplier: number,
  ): string {
    return `
      <div class="hand-info-row">
        <span class="hand-info-row__name">${name}</span>
        <span class="hand-info-row__chips">${chips} chips</span>
        <span class="hand-info-row__mult">×${multiplier} mult</span>
      </div>`;
  }

  /**
   * Registra los listeners de cierre:
   *   1. Botón ✕ dentro del modal.
   *   2. Clic en el backdrop (área fuera del `<dialog>`).
   */
  private wireCloseEvents(): void {
    const closeButton = document.getElementById(CLOSE_BUTTON_ID);
    closeButton?.addEventListener('click', () => this.modal.close());

    this.modal.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.modal) this.modal.close();
    });
  }
}
