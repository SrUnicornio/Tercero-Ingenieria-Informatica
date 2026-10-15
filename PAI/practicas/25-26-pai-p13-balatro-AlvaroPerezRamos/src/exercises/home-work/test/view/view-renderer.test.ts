/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file view-renderer.test.ts
 * @description Tests unitarios de ViewRenderer.
 *   Verifica que cada método `onXxx(data)` delega en la sub-vista correcta
 *   usando vitest.spyOn sobre instancias reales con DOM en memoria.
 *   Se comprueba tanto la delegación como los argumentos concretos pasados.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {ViewRenderer} from '../../balatro/view/view-renderer';
import {HandAreaView} from '../../balatro/view/hand-area-view';
import {ScorePanelView} from '../../balatro/view/score-panel-view';
import {ControlsView} from '../../balatro/view/controls-view';
import {Card} from '../../balatro/model/game/card';
import {describe, it, expect, vitest, beforeEach} from 'vitest';
import type {
  GameStartedData,
  HandPlayedData,
  CardsDiscardedData,
  ScorePreviewData,
  GameEndedData,
  CardToggledData,
} from '../../balatro/types/event-payloads';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCard(rank: number = 5): Card {
  return new Card(rank, 'spades', String(rank) as never, `/img/${rank}.png`);
}

function makeHand(size: number = 8): Card[] {
  return Array.from({length: size}, (_, i) => makeCard(i + 2));
}

/**
 * Construye un ViewRenderer con sub-vistas reales sobre elementos DOM
 * en memoria. Retorna también las referencias a los elementos para
 * verificar cambios directos en el DOM.
 */
