/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file letter-keyboard.test.ts
 * @description Tests unitarios de LetterKeyboard.
 *   Usa JSDOM para crear el contenedor y verificar que los botones se
 *   construyen correctamente, que los eventos de click disparan
 *   letterPressEvent, y que markCorrect, markWrong, disableAll y reset
 *   funcionan según su contrato.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {LetterKeyboard} from '../hangman/controller/letter-keyboard';

import {describe, it, expect, jest} from '@jest/globals';

/** Número de letras del alfabeto español usado por LetterKeyboard. */
const SPANISH_ALPHABET_LENGTH = 27;

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Crea un LetterKeyboard con un contenedor limpio.
 *
 * @returns Objeto con el teclado y su contenedor para aserciones.
 */
function buildKeyboard(): {keyboard: LetterKeyboard; container: HTMLElement} {
  const container = document.createElement('div');
  const keyboard = new LetterKeyboard(container);
  return {keyboard, container};
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('LetterKeyboard', () => {
  // ── Construcción de botones ────────────────────────────────────────────

  describe('construcción', () => {
    it(`debe crear ${SPANISH_ALPHABET_LENGTH} botones (alfabeto español con ñ)`, () => {
      const {container} = buildKeyboard();
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(SPANISH_ALPHABET_LENGTH);
    });

    it('todos los botones deben tener type="button"', () => {
      const {container} = buildKeyboard();
      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const allAreButton = [...buttons].every((btn) => btn.type === 'button');
      expect(allAreButton).toBe(true);
    });

    it('los botones deben estar en orden de A a Z con Ñ en su posición', () => {
      const {container} = buildKeyboard();
      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const labels = [...buttons].map((btn) => btn.textContent?.toLowerCase() ?? '');
      // Ñ debe aparecer entre N y O
      const indexN = labels.indexOf('n');
      const indexNY = labels.indexOf('ñ');
      const indexO = labels.indexOf('o');
      expect(indexNY).toBe(indexN + 1);
      expect(indexO).toBe(indexNY + 1);
    });
  });

  // ── letterPressEvent ───────────────────────────────────────────────────

  describe('letterPressEvent', () => {
    it('debe emitir la letra en minúsculas al hacer click en un botón', () => {
      const {keyboard, container} = buildKeyboard();
      const listener = jest.fn();
      keyboard.letterPressEvent.addListener(listener);

      const buttonA = container.querySelector<HTMLButtonElement>('button');
      buttonA?.click();

      expect(listener).toHaveBeenCalledWith('a');
    });

    it('debe emitir ñ al hacer click en el botón de la Ñ', () => {
      const {keyboard, container} = buildKeyboard();
      const listener = jest.fn();
      keyboard.letterPressEvent.addListener(listener);

      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const buttonNY = [...buttons].find(
          (btn) => btn.textContent?.toLowerCase() === 'ñ',
      );
      buttonNY?.click();

      expect(listener).toHaveBeenCalledWith('ñ');
    });
  });

  // ── markCorrect ────────────────────────────────────────────────────────

  describe('markCorrect', () => {
    it('debe deshabilitar el botón de la letra acertada', () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.markCorrect('a');

      const buttonA = container.querySelector<HTMLButtonElement>('button');
      expect(buttonA?.disabled).toBe(true);
    });

    it('debe añadir la clase letter-keyboard__key--correct al botón', () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.markCorrect('a');

      const buttonA = container.querySelector<HTMLButtonElement>('button');
      expect(buttonA?.classList.contains('letter-keyboard__key--correct')).toBe(true);
    });

    it('no debe lanzar error si la letra no existe en el teclado', () => {
      const {keyboard} = buildKeyboard();
      expect(() => keyboard.markCorrect('1')).not.toThrow();
    });
  });

  // ── markWrong ──────────────────────────────────────────────────────────

  describe('markWrong', () => {
    it('debe deshabilitar el botón de la letra fallada', () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.markWrong('z');

      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const buttonZ = [...buttons].find(
          (btn) => btn.textContent?.toLowerCase() === 'z',
      );
      expect(buttonZ?.disabled).toBe(true);
    });

    it('debe añadir la clase letter-keyboard__key--wrong al botón', () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.markWrong('z');

      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const buttonZ = [...buttons].find(
          (btn) => btn.textContent?.toLowerCase() === 'z',
      );
      expect(buttonZ?.classList.contains('letter-keyboard__key--wrong')).toBe(true);
    });
  });

  // ── disableAll ─────────────────────────────────────────────────────────

  describe('disableAll', () => {
    it(`debe deshabilitar los ${SPANISH_ALPHABET_LENGTH} botones`, () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.disableAll();

      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const allDisabled = [...buttons].every((btn) => btn.disabled);
      expect(allDisabled).toBe(true);
    });
  });

  // ── reset ──────────────────────────────────────────────────────────────

  describe('reset', () => {
    it('debe reactivar todos los botones deshabilitados', () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.disableAll();
      keyboard.reset();

      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const allEnabled = [...buttons].every((btn) => !btn.disabled);
      expect(allEnabled).toBe(true);
    });

    it('debe eliminar la clase --correct de los botones marcados', () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.markCorrect('a');
      keyboard.reset();

      const buttonA = container.querySelector<HTMLButtonElement>('button');
      expect(buttonA?.classList.contains('letter-keyboard__key--correct')).toBe(false);
    });

    it('debe eliminar la clase --wrong de los botones marcados', () => {
      const {keyboard, container} = buildKeyboard();
      keyboard.markWrong('z');
      keyboard.reset();

      const buttons = container.querySelectorAll<HTMLButtonElement>('button');
      const buttonZ = [...buttons].find(
          (btn) => btn.textContent?.toLowerCase() === 'z',
      );
      expect(buttonZ?.classList.contains('letter-keyboard__key--wrong')).toBe(false);
    });
  });
});
