/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file game-event-publisher.test.ts
 * @description Tests unitarios de GameEventPublisher.
 *   Cubre: registro de listeners, emisión correcta a través de channels(),
 *   y que cada canal solo notifica a sus propios suscriptores.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {GameEventPublisher} from '../../../balatro/model/game/game-event-publisher';
import {Card} from '../../../balatro/model/game/card';
import {
  type GameStartedData,
  type CardToggledData,
  type HandPlayedData,
  type CardsDiscardedData,
  type ScorePreviewData,
  type GameEndedData,
} from '../../../balatro/types/event-payloads';
import {describe, it, expect, vitest} from 'vitest';

/** Carta mínima para construir payloads de test. */
function makeCard(): Card {
  return new Card(2, 'spades', '2', '');
}

describe('GameEventPublisher', () => {
  // ── channels() — emisión ───────────────────────────────────────────────

  describe('channels().triggerGameStarted', () => {
    it('debe notificar al listener registrado con onGameStarted', () => {
      const publisher = new GameEventPublisher();
      const listener = vitest.fn<(data: GameStartedData) => void>();
      publisher.onGameStarted(listener);

      publisher.channels().triggerGameStarted({
        hand: [makeCard()], deckRemaining: 44, initialHands: 3,
        initialDiscards: 3, maxHandSize: 5,
      });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].deckRemaining).toBe(44);
    });

    it('no debe notificar a listeners de otros canales', () => {
      const publisher = new GameEventPublisher();
      const wrongListener = vitest.fn<(data: GameEndedData) => void>();
      publisher.onGameEnded(wrongListener);

      publisher.channels().triggerGameStarted({
        hand: [], deckRemaining: 44, initialHands: 3, initialDiscards: 3,
        maxHandSize: 5,
      });

      expect(wrongListener).not.toHaveBeenCalled();
    });
  });

  describe('channels().triggerCardToggled', () => {
    it('debe notificar al listener con el índice y estado de selección correctos', () => {
      const publisher = new GameEventPublisher();
      const listener = vitest.fn<(data: CardToggledData) => void>();
      publisher.onCardToggled(listener);

      publisher.channels().triggerCardToggled({cardIndex: 3, isSelected: true});

      expect(listener).toHaveBeenCalledWith({cardIndex: 3, isSelected: true});
    });
  });

  describe('channels().triggerHandPlayed', () => {
    it('debe notificar con el roundScore correcto', () => {
      const publisher = new GameEventPublisher();
      const listener = vitest.fn<(data: HandPlayedData) => void>();
      publisher.onHandPlayed(listener);

      const payload: HandPlayedData = {
        handResult: {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []},
        roundScore: 28,
        totalScore: 28,
        handsLeft: 2,
        deckRemaining: 36,
        hand: [],
        replacedIndices: [],
        replacementCards: [],
      };
      publisher.channels().triggerHandPlayed(payload);

      expect(listener.mock.calls[0][0].roundScore).toBe(28);
    });
  });

  describe('channels().triggerCardsDiscarded', () => {
    it('debe notificar con los índices descartados correctos', () => {
      const publisher = new GameEventPublisher();
      const listener = vitest.fn<(data: CardsDiscardedData) => void>();
      publisher.onCardsDiscarded(listener);

      const payload: CardsDiscardedData = {
        replacementCards: [], replacedIndices: [1, 3],
        deckRemaining: 40, discardsLeft: 2,
        hand: [],
      };
      publisher.channels().triggerCardsDiscarded(payload);

      expect(listener.mock.calls[0][0].replacedIndices).toEqual([1, 3]);
    });
  });

  describe('channels().triggerScorePreview', () => {
    it('debe notificar con handResult null cuando no hay selección', () => {
      const publisher = new GameEventPublisher();
      const listener = vitest.fn<(data: ScorePreviewData) => void>();
      publisher.onScorePreview(listener);

      publisher.channels()
          .triggerScorePreview({handResult: null, cardBonusChips: 0});

      expect(listener.mock.calls[0][0].handResult).toBeNull();
    });
  });

  describe('channels().triggerGameEnded', () => {
    it('debe notificar con el resultado correcto de victoria', () => {
      const publisher = new GameEventPublisher();
      const listener = vitest.fn<(data: GameEndedData) => void>();
      publisher.onGameEnded(listener);

      publisher.channels().triggerGameEnded({playerWon: true, finalScore: 350});

      expect(listener.mock.calls[0][0])
          .toEqual({playerWon: true, finalScore: 350});
    });
  });

  // ── múltiples listeners ────────────────────────────────────────────────

  describe('múltiples listeners en el mismo canal', () => {
    it('debe notificar a todos los listeners registrados', () => {
      const publisher = new GameEventPublisher();
      const firstListener = vitest.fn<(data: GameEndedData) => void>();
      const secondListener = vitest.fn<(data: GameEndedData) => void>();
      publisher.onGameEnded(firstListener);
      publisher.onGameEnded(secondListener);

      publisher.channels()
          .triggerGameEnded({playerWon: false, finalScore: 100});

      expect(firstListener).toHaveBeenCalledTimes(1);
      expect(secondListener).toHaveBeenCalledTimes(1);
    });
  });

  // ── channels() retorna un objeto nuevo en cada llamada ─────────────────

  describe('channels() — estabilidad de la referencia', () => {
    it('los triggers obtenidos en distintas llamadas deben funcionar igual', () => {
      const publisher = new GameEventPublisher();
      const listener = vitest.fn<(data: GameEndedData) => void>();
      publisher.onGameEnded(listener);

      const channels1 = publisher.channels();
      const channels2 = publisher.channels();
      channels1.triggerGameEnded({playerWon: true, finalScore: 400});
      channels2.triggerGameEnded({playerWon: true, finalScore: 400});

      expect(listener).toHaveBeenCalledTimes(2);
    });
  });
});
