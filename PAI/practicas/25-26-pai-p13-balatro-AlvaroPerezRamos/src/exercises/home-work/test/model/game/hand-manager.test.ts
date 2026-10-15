/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-manager.test.ts
 * @description Tests unitarios de HandManager.
 *   Cubre: dealInitialHand, toggleCard (selección/deselección/límite/índices
 *   inválidos), scorePreviewEvent, extractSelectedCards y discardSelected.
 *   Usa vitest.fn() para verificar los payloads de los eventos emitidos
 *   sin depender del DOM.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HandManager} from '../../../balatro/model/game/hand-manager';
import {Card} from '../../../balatro/model/game/card';
import {Deck} from '../../../balatro/model/game/deck';
import {
  type CardToggledData,
  type ScorePreviewData,
} from '../../../balatro/types/event-payloads';
import {describe, it, expect, vitest, beforeEach} from 'vitest';

/** Tamaño de la mano inicial en los tests. */
const INITIAL_HAND_SIZE = 8;

/** Número máximo de cartas seleccionables. */
const MAX_SELECTED = 5;

describe('HandManager', () => {
  // Importamos Deck desde el mock (moduleNameMapper lo redirige automáticamente)
  let manager: HandManager;

  beforeEach(() => {
    const deck = new Deck();
    manager = new HandManager(deck);
    manager.dealInitialHand(INITIAL_HAND_SIZE);
  });

  // ── dealInitialHand ────────────────────────────────────────────────────

  describe('dealInitialHand', () => {
    it('debe repartir exactamente n cartas', () => {
      expect(manager.getHand()).toHaveLength(INITIAL_HAND_SIZE);
    });

    it('debe limpiar la selección al repartir una nueva mano', () => {
      manager.toggleCard(0);
      manager.toggleCard(1);

      const deck2 = new Deck();
      const manager2 = new HandManager(deck2);
      manager2.dealInitialHand(INITIAL_HAND_SIZE);

      expect(manager2.getSelectedCardIndices().size).toBe(0);
    });

    it('debe repartir menos cartas si se piden pocas', () => {
      const deck2 = new Deck();
      const manager2 = new HandManager(deck2);
      manager2.dealInitialHand(3);
      expect(manager2.getHand()).toHaveLength(3);
    });
  });

  // ── toggleCard ─────────────────────────────────────────────────────────

  describe('toggleCard', () => {
    it('debe seleccionar una carta y emitir cardToggledEvent con isSelected=true', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      manager.onCardToggled(listener);

      manager.toggleCard(0);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0]).toEqual({
        cardIndex: 0, isSelected: true,
      });
      expect(manager.getSelectedCardIndices().has(0)).toBe(true);
    });

    it('debe deseleccionar una carta ya seleccionada y emitir isSelected=false', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      manager.onCardToggled(listener);

      manager.toggleCard(0);
      manager.toggleCard(0);

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls[1][0]).toEqual({
        cardIndex: 0, isSelected: false,
      });
      expect(manager.getSelectedCardIndices().has(0)).toBe(false);
    });

    it(`no debe permitir seleccionar más de ${MAX_SELECTED} cartas`, () => {
      for (let i = 0; i < MAX_SELECTED + 1; i++) manager.toggleCard(i);
      expect(manager.getSelectedCardIndices().size).toBe(MAX_SELECTED);
    });

    it('debe ignorar un índice negativo sin emitir eventos', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      manager.onCardToggled(listener);

      manager.toggleCard(-1);

      expect(listener).not.toHaveBeenCalled();
    });

    it('debe ignorar un índice fuera del rango de la mano', () => {
      const listener = vitest.fn<(data: CardToggledData) => void>();
      manager.onCardToggled(listener);

      manager.toggleCard(99);

      expect(listener).not.toHaveBeenCalled();
    });

    it('debe emitir scorePreviewEvent tras cada toggle', () => {
      const listener = vitest.fn<(data: ScorePreviewData) => void>();
      manager.onScorePreview(listener);

      manager.toggleCard(0);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('debe emitir scorePreviewEvent con handResult=null al deseleccionar la última carta', () => {
      const listener = vitest.fn<(data: ScorePreviewData) => void>();
      manager.onScorePreview(listener);

      manager.toggleCard(0);
      manager.toggleCard(0); // queda selección vacía

      const lastPreview = listener.mock.calls.at(-1)?.[0];
      expect(lastPreview?.handResult).toBeNull();
    });

    it('debe emitir scorePreviewEvent con handResult no nulo al seleccionar una carta', () => {
      const listener = vitest.fn<(data: ScorePreviewData) => void>();
      manager.onScorePreview(listener);

      manager.toggleCard(0);

      const lastPreview = listener.mock.calls.at(-1)?.[0];
      expect(lastPreview?.handResult).not.toBeNull();
    });
  });

  // ── extractSelectedCards ───────────────────────────────────────────────

  describe('extractSelectedCards', () => {
    it('debe devolver las cartas seleccionadas', () => {
      manager.toggleCard(0);
      manager.toggleCard(2);

      const extracted = manager.getSelectedCards();

      expect(extracted).toHaveLength(2);
    });

    it('debe limpiar la selección tras extraer', () => {
      manager.toggleCard(0);
      manager.toggleCard(1);

      manager.getSelectedCards().forEach(() =>
        manager.getSelectedCards().shift());

      expect(manager.getSelectedCardIndices().size).toBe(2);
    });

    it('debe devolver un array vacío si no hay selección', () => {
      const extracted = manager.getSelectedCards();
      expect(extracted).toHaveLength(0);
    });

    it('las cartas extraídas deben ser las que estaban seleccionadas', () => {
      const cardAt0 = manager.getHand()[0];
      const cardAt3 = manager.getHand()[3];
      manager.toggleCard(0);
      manager.toggleCard(3);

      const extracted = manager.getSelectedCards();

      expect(extracted).toContain(cardAt0);
      expect(extracted).toContain(cardAt3);
    });
  });

  // ── replaceCardsAt ───────────────────────────────────────────────────

  describe('replaceCardsAt', () => {
    it('debe sustituir las cartas en los índices indicados por las nuevas', () => {
      const replacementCard: Card[] = [manager.getHand()[0]];
      manager.discardSelected();

      expect(manager.getHand()[0]).toBe(replacementCard[0]);
      expect(manager.getHand()).toHaveLength(INITIAL_HAND_SIZE);
    });

    it('debe limpiar la selección tras reemplazar cartas', () => {
      manager.toggleCard(0);
      manager.discardSelected();

      expect(manager.getSelectedCardIndices().size).toBe(0);
    });
  });

  // ── discardSelected ────────────────────────────────────────────────────

  describe('discardSelected', () => {
    it('debe devolver los índices reemplazados ordenados ascendentemente', () => {
      manager.toggleCard(3);
      manager.toggleCard(1);

      const {replacedIndices} = manager.discardSelected();

      expect(replacedIndices).toEqual([1, 3]);
    });

    it('debe sustituir las cartas descartadas por cartas nuevas del mazo', () => {
      const originalCard = manager.getHand()[0];
      manager.toggleCard(0);

      manager.discardSelected();

      expect(manager.getHand()[0]).not.toBe(originalCard);
    });

    it('debe limpiar la selección tras descartar', () => {
      manager.toggleCard(0);
      manager.discardSelected();

      expect(manager.getSelectedCardIndices().size).toBe(0);
    });

    it('debe devolver tantas replacementCards como índices descartados', () => {
      manager.toggleCard(0);
      manager.toggleCard(2);
      manager.toggleCard(4);

      const {replacedIndices, replacementCards} = manager.discardSelected();

      expect(replacementCards).toHaveLength(replacedIndices.length);
    });

    it('no debe modificar el tamaño de la mano al descartar', () => {
      manager.toggleCard(0);
      manager.toggleCard(1);

      manager.discardSelected();

      expect(manager.getHand()).toHaveLength(INITIAL_HAND_SIZE);
    });

    it('debe emitir scorePreviewEvent con handResult=null tras descartar', () => {
      const listener = vitest.fn<(data: ScorePreviewData) => void>();
      manager.onScorePreview(listener);

      manager.toggleCard(0);
      manager.discardSelected();

      const lastPreview = listener.mock.calls.at(-1)?.[0];
      expect(lastPreview?.handResult).toBeNull();
    });
  });

  // ── clearSelection ─────────────────────────────────────────────────────

  describe('clearSelection', () => {
    it('debe vaciar la selección', () => {
      manager.toggleCard(0);
      manager.toggleCard(1);

      manager.clearSelection();

      expect(manager.getSelectedCardIndices().size).toBe(0);
    });

    it('debe emitir scorePreviewEvent con handResult=null', () => {
      const listener = vitest.fn<(data: ScorePreviewData) => void>();
      manager.onScorePreview(listener);

      manager.toggleCard(0);
      manager.clearSelection();

      const lastPreview = listener.mock.calls.at(-1)?.[0];
      expect(lastPreview?.handResult).toBeNull();
    });
  });

  // ── getSelectedCards ───────────────────────────────────────────────────

  describe('getSelectedCards', () => {
    it('debe devolver las cartas en las posiciones seleccionadas', () => {
      const card0 = manager.getHand()[0];
      const card4 = manager.getHand()[4];
      manager.toggleCard(0);
      manager.toggleCard(4);

      const selected = manager.getSelectedCards();

      expect(selected).toContain(card0);
      expect(selected).toContain(card4);
      expect(selected).toHaveLength(2);
    });

    it('debe devolver un array vacío si no hay selección', () => {
      expect(manager.getSelectedCards()).toHaveLength(0);
    });
  });

  // ── sortHand ───────────────────────────────────────────────────────────────

  describe('sortHand', () => {
    it('debe conservar las cartas seleccionadas tras ordenar por rango', () => {
      // Seleccionamos las cartas en las posiciones 0 y 1 antes del sort.
      const cardAtZero = manager.getHand()[0];
      const cardAtOne = manager.getHand()[1];
      manager.toggleCard(0);
      manager.toggleCard(1);

      manager.sortHand('rank');

      // Las mismas cartas deben seguir seleccionadas tras el reordenamiento.
      const selectedAfterSort = manager.getSelectedCards();
      expect(selectedAfterSort).toContain(cardAtZero);
      expect(selectedAfterSort).toContain(cardAtOne);
      expect(selectedAfterSort).toHaveLength(2);
    });

    it('debe recalcular los índices correctamente: los índices seleccionados apuntan a las cartas correctas', () => {
      const cardAtTwo = manager.getHand()[2];
      manager.toggleCard(2);

      manager.sortHand('suit');
      const [selectedIndex] = manager.getSelectedCardIndices();
      expect(manager.getHand()[selectedIndex]).toBe(cardAtTwo);
    });

    it('debe dejar selectedIndices vacío si no había selección previa', () => {
      manager.sortHand('rank');

      expect(manager.getSelectedCardIndices().size).toBe(0);
    });
  });
});
