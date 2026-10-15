/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file controls-view.test.ts
 * @description Tests unitarios de ControlsView.
 *   Verifica que los eventos de clic emiten los eventos correctos, que
 *   updateButtonStates habilita/deshabilita los botones según las reglas,
 *   que updateCounters actualiza los contadores, y que showGameResult
 *   abre el dialog nativo con el mensaje y clase correctos.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {ControlsView} from '../../balatro/view/controls-view';
import {describe, it, expect, vitest, beforeEach, afterEach} from 'vitest';

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Construye un ControlsView con el DOM mínimo necesario.
 * El <dialog> de resultado se espía para verificar showModal/close
 * sin depender de la implementación nativa de JSDOM.
 */
function buildControls(): {
  view: ControlsView;
  playHandButton: HTMLButtonElement;
  discardButton: HTMLButtonElement;
  newGameButton: HTMLButtonElement;
  handsLeftDisplay: HTMLElement;
  discardsLeftDisplay: HTMLElement;
  sortHandButton: HTMLButtonElement;
  infoButton: HTMLButtonElement;
  gameResultModal: HTMLDialogElement;
  gameResultMessage: HTMLElement;
  gameResultClose: HTMLButtonElement;
  showModalSpy: ReturnType<typeof vitest.fn>;
  closeSpy: ReturnType<typeof vitest.fn>;
  } {
  const playHandButton = document.createElement('button');
  const discardButton = document.createElement('button');
  const newGameButton = document.createElement('button');
  const handsLeftDisplay = document.createElement('span');
  const discardsLeftDisplay = document.createElement('span');
  const sortHandButton = document.createElement('button');
  const infoButton = document.createElement('button');

  // Construir el <dialog> de resultado y añadirlo al DOM.
  const gameResultModal = document.createElement('dialog');
  gameResultModal.id = 'game-result-modal';
  const gameResultMessage = document.createElement('div');
  gameResultMessage.id = 'game-result-message';
  const gameResultClose = document.createElement('button');
  gameResultClose.id = 'game-result-close';
  gameResultModal.appendChild(gameResultMessage);
  gameResultModal.appendChild(gameResultClose);
  document.body.appendChild(gameResultModal);

  // JSDOM no implementa showModal/close — los espiaremos.
  const showModalSpy = vitest.fn();
  const closeSpy = vitest.fn();
  gameResultModal.showModal = showModalSpy;
  gameResultModal.close = closeSpy;

  const view = new ControlsView(
      playHandButton,
      discardButton,
      newGameButton,
      infoButton,
      handsLeftDisplay,
      discardsLeftDisplay,
      sortHandButton,
  );

  return {
    view,
    playHandButton,
    discardButton,
    newGameButton,
    infoButton,
    handsLeftDisplay,
    discardsLeftDisplay,
    sortHandButton,
    gameResultModal,
    gameResultMessage,
    gameResultClose,
    showModalSpy,
    closeSpy,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ControlsView', () => {
  let controls: ReturnType<typeof buildControls>;

  beforeEach(() => {
    controls = buildControls();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // ── playHandEvent ──────────────────────────────────────────────────────

  describe('playHandEvent', () => {
    it('debe emitir playHandEvent al hacer clic en el botón Play Hand', () => {
      const listener = vitest.fn();
      controls.view.onPlayHand(listener);

      controls.playHandButton.click();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── discardEvent ───────────────────────────────────────────────────────

  describe('discardEvent', () => {
    it('debe emitir discardEvent al hacer clic en el botón Discard', () => {
      const listener = vitest.fn();
      controls.view.onDiscard(listener);

      controls.discardButton.click();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── newGameEvent ───────────────────────────────────────────────────────

  describe('newGameEvent', () => {
    it('debe emitir newGameEvent al hacer clic en el botón New Game del bloque 6', () => {
      const listener = vitest.fn();
      controls.view.onNewGame(listener);

      controls.newGameButton.click();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('debe emitir newGameEvent al hacer clic en el botón del dialog de resultado', () => {
      const listener = vitest.fn();
      controls.view.onNewGame(listener);

      controls.gameResultClose.click();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── sortHandEvent ──────────────────────────────────────────────────────

  describe('sortHandEvent', () => {
    it('debe emitir sortHandEvent con "rank" al hacer clic inicialmente', () => {
      const listener = vitest.fn();
      controls.view.onSortHand(listener);

      controls.sortHandButton.click();

      expect(listener).toHaveBeenCalledWith('rank');
    });

    it('debe alternar entre "rank" y "suit" en cada clic', () => {
      const listener = vitest.fn();
      controls.view.onSortHand(listener);

      controls.sortHandButton.click(); // rank
      controls.sortHandButton.click(); // suit
      controls.sortHandButton.click(); // rank

      expect(listener).toHaveBeenNthCalledWith(1, 'rank');
      expect(listener).toHaveBeenNthCalledWith(2, 'suit');
      expect(listener).toHaveBeenNthCalledWith(3, 'rank');
    });
  });

  // ── infoButtonEvent ────────────────────────────────────────────────────

  describe('infoButtonEvent', () => {
    it('debe emitir infoButtonEvent al hacer clic en el botón Info', () => {
      const listener = vitest.fn();
      controls.view.onHandInfo(listener);

      controls.infoButton.click();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── updateButtonStates ─────────────────────────────────────────────────

  describe('updateButtonStates', () => {
    it('debe habilitar playHand y discard si hay selección y quedan recursos', () => {
      controls.view.updateButtonStates(true, 2, 2, false);

      expect(controls.playHandButton.disabled).toBe(false);
      expect(controls.discardButton.disabled).toBe(false);
    });

    it('debe deshabilitar playHand y discard si no hay selección', () => {
      controls.view.updateButtonStates(false, 2, 2, false);

      expect(controls.playHandButton.disabled).toBe(true);
      expect(controls.discardButton.disabled).toBe(true);
    });

    it('debe deshabilitar playHand si handsLeft es 0 aunque haya selección', () => {
      controls.view.updateButtonStates(true, 0, 2, false);

      expect(controls.playHandButton.disabled).toBe(true);
    });

    it('debe deshabilitar discard si discardsLeft es 0 aunque haya selección', () => {
      controls.view.updateButtonStates(true, 2, 0, false);

      expect(controls.discardButton.disabled).toBe(true);
    });

    it('debe deshabilitar ambos botones si isGameOver es true', () => {
      controls.view.updateButtonStates(true, 3, 3, true);

      expect(controls.playHandButton.disabled).toBe(true);
      expect(controls.discardButton.disabled).toBe(true);
    });
  });

  // ── updateCounters ─────────────────────────────────────────────────────

  describe('updateCounters', () => {
    it('debe actualizar handsLeftDisplay con el valor positivo dado', () => {
      controls.view.updateCounters(2, 3);
      expect(controls.handsLeftDisplay.textContent).toBe('2');
    });

    it('debe actualizar discardsLeftDisplay con el valor positivo dado', () => {
      controls.view.updateCounters(3, 1);
      expect(controls.discardsLeftDisplay.textContent).toBe('1');
    });

    it('debe ignorar handsLeft si es negativo', () => {
      controls.handsLeftDisplay.textContent = '3';
      controls.view.updateCounters(-1, 2);
      expect(controls.handsLeftDisplay.textContent).toBe('3');
    });

    it('debe ignorar discardsLeft si es negativo', () => {
      controls.discardsLeftDisplay.textContent = '3';
      controls.view.updateCounters(2, -1);
      expect(controls.discardsLeftDisplay.textContent).toBe('3');
    });

    it('debe ignorar handsLeft si es null', () => {
      controls.handsLeftDisplay.textContent = '3';
      controls.view.updateCounters(null, 2);
      expect(controls.handsLeftDisplay.textContent).toBe('3');
    });

    it('debe ignorar discardsLeft si es null', () => {
      controls.discardsLeftDisplay.textContent = '3';
      controls.view.updateCounters(2, null);
      expect(controls.discardsLeftDisplay.textContent).toBe('3');
    });
  });

  // ── showGameResult ─────────────────────────────────────────────────────

  describe('showGameResult', () => {
    it('debe llamar a showModal() en el dialog de resultado', () => {
      controls.view.showGameResult(true, 350);

      expect(controls.showModalSpy).toHaveBeenCalledTimes(1);
    });

    it('en victoria el mensaje debe contener la puntuación', () => {
      controls.view.showGameResult(true, 350);

      expect(controls.gameResultMessage.textContent).toContain('350');
    });

    it('en victoria debe añadir game-result-modal--win al dialog', () => {
      controls.view.showGameResult(true, 350);

      expect(
          controls.gameResultModal.classList.contains('game-result-modal--win'),
      ).toBe(true);
    });

    it('en derrota el mensaje debe contener la puntuación', () => {
      controls.view.showGameResult(false, 120);

      expect(controls.gameResultMessage.textContent).toContain('120');
    });

    it('en derrota debe añadir game-result-modal--loss al dialog', () => {
      controls.view.showGameResult(false, 120);

      expect(
          controls.gameResultModal.classList.contains('game-result-modal--loss'),
      ).toBe(true);
    });

    it('debe eliminar la clase contraria al cambiar de resultado', () => {
      controls.view.showGameResult(true, 300);
      controls.view.showGameResult(false, 100);

      expect(
          controls.gameResultModal.classList.contains('game-result-modal--win'),
      ).toBe(false);
      expect(
          controls.gameResultModal.classList.contains('game-result-modal--loss'),
      ).toBe(true);
    });
  });

  // ── resetForNewGame ────────────────────────────────────────────────────

  describe('resetForNewGame', () => {
    it('debe llamar a close() en el dialog si estaba abierto', () => {
      // Simulamos que el dialog está abierto.
      Object.defineProperty(controls.gameResultModal, 'open', {value: true, configurable: true});
      controls.view.resetForNewGame();

      expect(controls.closeSpy).toHaveBeenCalledTimes(1);
    });

    it('no debe llamar a close() si el dialog ya estaba cerrado', () => {
      Object.defineProperty(controls.gameResultModal, 'open', {value: false, configurable: true});
      controls.view.resetForNewGame();

      expect(controls.closeSpy).not.toHaveBeenCalled();
    });
  });
});
