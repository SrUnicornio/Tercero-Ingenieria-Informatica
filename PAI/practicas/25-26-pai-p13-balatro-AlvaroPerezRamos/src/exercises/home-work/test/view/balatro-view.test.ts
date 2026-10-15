/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file balatro-view.test.ts
 * @description Tests unitarios de BalatroView (fachada de la vista).
 *   Adaptado a la nueva arquitectura donde la fachada expone dos superficies:
 *   - `view.getInputRouter()`   → suscripción a eventos del jugador (ViewInputRouter).
 *   - `view.getViewRenderer()` → actualización del DOM (ViewRenderer).
 *
 *   Los tests verifican que cada método de las superficies delega
 *   correctamente en las sub-vistas usando vitest.spyOn.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {BalatroView} from '../../balatro/view/balatro-view';
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

/** IDs del DOM que requiere BalatroView. */
const REQUIRED_IDS = [
  'hand-area', 'deck-remaining-display', 'score-total-display',
  'score-progress-bar', 'score-progress-text',
  'preview-hand-size-indicator',
  'preview-hand-name', 'preview-chips-display',
  'preview-mult-display', 'preview-total-display',
  'play-hand-button', 'discard-button', 'new-game-button',
  'sort-hand-button', 'hand-info-button',
  'hands-left-display', 'discards-left-display',
  'game-result-modal', 'game-result-message', 'game-result-close',
  'hand-info-modal', 'hand-info-close', 'hand-info-table',
];

/** Monta el DOM mínimo necesario para instanciar BalatroView. */
function buildDOM(): void {
  document.body.innerHTML = REQUIRED_IDS
      .map((id) => {
        if (id === 'score-progress-bar') return `<div id="${id}"></div>`;
        if (id === 'hand-info-modal' || id === 'game-result-modal') return `<dialog id="${id}"></dialog>`;
        if (id.includes('button') || id.includes('close')) {
          return `<button id="${id}"></button>`;
        }
        return `<div id="${id}"></div>`;
      })
      .join('\n');

  // JSDOM no implementa showModal/close en <dialog>.
  // Los reemplazamos por funciones vacías para que ControlsView no lance.
  const dialogs = document.querySelectorAll('dialog');
  dialogs.forEach((dialog) => {
    (dialog as HTMLDialogElement).showModal = () => {};
    (dialog as HTMLDialogElement).close = () => {};
  });
}

function makeCard(rank: number = 5): Card {
  return new Card(rank, 'spades', String(rank) as never, `/img/${rank}.png`);
}

function makeHand(): Card[] {
  return Array.from({length: 8}, (_, i) => makeCard(i + 2));
}

