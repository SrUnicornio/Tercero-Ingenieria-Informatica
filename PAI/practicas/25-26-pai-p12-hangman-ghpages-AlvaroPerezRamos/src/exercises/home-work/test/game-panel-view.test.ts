/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file game-panel-view.test.ts
 * @description Tests unitarios de GamePanelView.
 *   Usa el entorno JSDOM (configurado en jest.config) para operar sobre
 *   elementos HTML reales en memoria. No hay dependencias de red ni de canvas.
 *
 *   Cubre: construcción de casillas, separadores en palabras compuestas,
 *   revelado de letras, contador de intentos, listado de letras falladas
 *   y mensajes de victoria/derrota.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {GamePanelView} from '../hangman/view/game-panel-view';
import {MAX_FAILED_ATTEMPTS} from '../hangman/model/hangman-model';

import {describe, it, expect} from '@jest/globals';

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Crea un conjunto de elementos HTML mínimo y devuelve un GamePanelView
 * ya construido con ellos.
 *
 * @param word     Palabra con la que inicializar el panel.
 * @param category Categoría mostrada al jugador.
 * @returns Objeto con la vista y los elementos para aserciones.
 */
function buildPanel(word: string, category = 'Test'): {
  view: GamePanelView;
  wordDisplay: HTMLElement;
  remainingAttemptsEl: HTMLElement;
  failedLettersEl: HTMLElement;
  gameStatusEl: HTMLElement;
  categoryLabelEl: HTMLElement;
} {
  const wordDisplay = document.createElement('div');
  const remainingAttemptsEl = document.createElement('span');
  const failedLettersEl = document.createElement('span');
  const gameStatusEl = document.createElement('p');
  const categoryLabelEl = document.createElement('span');

  const view = new GamePanelView(
      wordDisplay,
      remainingAttemptsEl,
      failedLettersEl,
      gameStatusEl,
      categoryLabelEl,
  );

  view.initWordDisplay(word.length, category, word);

  return {view, wordDisplay, remainingAttemptsEl,
    failedLettersEl, gameStatusEl, categoryLabelEl,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GamePanelView', () => {
  // ── initWordDisplay ────────────────────────────────────────────────────

  describe('initWordDisplay', () => {
    it('debe crear una celda por letra normal', () => {
      const {wordDisplay} = buildPanel('gato');
      const cells = wordDisplay.querySelectorAll('.word-display__cell');
      expect(cells).toHaveLength(4);
    });

    it('debe crear una celda de espacio para los espacios en palabras compuestas', () => {
      const {wordDisplay} = buildPanel('osa polar');
      const spaces = wordDisplay.querySelectorAll('.word-display__space');
      expect(spaces).toHaveLength(1);
    });

    it('debe crear una celda de guion visible para los guiones', () => {
      const {wordDisplay} = buildPanel('bien-estar');
      const hyphens = wordDisplay.querySelectorAll('.word-display__hyphen');
      expect(hyphens).toHaveLength(1);
    });

    it('debe mostrar el número máximo de intentos en remainingAttemptsEl', () => {
      const {remainingAttemptsEl} = buildPanel('sol');
      expect(remainingAttemptsEl.textContent).toBe(String(MAX_FAILED_ATTEMPTS));
    });

    it('debe mostrar la categoría en categoryLabelEl', () => {
      const {categoryLabelEl} = buildPanel('oso', 'Animales');
      expect(categoryLabelEl.textContent).toBe('Animales');
    });

    it('debe limpiar el mensaje de estado al iniciar', () => {
      const {gameStatusEl} = buildPanel('oso');
      expect(gameStatusEl.textContent).toBe('');
    });

    it('debe asignar data-index correlativo a cada celda', () => {
      const {wordDisplay} = buildPanel('abcd');
      const cells = wordDisplay.querySelectorAll<HTMLElement>('[data-index]');
      const indices = [...cells].map((cell) => Number(cell.dataset['index']));
      expect(indices).toEqual([0, 1, 2, 3]);
    });
  });

  // ── revealLetter ───────────────────────────────────────────────────────

  describe('revealLetter', () => {
    it('debe mostrar en mayúsculas la letra en la posición indicada', () => {
      const {view, wordDisplay} = buildPanel('gato');
      view.revealLetter([0]);

      const cell = wordDisplay.querySelector<HTMLElement>('[data-index="0"]');
      expect(cell?.textContent).toBe('G');
    });

    it('debe revelar varias posiciones a la vez', () => {
      const {view, wordDisplay} = buildPanel('banana');
      view.revealLetter([1, 3, 5]);

      const texts = [1, 3, 5].map((i) => {
        return wordDisplay.querySelector<HTMLElement>(`[data-index="${i}"]`)?.textContent;
      });
      expect(texts).toEqual(['A', 'A', 'A']);
    });

    it('debe mostrar el carácter original (con acento) en mayúsculas', () => {
      const {view, wordDisplay} = buildPanel('Águila');
      // posición 0 es 'Á'
      view.revealLetter([0]);

      const cell = wordDisplay.querySelector<HTMLElement>('[data-index="0"]');
      expect(cell?.textContent).toBe('Á');
    });
  });

  // ── addFailedLetter ────────────────────────────────────────────────────

  describe('addFailedLetter', () => {
    it('debe sustituir el guion inicial con la primera letra fallada', () => {
      const {view, failedLettersEl} = buildPanel('sol');
      view.addFailedLetter('z', 1);
      expect(failedLettersEl.textContent).toBe('Z');
    });

    it('debe acumular las letras falladas separadas por coma', () => {
      const {view, failedLettersEl} = buildPanel('sol');
      view.addFailedLetter('z', 1);
      view.addFailedLetter('x', 2);
      expect(failedLettersEl.textContent).toBe('Z, X');
    });

    it('debe actualizar remainingAttemptsEl restando los fallos', () => {
      const {view, remainingAttemptsEl} = buildPanel('sol');
      view.addFailedLetter('z', 1);
      expect(remainingAttemptsEl.textContent).
          toBe(String(MAX_FAILED_ATTEMPTS - 1));
    });
  });

  // ── showWin ────────────────────────────────────────────────────────────

  describe('showWin', () => {
    it('debe mostrar un mensaje que contiene la palabra en mayúsculas', () => {
      const {view, gameStatusEl} = buildPanel('gato');
      view.showWin('gato');
      expect(gameStatusEl.textContent).toContain('GATO');
    });

    it('debe añadir la clase game-status--win al elemento de estado', () => {
      const {view, gameStatusEl} = buildPanel('gato');
      view.showWin('gato');
      expect(gameStatusEl.classList.contains('game-status--win')).toBe(true);
    });
  });

  // ── showLoss ───────────────────────────────────────────────────────────

  describe('showLoss', () => {
    it('debe mostrar un mensaje que contiene la palabra en mayúsculas', () => {
      const {view, gameStatusEl} = buildPanel('tigre');
      view.showLoss('tigre');
      expect(gameStatusEl.textContent).toContain('TIGRE');
    });

    it('debe añadir la clase game-status--lose al elemento de estado', () => {
      const {view, gameStatusEl} = buildPanel('tigre');
      view.showLoss('tigre');
      expect(gameStatusEl.classList.contains('game-status--lose')).toBe(true);
    });

    it('debe revelar todas las celdas no descubiertas al perder', () => {
      const {view, wordDisplay} = buildPanel('sol');
      // No se revela ninguna letra antes de perder
      view.showLoss('sol');

      const cells = wordDisplay.querySelectorAll<HTMLElement>('.word-display__cell');
      const allRevealed = [...cells].every((cell) => cell.textContent !== '');
      expect(allRevealed).toBe(true);
    });
  });
});
