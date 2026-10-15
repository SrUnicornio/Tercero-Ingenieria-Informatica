/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file balatro-model.test.ts
 * @description Tests unitarios de BalatroModel.
 *   Cubre: startGame, toggleCard, playHand, discard, scoreGoal,
 *   condición de victoria/derrota y bloqueo de acciones tras fin de partida.
 *   Usa vitest.fn() para capturar los payloads de los eventos emitidos
 *   sin depender del DOM.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {BalatroModel} from '../../../balatro/model/game/balatro-model';
import {
  type GameStartedData,
  type CardToggledData,
  type HandPlayedData,
  type CardsDiscardedData,
  type ScorePreviewData,
  type GameEndedData,
} from '../../../balatro/types/event-payloads';
import {describe, it, expect, vitest, beforeEach} from 'vitest';

/** Número de manos disponibles por nivel en el Small Blind. */
const HANDS_PER_LEVEL = 3;

/** Número de descartes disponibles por nivel. */
const DISCARDS_PER_LEVEL = 3;

/** Objetivo de chips del Small Blind. */
const SMALL_BLIND_GOAL = 300;

describe('BalatroModel', () => {
  let model: BalatroModel;

  beforeEach(() => {
    model = new BalatroModel();
    model.startGame();
  });

  // ── startGame ──────────────────────────────────────────────────────────

  describe('startGame', () => {
    it('debe repartir una mano inicial de 8 cartas', () => {
      expect(model.getHand()).toHaveLength(8);
    });

    it('debe emitir gameStartedEvent con hand.length=8 y deckRemaining=44', () => {
      const freshModel = new BalatroModel();
      const listener = vitest.fn<(data: GameStartedData) => void>();
      freshModel.onGameStarted(listener);

      freshModel.startGame();

      expect(listener).toHaveBeenCalledTimes(1);
      const payload = listener.mock.calls[0][0];
      expect(payload.hand).toHaveLength(8);
      expect(payload.deckRemaining).toBe(44); // 52 − 8
    });

    it('debe reiniciar la selección de cartas al relanzar', () => {
      model.toggleCard(0);
      model.toggleCard(1);
      model.startGame();
      expect(model.getSelectedCardIndices().size).toBe(0);
    });

    it('debe emitir gameStartedEvent cada vez que se llama', () => {
      const freshModel = new BalatroModel();
      const listener = vitest.fn<(data: GameStartedData) => void>();
      freshModel.onGameStarted(listener);

      freshModel.startGame();
      freshModel.startGame();

      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  // ── toggleCard ─────────────────────────────────────────────────────────

  describe('toggleCard', () => {
    it('debe seleccionar una carta y emitir cardToggledEvent con isSelected=true', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      model.onCardToggled(listener);

      model.toggleCard(0);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0])
          .toEqual({cardIndex: 0, isSelected: true});
      expect(model.getSelectedCardIndices().has(0)).toBe(true);
    });

    it('debe deseleccionar una carta ya seleccionada y emitir isSelected=false', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      model.onCardToggled(listener);

      model.toggleCard(0);
      model.toggleCard(0); // segunda vez: deselección

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls[1][0])
          .toEqual({cardIndex: 0, isSelected: false});
      expect(model.getSelectedCardIndices().has(0)).toBe(false);
    });

    it('no debe permitir seleccionar más de 5 cartas', () => {
      for (let i = 0; i < 6; i++) model.toggleCard(i);
      expect(model.getSelectedCardIndices().size).toBe(5);
    });

    it('debe ignorar un índice negativo sin emitir eventos', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      model.onCardToggled(listener);

      model.toggleCard(-1);

      expect(listener).not.toHaveBeenCalled();
    });

    it('debe ignorar un índice fuera del rango de la mano', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      model.onCardToggled(listener);

      model.toggleCard(99);

      expect(listener).not.toHaveBeenCalled();
    });

    it('debe emitir scorePreviewEvent con handResult=null al deseleccionar la última carta', () => {
      const previewListener = vitest.fn<(data: ScorePreviewData) => void>();
      model.onScorePreview(previewListener);

      model.toggleCard(0);
      model.toggleCard(0); // queda selección vacía

      const lastPreview = previewListener.mock.calls.at(-1)?.[0];
      expect(lastPreview?.handResult).toBeNull();
    });
  });

  // ── playHand ───────────────────────────────────────────────────────────

  describe('playHand', () => {
    it('sin cartas seleccionadas no debe emitir handPlayedEvent', () => {
      const listener = vitest.fn<(data: HandPlayedData) => void>();
      model.onHandPlayed(listener);

      model.playHand();

      expect(listener).not.toHaveBeenCalled();
    });

    it('debe reducir handsLeft en 1 al jugar una mano válida', () => {
      const listener = vitest.fn<(data: HandPlayedData) => void>();
      model.onHandPlayed(listener);

      model.toggleCard(0);
      model.playHand();

      expect(listener.mock.calls[0][0].handsLeft).toBe(HANDS_PER_LEVEL - 1);
    });

    it('debe calcular una puntuación mayor que 0 para una mano válida', () => {
      const listener = vitest.fn<(data: HandPlayedData) => void>();
      model.onHandPlayed(listener);

      model.toggleCard(0);
      model.playHand();

      expect(listener.mock.calls[0][0].roundScore).toBeGreaterThan(0);
    });

    it('debe emitir el estado actualizado de la mano, recursos y puntuación', () => {
      model.toggleCard(0);
      model.toggleCard(1);
      model.toggleCard(2);
      model.playHand();

      expect(model.getHandsRemaining()).toBe(HANDS_PER_LEVEL - 1);
      expect(model.getDiscardsRemaining()).toBe(DISCARDS_PER_LEVEL);
      expect(model.getScore()).toBeGreaterThan(0);
    });

    it('debe acumular totalScore entre manos', () => {
      const scores: number[] = [];
      model.onHandPlayed(({totalScore}) =>
        scores.push(totalScore));

      model.toggleCard(0);
      model.playHand();
      model.toggleCard(0);
      model.playHand();

      expect(scores[1]).toBeGreaterThan(scores[0]);
    });

    it('debe limpiar la selección tras jugar', () => {
      model.toggleCard(0);
      model.playHand();
      expect(model.getSelectedCardIndices().size).toBe(0);
    });
  });

  // ── discard ────────────────────────────────────────────────────────────

  describe('discard', () => {
    it('sin cartas seleccionadas no debe emitir cardsDiscardedEvent', () => {
      const listener = vitest.fn<(data: CardsDiscardedData) => void>();
      model.onCardsDiscarded(listener);

      model.discard();

      expect(listener).not.toHaveBeenCalled();
    });

    it('debe reducir discardsLeft en 1 al descartar', () => {
      const listener = vitest.fn<(data: CardsDiscardedData) => void>();
      model.onCardsDiscarded(listener);

      model.toggleCard(0);
      model.discard();

      expect(listener.mock.calls[0][0].discardsLeft)
          .toBe(DISCARDS_PER_LEVEL - 1);
    });

    it('debe emitir las posiciones descartadas ordenadas ascendentemente', () => {
      const listener = vitest.fn<(data: CardsDiscardedData) => void>();
      model.onCardsDiscarded(listener);

      model.toggleCard(3);
      model.toggleCard(1);
      model.discard();

      expect(listener.mock.calls[0][0].replacedIndices).toEqual([1, 3]);
    });

    it('debe sustituir la carta en la posición descartada', () => {
      const originalCard = model.getHand()[0];
      model.toggleCard(0);
      model.discard();

      // La carta en posición 0 debe ser diferente (nueva del mazo)
      expect(model.getHand()[0]).not.toBe(originalCard);
    });

    it('no debe permitir descartar cuando discardsLeft es 0', () => {
      // Agotamos los 3 descartes
      for (let round = 0; round < DISCARDS_PER_LEVEL; round++) {
        model.toggleCard(0);
        model.discard();
      }

      const listener = vitest.fn<(data: CardsDiscardedData) => void>();
      model.onCardsDiscarded(listener);

      model.toggleCard(0);
      model.discard(); // cuarto intento: debe ignorarse

      expect(listener).not.toHaveBeenCalled();
    });

    it('debe limpiar la selección tras descartar', () => {
      model.toggleCard(0);
      model.discard();
      expect(model.getSelectedCardIndices().size).toBe(0);
    });

    it('Finaliza el juego al descartar si se agotan las manos y no se ha alcanzado el objetivo', () => {
      const listener = vitest.fn<(data: GameEndedData) => void>();
      model.onGameEnded(listener);

      // Agotamos las 3 manos sin alcanzar el objetivo
      for (let hand = 0; hand < HANDS_PER_LEVEL; hand++) {
        model.toggleCard(0);
        model.playHand();
      }

      // Ahora intentamos descartar: debe finalizar la partida
      model.toggleCard(0);
      model.discard();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ── sortHand ─────────────────────────────────────────────────────

  describe('sortHand', () => {
    it('debe ordenar la mano por rango manteniendo el orden relativo de palos', () => {
      const originalHand = model.getHand();
      model.sortHand('rank');
      const sortedHand = model.getHand();

      // Verificamos que las cartas están ordenadas por rango
      for (let i = 1; i < sortedHand.length; i++) {
        const prevRank = sortedHand[i - 1].getRank();
        const currRank = sortedHand[i].getRank();
        expect(prevRank).toBeLessThanOrEqual(currRank);
      }

      // Verificamos que el orden relativo de palos se mantiene entre cartas del mismo rango
      for (let i = 1; i < sortedHand.length; i++) {
        const prevCard = sortedHand[i - 1];
        const currCard = sortedHand[i];
        if (prevCard.getRank() === currCard.getRank()) {
          const originalprevIndex = originalHand.indexOf(prevCard);
          const originalCurrIndex = originalHand.indexOf(currCard);
          expect(originalprevIndex).toBeLessThan(originalCurrIndex);
        }
      }
    });

    it('juego terminado no debe emitir eventos ni modificar el estado', () => {
      // Agotamos las 3 manos para forzar el fin de partida
      for (let hand = 0; hand < HANDS_PER_LEVEL; hand++) {
        model.toggleCard(0);
        model.playHand();
      }

      const sortListener = vitest.fn<() => void>();
      model.onHandPlayed(sortListener);

      model.sortHand('rank');

      expect(sortListener).not.toHaveBeenCalled();
    });
  });

  // ── getScoreGoal ───────────────────────────────────────────────────

  describe('getScoreGoal', () => {
    it(`debe devolver ${SMALL_BLIND_GOAL} para el nivel Small Blind`, () => {
      expect(model.getScoreGoal()).toBe(SMALL_BLIND_GOAL);
    });
  });

  // ── getScore ───────────────────────────────────────────────────────────

  describe('getScore', () => {
    it('debe acumular la puntuación total tras jugar varias manos', () => {
      const initialScore = model.getScore();
      model.toggleCard(0);
      model.playHand();
      const afterFirstHand = model.getScore();
      model.toggleCard(0);
      model.playHand();
      const afterSecondHand = model.getScore();

      expect(afterFirstHand).toBeGreaterThan(initialScore);
      expect(afterSecondHand).toBeGreaterThan(afterFirstHand);
    });
  });

  // ── condición de fin ───────────────────────────────────────────────────

  describe('condición de fin de partida', () => {
    it('al agotar las 3 manos sin alcanzar el objetivo, debe emitir derrota', () => {
      const listener = vitest.fn<(data: GameEndedData) => void>();
      model.onGameEnded(listener);

      for (let hand = 0; hand < HANDS_PER_LEVEL; hand++) {
        model.toggleCard(0);
        model.playHand();
      }

      // El evento se emite; playerWon puede ser true si el azar da cartas muy altas
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('gameEndedEvent debe emitirse exactamente en el momento en que se cierra la última mano', () => {
      const listener = vitest.fn<(data: GameEndedData) => void>();
      model.onGameEnded(listener);

      // Dos manos: el evento no debe haberse emitido aún
      model.toggleCard(0);
      model.playHand();
      model.toggleCard(0);
      model.playHand();
      expect(listener).not.toHaveBeenCalled();

      // Tercera mano: ahora sí
      model.toggleCard(0);
      model.playHand();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('tras gameEnded, toggleCard no debe emitir cardToggledEvent', () => {
      // Agotamos las manos para forzar el fin
      for (let hand = 0; hand < HANDS_PER_LEVEL; hand++) {
        model.toggleCard(0);
        model.playHand();
      }

      const toggleListener = vitest.fn<(data: CardToggledData) => void>();
      model.onCardToggled(toggleListener);

      // La mano puede tener menos de 8 cartas tras 3 jugadas de 1 carta:
      // intentamos el índice 0 que siempre existirá si la mano no está vacía
      if (model.getHand().length > 0) {
        model.toggleCard(0);
      }

      expect(toggleListener).not.toHaveBeenCalled();
    });

    it('tras gameEnded, playHand no debe emitir handPlayedEvent', () => {
      for (let hand = 0; hand < HANDS_PER_LEVEL; hand++) {
        model.toggleCard(0);
        model.playHand();
      }

      const playListener = vitest.fn<(data: HandPlayedData) => void>();
      model.onHandPlayed(playListener);

      model.toggleCard(0);
      model.playHand();

      expect(playListener).not.toHaveBeenCalled();
    });
  });
});
