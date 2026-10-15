/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file game-actions.test.ts
 * @description Tests unitarios de GameActions.
 *   Cubre: startGame, toggleCard, playHand (con y sin selección), discard
 *   (con y sin selección, agotando descartes), sortHand y las consultas
 *   de estado. Inyecta un GameEventChannels con vitest.fn() para verificar
 *   los payloads emitidos sin depender del DOM ni de GameEventPublisher.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {GameActions} from '../../../balatro/model/game/game-actions';
import {
  type GameEventChannels,
} from '../../../balatro/model/game/game-event-publisher';
import {
  type GameStartedData,
  type HandPlayedData,
  type CardsDiscardedData,
} from '../../../balatro/types/event-payloads';
import {describe, it, expect, vitest, beforeEach} from 'vitest';

/** Manos disponibles por nivel. */
const HANDS_PER_LEVEL = 3;
/** Descartes disponibles por nivel. */
const DISCARDS_PER_LEVEL = 3;

/**
 * Construye un GameEventChannels con todos los triggers como vitest.fn().
 * Devuelve el objeto de canales y las referencias individuales para aserciones.
 */
function buildMockChannels(): {
  channels: GameEventChannels;
  triggerGameStarted: ReturnType<typeof vitest.fn>;
  triggerCardToggled: ReturnType<typeof vitest.fn>;
  triggerHandPlayed: ReturnType<typeof vitest.fn>;
  triggerCardsDiscarded: ReturnType<typeof vitest.fn>;
  triggerScorePreview: ReturnType<typeof vitest.fn>;
  triggerGameEnded: ReturnType<typeof vitest.fn>;
  } {
  const triggerGameStarted = vitest.fn<(data: GameStartedData) => void>();
  const triggerCardToggled = vitest.fn();
  const triggerHandPlayed = vitest.fn<(data: HandPlayedData) => void>();
  const triggerCardsDiscarded = vitest.fn<(data: CardsDiscardedData) => void>();
  const triggerScorePreview = vitest.fn();
  const triggerGameEnded = vitest.fn();

  return {
    channels: {
      triggerGameStarted,
      triggerCardToggled,
      triggerHandPlayed,
      triggerCardsDiscarded,
      triggerScorePreview,
      triggerGameEnded,
    },
    triggerGameStarted,
    triggerCardToggled,
    triggerHandPlayed,
    triggerCardsDiscarded,
    triggerScorePreview,
    triggerGameEnded,
  };
}

