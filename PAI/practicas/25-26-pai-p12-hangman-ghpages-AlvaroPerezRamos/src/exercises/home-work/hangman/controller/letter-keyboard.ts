/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file letter-keyboard.ts
 * @description Teclado de letras del panel de juego.
 *   Construye los botones y emite un evento al controlador al pulsarlos.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {Event} from '../observer/event.js';

/** Alfabeto español, incluyendo la letra ñ. */
const SPANISH_ALPHABET: readonly string[] = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

/**
 * Teclado de letras. Emite `letterPressEvent` cuando el jugador pulsa un botón.
 */
export class LetterKeyboard {
  /** Evento emitido al pulsar una letra. */
  readonly letterPressEvent = new Event<string>();

  private readonly buttons: Map<string, HTMLButtonElement> = new Map();

  /**
   * @param container Elemento del DOM donde se inyectan los botones.
   */
  constructor(private readonly container: HTMLElement) {
    this.buildButtons();
  }

  /**
   * Marca una letra como acertada.
   * @param letter Letra acertada.
   */
  markCorrect(letter: string): void {
    const button = this.buttons.get(letter);
    if (!button) return;
    button.disabled = true;
    button.classList.add('letter-keyboard__key--correct');
  }

  /**
   * Marca una letra como fallada.
   * @param letter Letra fallada.
   */
  markWrong(letter: string): void {
    const button = this.buttons.get(letter);
    if (!button) return;
    button.disabled = true;
    button.classList.add('letter-keyboard__key--wrong');
  }

  /** Deshabilita todas las teclas al terminar la partida. */
  disableAll(): void {
    for (const button of this.buttons.values()) {
      button.disabled = true;
    }
  }

  /** Reactiva todas las teclas y limpia estilos para una nueva partida. */
  reset(): void {
    for (const button of this.buttons.values()) {
      button.disabled = false;
      button.classList.remove(
          'letter-keyboard__key--correct',
          'letter-keyboard__key--wrong',
      );
    }
  }

  private buildButtons(): void {
    this.container.innerHTML = '';
    for (const letter of SPANISH_ALPHABET) {
      const button = document.createElement('button');
      button.textContent = letter.toUpperCase();
      button.className = 'letter-keyboard__key';
      button.type = 'button';
      button.addEventListener('click', () => {
        this.letterPressEvent.trigger(letter);
      });
      this.buttons.set(letter, button);
      this.container.appendChild(button);
    }
  }
}
