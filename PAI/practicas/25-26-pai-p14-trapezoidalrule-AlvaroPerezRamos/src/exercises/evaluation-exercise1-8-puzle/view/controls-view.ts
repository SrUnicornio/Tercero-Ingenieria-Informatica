/**
 * Universidad de La Laguna — PAI P14
 * @file controls-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since May 2026
 * @description Sub-vista de controles. Gestiona checkbox y botones
 *              y emite eventos de entrada para el Controller.
 */

import {PuzzleEvent} from '../observer/puzzle-event-publisher.js';

const DOM_IDS = {
  SHOW_NUMBERS_CHECKBOX: 'show-numbers-checkbox',
  BTN_SHUFFLE: 'btn-shuffle',
  BTN_SOLVE: 'btn-solve',
} as const;

/**
 * Gestiona la interacción del usuario con los controles.
 * Emite eventos que el Controller escucha para actualizar el modelo.
 */
export class ControlsView {
  private readonly showNumbersCheckbox: HTMLInputElement;

  /** Emitido cuando el usuario cambia el checkbox. */
  readonly onShowNumbersToggled = new PuzzleEvent<boolean>();

  /** Emitido cuando el usuario pulsa Shuffle. */
  readonly onShuffleRequested = new PuzzleEvent<void>();

  /** Emitido cuando el usuario pulsa Solve. */
  readonly onSolveRequested = new PuzzleEvent<void>();

  constructor() {
    this.showNumbersCheckbox =
      this.getElement<HTMLInputElement>(DOM_IDS.SHOW_NUMBERS_CHECKBOX);
    this.bindCheckbox();
    this.bindButton(DOM_IDS.BTN_SHUFFLE, () => {
      this.onShuffleRequested.trigger(undefined as void);
    });
    this.bindButton(DOM_IDS.BTN_SOLVE, () => {
      this.onSolveRequested.trigger(undefined as void);
    });
  }

  /** Sincroniza el estado visual del checkbox con el modelo. */
  setShowNumbers(value: boolean): void {
    this.showNumbersCheckbox.checked = value;
  }

  private bindCheckbox(): void {
    this.showNumbersCheckbox.addEventListener('change', () => {
      this.onShowNumbersToggled.trigger(this.showNumbersCheckbox.checked);
    });
  }

  private bindButton(buttonId: string, handler: () => void): void {
    const button = this.getElement<HTMLButtonElement>(buttonId);
    button.addEventListener('click', handler);
  }

  private getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T | null;
    if (!element) throw new Error(`Elemento no encontrado: #${id}`);
    return element;
  }
}