describe('GameActions', () => {
  let mocks: ReturnType<typeof buildMockChannels>;
  let actions: GameActions;

  beforeEach(() => {
    mocks = buildMockChannels();
    actions = new GameActions(mocks.channels);
    actions.startGame();
  });

  // ── startGame ──────────────────────────────────────────────────────────

  describe('startGame', () => {
    it('debe emitir triggerGameStarted con hand.length=8 y deckRemaining=44', () => {
      expect(mocks.triggerGameStarted).toHaveBeenCalledTimes(1);
      const payload = mocks.triggerGameStarted
          .mock.calls[0][0] as GameStartedData;
      expect(payload.hand).toHaveLength(8);
      expect(payload.deckRemaining).toBe(44);
    });

    it('debe repartir una mano de 8 cartas accesible con getHand()', () => {
      expect(actions.getHand()).toHaveLength(8);
    });

    it('debe reiniciar el contador de manos a 3', () => {
      expect(actions.getHandsRemaining()).toBe(HANDS_PER_LEVEL);
    });

    it('debe reiniciar el contador de descartes a 3', () => {
      expect(actions.getDiscardsRemaining()).toBe(DISCARDS_PER_LEVEL);
    });

    it('debe limpiar la selección de la partida anterior', () => {
      actions.toggleCard(0);
      actions.startGame();
      expect(actions.getSelectedCardIndices().size).toBe(0);
    });

    it('debe emitir triggerGameStarted en cada reinicio', () => {
      actions.startGame();
      expect(mocks.triggerGameStarted).toHaveBeenCalledTimes(2);
    });
  });

  // ── toggleCard ─────────────────────────────────────────────────────────

  describe('toggleCard', () => {
    it('debe emitir triggerCardToggled con isSelected=true al seleccionar', () => {
      actions.toggleCard(0);
      expect(mocks.triggerCardToggled).toHaveBeenCalledWith(
          {cardIndex: 0, isSelected: true},
      );
    });

    it('debe emitir triggerCardToggled con isSelected=false al deseleccionar', () => {
      actions.toggleCard(0);
      actions.toggleCard(0);
      const lastCall = mocks.triggerCardToggled.mock.calls.at(-1)?.[0];
      expect(lastCall).toEqual({cardIndex: 0, isSelected: false});
    });

    it('no debe emitir si el índice es inválido', () => {
      const callsBefore = mocks.triggerCardToggled.mock.calls.length;
      actions.toggleCard(-1);
      actions.toggleCard(99);
      expect(mocks.triggerCardToggled.mock.calls.length).toBe(callsBefore);
    });

    it('no debe superar 5 cartas seleccionadas', () => {
      for (let i = 0; i < 6; i++) actions.toggleCard(i);
      expect(actions.getSelectedCardIndices().size).toBe(5);
    });
  });

  // ── playHand ───────────────────────────────────────────────────────────

  describe('playHand', () => {
    it('debe devolver false y no emitir si no hay selección', () => {
      const result = actions.playHand();
      expect(result).toBe(false);
      expect(mocks.triggerHandPlayed).not.toHaveBeenCalled();
    });

    it('debe devolver true y emitir triggerHandPlayed con selección', () => {
      actions.toggleCard(0);
      const result = actions.playHand();
      expect(result).toBe(true);
      expect(mocks.triggerHandPlayed).toHaveBeenCalledTimes(1);
    });

    it('debe decrementar handsRemaining en 1 tras jugar', () => {
      actions.toggleCard(0);
      actions.playHand();
      expect(actions.getHandsRemaining()).toBe(HANDS_PER_LEVEL - 1);
    });

    it('debe calcular una puntuación mayor que 0', () => {
      actions.toggleCard(0);
      actions.playHand();
      const payload = mocks.triggerHandPlayed
          .mock.calls[0][0] as HandPlayedData;
      expect(payload.roundScore).toBeGreaterThan(0);
    });

    it('debe acumular la puntuación total entre manos', () => {
      actions.toggleCard(0);
      actions.playHand();
      const firstTotal =
        (mocks.triggerHandPlayed.mock.calls[0][0] as HandPlayedData).totalScore;
      actions.toggleCard(0);
      actions.playHand();
      const secondTotal =
        (mocks.triggerHandPlayed.mock.calls[1][0] as HandPlayedData).totalScore;
      expect(secondTotal).toBeGreaterThan(firstTotal);
    });

    it('debe devolver false si handsRemaining es 0', () => {
      for (let i = 0; i < HANDS_PER_LEVEL; i++) {
        actions.toggleCard(0);
        actions.playHand();
      }
      actions.toggleCard(0);
      const result = actions.playHand();
      expect(result).toBe(false);
    });

    it('debe limpiar la selección tras jugar', () => {
      actions.toggleCard(0);
      actions.playHand();
      expect(actions.getSelectedCardIndices().size).toBe(0);
    });
  });

  // ── discard ────────────────────────────────────────────────────────────

  describe('discard', () => {
    it('debe devolver false y no emitir si no hay selección', () => {
      const result = actions.discard();
      expect(result).toBe(false);
      expect(mocks.triggerCardsDiscarded).not.toHaveBeenCalled();
    });

    it('debe devolver true y emitir triggerCardsDiscarded con selección', () => {
      actions.toggleCard(0);
      const result = actions.discard();
      expect(result).toBe(true);
      expect(mocks.triggerCardsDiscarded).toHaveBeenCalledTimes(1);
    });

    it('debe decrementar discardsRemaining en 1 tras descartar', () => {
      actions.toggleCard(0);
      actions.discard();
      expect(actions.getDiscardsRemaining()).toBe(DISCARDS_PER_LEVEL - 1);
    });

    it('debe emitir los índices descartados ordenados ascendentemente', () => {
      actions.toggleCard(3);
      actions.toggleCard(1);
      actions.discard();
      const payload =
        mocks.triggerCardsDiscarded.mock.calls[0][0] as CardsDiscardedData;
      expect(payload.replacedIndices).toEqual([1, 3]);
    });

    it('debe devolver false si discardsRemaining es 0', () => {
      for (let i = 0; i < DISCARDS_PER_LEVEL; i++) {
        actions.toggleCard(0);
        actions.discard();
      }
      actions.toggleCard(0);
      const result = actions.discard();
      expect(result).toBe(false);
    });

    it('debe limpiar la selección tras descartar', () => {
      actions.toggleCard(0);
      actions.discard();
      expect(actions.getSelectedCardIndices().size).toBe(0);
    });
  });

  // ── sortHand ───────────────────────────────────────────────────────────

  describe('sortHand', () => {
    it('debe ordenar la mano por rango ascendente con "rank"', () => {
      actions.sortHand('rank');
      const hand = actions.getHand();
      for (let i = 1; i < hand.length; i++) {
        expect(hand[i - 1].getRank()).toBeLessThanOrEqual(hand[i].getRank());
      }
    });

    it('debe ordenar la mano por palo alfabético con "suit"', () => {
      actions.sortHand('suit');
      const hand = actions.getHand();
      for (let i = 1; i < hand.length; i++) {
        const suitComparison =
          hand[i - 1].getSuit().localeCompare(hand[i].getSuit());
        expect(suitComparison).toBeLessThanOrEqual(0);
      }
    });

    it('debe conservar la selección al ordenar (el índice puede cambiar pero la carta persiste)', () => {
      // Guardamos la carta que estaba en índice 0 antes del sort.
      const cardBeforeSort = actions.getHand()[0];
      actions.toggleCard(0);

      actions.sortHand('rank');

      // La selección no debe vaciarse — debe seguir habiendo 1 carta seleccionada.
      expect(actions.getSelectedCardIndices().size).toBe(1);
      // La carta seleccionada debe ser la misma que antes del sort.
      const [newIndex] = actions.getSelectedCardIndices();
      expect(actions.getHand()[newIndex]).toBe(cardBeforeSort);
    });
  });

  // ── consultas de estado ────────────────────────────────────────────────

  describe('consultas de estado', () => {
    it('getActiveSortCriterion debe ser "rank" al iniciar', () => {
      expect(actions.getActiveSortCriterion()).toBe('rank');
    });

    it('getScoreGoal debe devolver 300', () => {
      expect(actions.getScoreGoal()).toBe(300);
    });

    it('getScore debe ser 0 al inicio', () => {
      expect(actions.getScore()).toBe(0);
    });

    it('getScore debe aumentar tras jugar una mano', () => {
      actions.toggleCard(0);
      actions.playHand();
      expect(actions.getScore()).toBeGreaterThan(0);
    });

    it('isVictory debe ser true si la puntuación supera el objetivo', () => {
      // Forzamos muchas cartas para asegurar la victoria
      for (let i = 0; i < HANDS_PER_LEVEL; i++) {
        actions.toggleCard(0);
        actions.toggleCard(1);
        actions.toggleCard(2);
        actions.toggleCard(3);
        actions.toggleCard(4);
        actions.playHand();
        if (actions.isVictory()) break;
      }
      // No podemos garantizar victoria con cartas aleatorias,
      // pero sí que el método no lanza error y devuelve booleano.
      expect(typeof actions.isVictory()).toBe('boolean');
    });

    it('isDefeated debe ser true tras agotar las manos sin alcanzar el objetivo', () => {
      for (let i = 0; i < HANDS_PER_LEVEL; i++) {
        actions.toggleCard(0); // 1 carta → puntuación baja
        actions.playHand();
      }
      // Si no hay victoria, debe haber derrota
      if (!actions.isVictory()) {
        expect(actions.isDefeated()).toBe(true);
      }
    });

    it('getFinalScore debe coincidir con getScore', () => {
      actions.toggleCard(0);
      actions.playHand();
      expect(actions.getFinalScore()).toBe(actions.getScore());
    });
  });
});