function buildRenderer(): {
  renderer: ViewRenderer;
  handArea: HandAreaView;
  scorePanel: ScorePanelView;
  controls: ControlsView;
  } {
  const handAreaContainer = document.createElement('div');
  const playHandButton = document.createElement('button');
  const discardButton = document.createElement('button');
  const newGameButton = document.createElement('button');
  const infoButton = document.createElement('button');
  const sortHandButton = document.createElement('button');
  const handsLeftDisplay = document.createElement('span');
  const discardsLeftDisplay = document.createElement('span');
  const handArea = new HandAreaView(handAreaContainer);

  const scorePanel = new ScorePanelView(
      {
        deckRemaining: document.createElement('span'),
        scoreTotal: document.createElement('span'),
        progressFill: document.createElement('progress'),
        progressText: document.createElement('span'),
      },
      {
        handSizeIndicator: document.createElement('span'),
        handName: document.createElement('span'),
        chips: document.createElement('span'),
        multiplier: document.createElement('span'),
        total: document.createElement('span'),
      },
  );

  // El <dialog> de resultado requiere estar en el DOM para el constructor de ControlsView.
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

  const controls = new ControlsView(
      playHandButton, discardButton, newGameButton,
      infoButton,
      handsLeftDisplay, discardsLeftDisplay,
      sortHandButton,
  );

  const renderer = new ViewRenderer(handArea, scorePanel, controls);
  return {renderer, handArea, scorePanel, controls};
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ViewRenderer', () => {
  let setup: ReturnType<typeof buildRenderer>;

  beforeEach(() => {
    setup = buildRenderer();
  });

  // ── onGameStarted ──────────────────────────────────────────────────────

  describe('onGameStarted', () => {
    const makeGameStartedData = (): GameStartedData => ({
      hand: makeHand(),
      deckRemaining: 44,
      initialHands: 3,
      initialDiscards: 3,
      maxHandSize: 5,
    });
    it('debe llamar a HandAreaView.renderHand con la mano recibida', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'renderHand');
      const hand = makeHand();
      const data: GameStartedData = {hand, deckRemaining: 44,
        initialHands: 3, initialDiscards: 3, maxHandSize: 5,
      };
      setup.renderer.onGameStarted(data);
      expect(spy).toHaveBeenCalledWith(hand);
    });

    it('debe llamar a ScorePanelView.updateDeckRemaining con deckRemaining', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateDeckRemaining');
      setup.renderer.onGameStarted(makeGameStartedData());
      expect(spy).toHaveBeenCalledWith(44);
    });

    it('debe llamar a ScorePanelView.updateTotalScore con 0', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateTotalScore');
      setup.renderer.onGameStarted(makeGameStartedData());
      expect(spy).toHaveBeenCalledWith(0);
    });

    it('debe llamar a ControlsView.resetForNewGame', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'resetForNewGame');
      setup.renderer.onGameStarted(makeGameStartedData());
      expect(spy).toHaveBeenCalled();
    });

    it('debe inicializar los contadores a 3 manos y 3 descartes', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateCounters');
      setup.renderer.onGameStarted(makeGameStartedData());
      expect(spy).toHaveBeenCalledWith(3, 3);
    });

    it('debe habilitar botones con el estado inicial', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      setup.renderer.onGameStarted(makeGameStartedData());
      expect(spy).toHaveBeenCalledWith(false, 3, 3, false);
    });
  });

  // ── onCardToggled ──────────────────────────────────────────────────────

  describe('onCardToggled', () => {
    it('debe llamar a setCardSelected con el índice e isSelected correctos', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'setCardSelected');
      const data: CardToggledData = {cardIndex: 4, isSelected: true};
      setup.renderer.onCardToggled(data, 3, 3, 1);
      expect(spy).toHaveBeenCalledWith(4, true);
    });

    it('debe pasar hasSelection=true a updateButtonStates cuando hay selección', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      setup.renderer.onCardToggled({cardIndex: 2, isSelected: true}, 3, 3, 1);
      expect(spy).toHaveBeenCalledWith(true, 3, 3, false);
    });

    it('debe pasar hasSelection=false a updateButtonStates cuando la selección queda vacía', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      setup.renderer.onCardToggled({cardIndex: 0, isSelected: false}, 3, 3, 0);
      expect(spy).toHaveBeenCalledWith(false, 3, 3, false);
    });
  });

  // ── onHandPlayed ───────────────────────────────────────────────────────

  describe('onHandPlayed', () => {
    const makeHandPlayedData = (): HandPlayedData => ({
      handResult: {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []},
      roundScore: 28,
      totalScore: 150,
      deckRemaining: 36,
      handsLeft: 2,
      hand: makeHand(),
      replacedIndices: [],
      replacementCards: [],
    });

    it('debe llamar a renderHand con la mano actualizada', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'renderHand');
      const data = makeHandPlayedData();
      setup.renderer.onHandPlayed(data);
      expect(spy).toHaveBeenCalledWith(data.hand);
    });

    it('debe llamar a updateTotalScore con el totalScore', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateTotalScore');
      setup.renderer.onHandPlayed(makeHandPlayedData());
      expect(spy).toHaveBeenCalledWith(150);
    });

    it('debe llamar a updateDeckRemaining con deckRemaining', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateDeckRemaining');
      setup.renderer.onHandPlayed(makeHandPlayedData());
      expect(spy).toHaveBeenCalledWith(36);
    });

    it('debe limpiar el preview tras jugar', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateScorePreview');
      setup.renderer.onHandPlayed(makeHandPlayedData());
      expect(spy).toHaveBeenCalledWith(null, 0);
    });

    it('debe actualizar los contadores con handsLeft y null para descartes', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateCounters');
      setup.renderer.onHandPlayed(makeHandPlayedData());
      expect(spy).toHaveBeenCalledWith(2, null);
    });
  });

  // ── onHandSorted ───────────────────────────────────────────────────────

  describe('onHandSorted', () => {
    it('debe llamar a renderHand con la mano reordenada', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'renderHand');
      const hand = makeHand();
      setup.renderer.onHandSorted(hand, new Set(), 3, 3);
      expect(spy).toHaveBeenCalledWith(hand);
    });

    it('debe habilitar botones cuando hay selección tras el sort', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      // Índice 0 seleccionado tras el sort.
      setup.renderer.onHandSorted(makeHand(), new Set([0]), 3, 3);
      expect(spy).toHaveBeenCalledWith(true, 3, 3, false);
    });

    it('debe deshabilitar botones cuando no hay selección tras el sort', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      setup.renderer.onHandSorted(makeHand(), new Set(), 3, 3);
      expect(spy).toHaveBeenCalledWith(false, 3, 3, false);
    });
  });

  // ── onCardsDiscarded ───────────────────────────────────────────────────

  describe('onCardsDiscarded', () => {
    it('debe llamar a renderHand con la mano completa re-ordenada', () => {
      setup.renderer.onGameStarted({hand: makeHand(), deckRemaining: 44,
        initialHands: 3, initialDiscards: 3, maxHandSize: 5,
      });
      const spy = vitest.spyOn(HandAreaView.prototype, 'renderHand');
      const hand = makeHand();
      const data: CardsDiscardedData = {
        replacedIndices: [0, 1], replacementCards: [makeCard(9), makeCard(10)],
        deckRemaining: 42, discardsLeft: 2,
        hand,
      };
      setup.renderer.onCardsDiscarded(data);
      // onCardsDiscarded ahora renderiza la mano completa porque el modelo
      // re-ordena tras reponer, haciendo que replaceCards por índice sea incorrecto.
      expect(spy).toHaveBeenCalledWith(hand);
    });

    it('debe actualizar deckRemaining', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateDeckRemaining');
      const data: CardsDiscardedData = {
        replacedIndices: [0], replacementCards: [makeCard(7)],
        deckRemaining: 42, discardsLeft: 2,
        hand: [],
      };
      setup.renderer.onCardsDiscarded(data);
      expect(spy).toHaveBeenCalledWith(42);
    });

    it('debe actualizar el contador de descartes con null para manos', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateCounters');
      const data: CardsDiscardedData = {
        replacedIndices: [0], replacementCards: [makeCard(7)],
        deckRemaining: 42, discardsLeft: 2,
        hand: [],
      };
      setup.renderer.onCardsDiscarded(data);
      expect(spy).toHaveBeenCalledWith(null, 2);
    });
  });

  // ── onScorePreview ─────────────────────────────────────────────────────

  describe('onScorePreview', () => {
    it('debe pasar handResult y cardBonusChips a updateScorePreview', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateScorePreview');
      const handResult = {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []};
      const data: ScorePreviewData = {handResult, cardBonusChips: 8};
      setup.renderer.onScorePreview(data);
      expect(spy).toHaveBeenCalledWith(handResult, 8);
    });

    it('debe pasar null cuando no hay selección', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateScorePreview');
      const data: ScorePreviewData = {handResult: null, cardBonusChips: 0};
      setup.renderer.onScorePreview(data);
      expect(spy).toHaveBeenCalledWith(null, 0);
    });
  });

  // ── onGameEnded ────────────────────────────────────────────────────────

  describe('onGameEnded', () => {
    it('debe mostrar el resultado de la partida ganada', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'showGameResult');
      const data: GameEndedData = {playerWon: true, finalScore: 500};
      setup.renderer.onGameEnded(data);
      expect(spy).toHaveBeenCalledWith(true, 500);
    });

    it('debe mostrar el resultado de la partida perdida', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'showGameResult');
      const data: GameEndedData = {playerWon: false, finalScore: 200};
      setup.renderer.onGameEnded(data);
      expect(spy).toHaveBeenCalledWith(false, 200);
    });

    it('debe deshabilitar todos los botones con isGameOver=true', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      setup.renderer.onGameEnded({playerWon: true, finalScore: 500});
      expect(spy).toHaveBeenCalledWith(false, 0, 0, true);
    });
  });
});
