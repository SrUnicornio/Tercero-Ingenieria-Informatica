/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file view-input-router.test.ts
 * @description Tests unitarios de ViewInputRouter.
 *   Verifica que cada método `onXxx` delega en la sub-vista correcta
 *   ({@link HandAreaView} o {@link ControlsView}) usando vitest.spyOn.
 *   Se construyen instancias reales de las sub-vistas con elementos DOM
 *   en memoria para no acoplar el test a implementaciones internas.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {ViewInputRouter} from '../../balatro/view/view-input-router';
import {HandAreaView} from '../../balatro/view/hand-area-view';
import {ControlsView} from '../../balatro/view/controls-view';
import {Card} from '../../balatro/model/game/card';
import {describe, it, expect, vitest, beforeEach} from 'vitest';

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Construye un ViewInputRouter con sub-vistas reales sobre elementos DOM
 * en memoria.
 */
function buildRouter(): {
  router: ViewInputRouter;
  handArea: HandAreaView;
  controls: ControlsView;
  playHandButton: HTMLButtonElement;
  discardButton: HTMLButtonElement;
  newGameButton: HTMLButtonElement;
  sortHandButton: HTMLButtonElement;
  infoButton: HTMLButtonElement;
  handAreaContainer: HTMLElement;
  } {
  const handAreaContainer = document.createElement('div');
  const playHandButton = document.createElement('button');
  const discardButton = document.createElement('button');
  const newGameButton = document.createElement('button');
  const sortHandButton = document.createElement('button');
  const infoButton = document.createElement('button');
  const handsLeftDisplay = document.createElement('span');
  const discardsLeftDisplay = document.createElement('span');
  // El <dialog> de resultado requiere estar en el DOM para que ControlsView
  // pueda encontrarlo por ID en su constructor.
  const gameResultModal = document.createElement('dialog');
  gameResultModal.id = 'game-result-modal';
  const gameResultMessage = document.createElement('div');
  gameResultMessage.id = 'game-result-message';
  const gameResultClose = document.createElement('button');
  gameResultClose.id = 'game-result-close';
  gameResultModal.appendChild(gameResultMessage);
  gameResultModal.appendChild(gameResultClose);
  gameResultModal.showModal = () => {};
  gameResultModal.close = () => {};
  document.body.appendChild(gameResultModal);

  const handArea = new HandAreaView(handAreaContainer);
  const controls = new ControlsView(
      playHandButton, discardButton, newGameButton, infoButton,
      handsLeftDisplay, discardsLeftDisplay,
      sortHandButton,
  );

  const router = new ViewInputRouter(handArea, controls);
  return {
    router, handArea, controls,
    playHandButton, discardButton, newGameButton, sortHandButton, infoButton,
    handAreaContainer,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ViewInputRouter', () => {
  let setup: ReturnType<typeof buildRouter>;

  beforeEach(() => {
    setup = buildRouter();
  });

  // ── onCardClicked ──────────────────────────────────────────────────────

  describe('onCardClicked', () => {
    it('debe delegar en HandAreaView.onCardClicked', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'onCardClicked');
      setup.router.onCardClicked(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('el listener recibe el índice de la carta pulsada', () => {
      const listener = vitest.fn<(index: number) => void>();
      setup.router.onCardClicked(listener);

      // Renderizamos una carta y la pulsamos
      const card = new Card(5, 'spades', '5', '');
      setup.handArea.renderHand([card]);
      setup.handAreaContainer.querySelector<HTMLElement>('.card-slot')!.click();

      expect(listener).toHaveBeenCalledWith(0);
    });
  });

  // ── onPlayHand ─────────────────────────────────────────────────────────

  describe('onPlayHand', () => {
    it('debe delegar en ControlsView.onPlayHand', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onPlayHand');
      setup.router.onPlayHand(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('el listener se invoca al pulsar el botón Play Hand', () => {
      const listener = vitest.fn();
      setup.router.onPlayHand(listener);
      setup.playHandButton.click();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── onDiscard ──────────────────────────────────────────────────────────

  describe('onDiscard', () => {
    it('debe delegar en ControlsView.onDiscard', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onDiscard');
      setup.router.onDiscard(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('el listener se invoca al pulsar el botón Discard', () => {
      const listener = vitest.fn();
      setup.router.onDiscard(listener);
      setup.discardButton.click();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── onNewGame ──────────────────────────────────────────────────────────

  describe('onNewGame', () => {
    it('debe delegar en ControlsView.onNewGame', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onNewGame');
      setup.router.onNewGame(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('el listener se invoca al pulsar el botón New Game', () => {
      const listener = vitest.fn();
      setup.router.onNewGame(listener);
      setup.newGameButton.click();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── onSortHand ─────────────────────────────────────────────────────────

  describe('onSortHand', () => {
    it('debe delegar en ControlsView.onSortHand', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onSortHand');
      setup.router.onSortHand(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('el listener recibe "rank" en el primer clic', () => {
      const listener = vitest.fn<(criterion: 'rank' | 'suit') => void>();
      setup.router.onSortHand(listener);
      setup.sortHandButton.click();
      expect(listener).toHaveBeenCalledWith('rank');
    });

    it('el listener recibe "suit" en el segundo clic', () => {
      const listener = vitest.fn<(criterion: 'rank' | 'suit') => void>();
      setup.router.onSortHand(listener);
      setup.sortHandButton.click(); // rank
      setup.sortHandButton.click(); // suit
      expect(listener).toHaveBeenNthCalledWith(2, 'suit');
    });

    it('alterna correctamente entre rank y suit en clics sucesivos', () => {
      const received: ('rank' | 'suit')[] = [];
      setup.router.onSortHand((c) => received.push(c));
      for (let i = 0; i < 4; i++) setup.sortHandButton.click();
      expect(received).toEqual(['rank', 'suit', 'rank', 'suit']);
    });
  });

  // ── onHandInfo ────────────────────────────────────────────────────────

  describe('onHandInfo', () => {
    it('debe delegar en ControlsView.onHandInfo', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onHandInfo');
      setup.router.onHandInfo(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('el listener se invoca al pulsar el botón Hand Info', () => {
      const listener = vitest.fn();
      setup.router.onHandInfo(listener);
      setup.infoButton.click();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── aislamiento entre canales ──────────────────────────────────────────

  describe('aislamiento entre canales', () => {
    it('pulsar Discard no debe invocar el listener de Play Hand', () => {
      const playListener = vitest.fn();
      setup.router.onPlayHand(playListener);
      setup.discardButton.click();
      expect(playListener).not.toHaveBeenCalled();
    });

    it('pulsar Play Hand no debe invocar el listener de Discard', () => {
      const discardListener = vitest.fn();
      setup.router.onDiscard(discardListener);
      setup.playHandButton.click();
      expect(discardListener).not.toHaveBeenCalled();
    });
  });
});