function makeGameStartedData(): GameStartedData {
  return {
    hand: makeHand(),
    deckRemaining: 44,
    initialHands: 3,
    initialDiscards: 3,
    maxHandSize: 5,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('BalatroView', () => {
  let view: BalatroView;

  beforeEach(() => {
    buildDOM();
    view = new BalatroView();
  });

  // ── constructor ────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('debe lanzar un error si falta un elemento del DOM requerido', () => {
      document.body.innerHTML = '';
      expect(() => new BalatroView()).toThrow('Elemento DOM no encontrado');
    });

    it('debe exponer una superficie inputs (ViewInputRouter)', () => {
      expect(view.getInputRouter()).toBeDefined();
    });

    it('debe exponer una superficie renderer (ViewRenderer)', () => {
      expect(view.getViewRenderer()).toBeDefined();
    });

    it('debe exponer una vista de información de jugadas (HandInfoView)', () => {
      expect(view.getHandInfoView()).toBeDefined();
    });
  });

  // ── view.getInputRouter() — suscripción a eventos del jugador ────────────────────

  describe('view.getInputRouter()', () => {
    it('onCardClicked debe delegar en HandAreaView.onCardClicked', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'onCardClicked');
      view.getInputRouter().onCardClicked(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('onPlayHand debe delegar en ControlsView.onPlayHand', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onPlayHand');
      view.getInputRouter().onPlayHand(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('onDiscard debe delegar en ControlsView.onDiscard', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onDiscard');
      view.getInputRouter().onDiscard(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('onNewGame debe delegar en ControlsView.onNewGame', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onNewGame');
      view.getInputRouter().onNewGame(() => {});
      expect(spy).toHaveBeenCalled();
    });

    it('onSortHand debe delegar en ControlsView.onSortHand', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'onSortHand');
      view.getInputRouter().onSortHand(() => {});
      expect(spy).toHaveBeenCalled();
    });
  });

  // ── view.getViewRenderer().onGameStarted ────────────────────────────────────────

  describe('view.getViewRenderer().onGameStarted', () => {
    const data: GameStartedData = makeGameStartedData();
    it('debe llamar a renderHand con la mano recibida', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'renderHand');
      const hand = makeHand();
      view.getViewRenderer().onGameStarted(data);
      expect(spy).toHaveBeenCalledWith(hand);
    });

    it('debe llamar a updateDeckRemaining con deckRemaining', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateDeckRemaining');
      view.getViewRenderer().onGameStarted(data);
      expect(spy).toHaveBeenCalledWith(44);
    });

    it('debe llamar a resetForNewGame en ControlsView', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'resetForNewGame');
      view.getViewRenderer().onGameStarted(data);
      expect(spy).toHaveBeenCalled();
    });

    it('debe inicializar la puntuación total a 0', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateTotalScore');
      view.getViewRenderer().onGameStarted(data);
      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  // ── view.getViewRenderer().onCardToggled ────────────────────────────────────────

  describe('view.getViewRenderer().onCardToggled', () => {
    const data = makeGameStartedData();
    it('debe llamar a setCardSelected con el índice e isSelected correctos', () => {
      view.getViewRenderer().onGameStarted(data);
      const spy = vitest.spyOn(HandAreaView.prototype, 'setCardSelected');
      const cardData: CardToggledData = {cardIndex: 3, isSelected: true};
      view.getViewRenderer().onCardToggled(cardData, 3, 3, 1);
      expect(spy).toHaveBeenCalledWith(3, true);
    });

    it('debe actualizar los estados de botones con hasSelection=true', () => {
      view.getViewRenderer().onGameStarted(data);
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      const cardData: CardToggledData = {cardIndex: 2, isSelected: true};
      view.getViewRenderer().onCardToggled(cardData, 3, 3, 1);
      expect(spy).toHaveBeenCalledWith(true, 3, 3, false);
    });

    it('con selección vacía debe pasar hasSelection=false', () => {
      view.getViewRenderer().onGameStarted(data);
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      const cardData: CardToggledData = {cardIndex: 0, isSelected: false};
      view.getViewRenderer().onCardToggled(cardData, 3, 3, 0);
      expect(spy).toHaveBeenCalledWith(false, 3, 3, false);
    });
  });

  // ── view.getViewRenderer().onHandPlayed ─────────────────────────────────────────

  describe('view.getViewRenderer().onHandPlayed', () => {
    const makeHandPlayedData = (): HandPlayedData => ({
      handResult: {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []},
      roundScore: 20,
      totalScore: 150,
      deckRemaining: 36,
      handsLeft: 2,
      hand: makeHand(),
      replacedIndices: [],
      replacementCards: [],
    });

    it('debe actualizar la puntuación total', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateTotalScore');
      view.getViewRenderer().onHandPlayed(makeHandPlayedData());
      expect(spy).toHaveBeenCalledWith(150);
    });

    it('debe actualizar las cartas restantes del mazo', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateDeckRemaining');
      view.getViewRenderer().onHandPlayed(makeHandPlayedData());
      expect(spy).toHaveBeenCalledWith(36);
    });

    it('debe actualizar los contadores con handsLeft y null para descartes', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateCounters');
      view.getViewRenderer().onHandPlayed(makeHandPlayedData());
      expect(spy).toHaveBeenCalledWith(2, null);
    });
  });

  // ── view.getViewRenderer().onCardsDiscarded ────────────────────────────────────

  describe('view.getViewRenderer().onCardsDiscarded', () => {
    it('debe llamar a renderHand con la mano completa re-ordenada', () => {
      view.getViewRenderer().onGameStarted(makeGameStartedData());
      const spy = vitest.spyOn(HandAreaView.prototype, 'renderHand');
      const hand = makeHand();
      const data: CardsDiscardedData = {
        replacedIndices: [0, 1],
        replacementCards: [makeCard(9), makeCard(10)],
        deckRemaining: 42,
        discardsLeft: 2,
        hand,
      };
      view.getViewRenderer().onCardsDiscarded(data);
      expect(spy).toHaveBeenCalledWith(hand);
    });

    it('debe actualizar las cartas restantes del mazo tras el descarte', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateDeckRemaining');
      const data: CardsDiscardedData = {
        replacedIndices: [0],
        replacementCards: [makeCard(7)],
        deckRemaining: 42,
        discardsLeft: 2,
        hand: [],
      };
      view.getViewRenderer().onCardsDiscarded(data);
      expect(spy).toHaveBeenCalledWith(42);
    });

    it('debe actualizar el contador de descartes restantes', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateCounters');
      const data: CardsDiscardedData = {
        replacedIndices: [0],
        replacementCards: [makeCard(7)],
        deckRemaining: 42,
        discardsLeft: 2,
        hand: [],
      };
      view.getViewRenderer().onCardsDiscarded(data);
      expect(spy).toHaveBeenCalledWith(null, 2);
    });
  });

  // ── view.getViewRenderer().onScorePreview ───────────────────────────────────────

  describe('view.getViewRenderer().onScorePreview', () => {
    it('debe pasar el handResult y cardBonusChips a updateScorePreview', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateScorePreview');
      const handResult = {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []};
      const data: ScorePreviewData = {handResult, cardBonusChips: 5};
      view.getViewRenderer().onScorePreview(data);
      expect(spy).toHaveBeenCalledWith(handResult, 5);
    });

    it('debe pasar null cuando no hay selección', () => {
      const spy = vitest.spyOn(ScorePanelView.prototype, 'updateScorePreview');
      const data: ScorePreviewData = {handResult: null, cardBonusChips: 0};
      view.getViewRenderer().onScorePreview(data);
      expect(spy).toHaveBeenCalledWith(null, 0);
    });
  });

  // ── view.getViewRenderer().onGameEnded ──────────────────────────────────────────

  describe('view.getViewRenderer().onGameEnded', () => {
    it('debe mostrar el resultado de la partida ganada', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'showGameResult');
      const data: GameEndedData = {playerWon: true, finalScore: 500};
      view.getViewRenderer().onGameEnded(data);
      expect(spy).toHaveBeenCalledWith(true, 500);
    });

    it('debe mostrar el resultado de la partida perdida', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'showGameResult');
      const data: GameEndedData = {playerWon: false, finalScore: 200};
      view.getViewRenderer().onGameEnded(data);
      expect(spy).toHaveBeenCalledWith(false, 200);
    });

    it('debe deshabilitar todos los botones al terminar', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      view.getViewRenderer().onGameEnded({playerWon: true, finalScore: 500});
      expect(spy).toHaveBeenCalledWith(false, 0, 0, true);
    });
  });

  // ── view.getViewRenderer().onHandSorted ─────────────────────────────────────────

  describe('view.getViewRenderer().onHandSorted', () => {
    it('debe llamar a renderHand con la mano reordenada', () => {
      const spy = vitest.spyOn(HandAreaView.prototype, 'renderHand');
      const hand = makeHand();
      view.getViewRenderer().onHandSorted(hand, new Set(), 3, 3);
      expect(spy).toHaveBeenCalledWith(hand);
    });

    it('debe habilitar botones cuando hay índices seleccionados tras el sort', () => {
      const spy = vitest.spyOn(ControlsView.prototype, 'updateButtonStates');
      view.getViewRenderer().onHandSorted(makeHand(), new Set([0]), 3, 3);
      expect(spy).toHaveBeenCalledWith(true, 3, 3, false);
    });
  });
});
