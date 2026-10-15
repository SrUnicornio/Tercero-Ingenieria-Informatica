/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-area-view.test.ts
 * @description Tests unitarios de HandAreaView.
 *   Usa JSDOM para operar sobre el DOM en memoria. Se crean cartas de test
 *   mínimas para verificar renderHand, setCardSelected, replaceCards y
 *   el disparo de cardClickedEvent al hacer clic en una carta.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HandAreaView} from '../../balatro/view/hand-area-view';
import {Card} from '../../balatro/model/game/card';
import {describe, it, expect, vitest, beforeEach} from 'vitest';
import {RankLabel} from '../../balatro/types/card-types';

// ── Helper de cartas ──────────────────────────────────────────────────────────

/**
 * Crea una carta de test con getImagePath() y alt mínimos para JSDOM.
 * @param rank  Valor numérico de la carta (2–14).
 * @param suit  Palo de la carta.
 * @returns Instancia de Card.
 */
function makeCard(
    rank: number,
    suit: 'spades' | 'hearts' | 'diamonds' | 'clubs' = 'spades',
): Card {
  const RANK_TO_LABEL: Record<number, string> = {
    2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
    7: '7', 8: '8', 9: '9', 10: '10',
    11: 'J', 12: 'Q', 13: 'K', 14: 'A',
  };
  return new Card(rank, suit, RANK_TO_LABEL[rank] as never, `/img/${rank}_of_${suit}.png`);
}

/** Mano de 8 cartas para los tests de renderHand. */
function makeHand(): Card[] {
  return [
    makeCard(2, 'spades'), makeCard(5, 'hearts'),
    makeCard(7, 'diamonds'), makeCard(9, 'clubs'),
    makeCard(10, 'spades'), makeCard(11, 'hearts'),
    makeCard(13, 'diamonds'), makeCard(14, 'clubs'),
  ];
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HandAreaView', () => {
  let container: HTMLElement;
  let view: HandAreaView;

  beforeEach(() => {
    container = document.createElement('div');
    view = new HandAreaView(container);
  });

  // ── renderHand ─────────────────────────────────────────────────────────

  describe('renderHand', () => {
    it('debe crear un card-slot por cada carta de la mano', () => {
      view.renderHand(makeHand());
      const slots = container.querySelectorAll('.card-slot');
      expect(slots).toHaveLength(8);
    });

    it('cada card-slot debe contener una imagen con el src de la carta', () => {
      const hand = makeHand();
      view.renderHand(hand);
      const images = container.querySelectorAll<HTMLImageElement>('.card-slot img');

      expect(images).toHaveLength(8);
      images.forEach((img, i) => {
        expect(img.src).toContain(hand[i].getImagePath());
      });
    });

    it('cada card-slot debe tener un data-card-index correlativo', () => {
      view.renderHand(makeHand());
      const slots = container.querySelectorAll<HTMLElement>('[data-card-index]');
      const indices = [...slots].map((slot) => Number(slot.dataset['cardIndex']));
      expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it('debe vaciar el contenedor antes de renderizar una segunda mano', () => {
      view.renderHand(makeHand());
      view.renderHand([makeCard(3, 'hearts'), makeCard(4, 'clubs')]);
      const slots = container.querySelectorAll('.card-slot');
      expect(slots).toHaveLength(2);
    });

    it('con mano vacía debe limpiar el contenedor sin errores', () => {
      view.renderHand(makeHand());
      view.renderHand([]);
      const slots = container.querySelectorAll('.card-slot');
      expect(slots).toHaveLength(0);
    });
  });

  // ── cardClickedEvent ───────────────────────────────────────────────────

  describe('cardClickedEvent', () => {
    it('debe emitir el índice correcto al hacer clic en una carta', () => {
      view.renderHand(makeHand());
      const listener = vitest.fn();
      view.onCardClicked(listener);

      const slots = container.querySelectorAll<HTMLElement>('.card-slot');
      slots[3].click(); // carta en posición 3

      expect(listener).toHaveBeenCalledWith(3);
    });

    it('debe emitir cardClickedEvent para cada carta de la mano', () => {
      view.renderHand(makeHand());
      const listener = vitest.fn();
      view.onCardClicked(listener);

      const slots = container.querySelectorAll<HTMLElement>('.card-slot');
      slots.forEach((slot) => slot.click());

      expect(listener).toHaveBeenCalledTimes(8);
    });
  });

  // ── setCardSelected ────────────────────────────────────────────────────

  describe('setCardSelected', () => {
    it('debe añadir la clase card-slot--selected al seleccionar', () => {
      view.renderHand(makeHand());
      view.setCardSelected(0, true);

      const slot = container.querySelector<HTMLElement>('[data-card-index="0"]');
      expect(slot?.classList.contains('card-slot--selected')).toBe(true);
    });

    it('debe eliminar la clase card-slot--selected al deseleccionar', () => {
      view.renderHand(makeHand());
      view.setCardSelected(0, true);
      view.setCardSelected(0, false);

      const slot = container.querySelector<HTMLElement>('[data-card-index="0"]');
      expect(slot?.classList.contains('card-slot--selected')).toBe(false);
    });

    it('debe afectar solo al índice indicado, no a los demás slots', () => {
      view.renderHand(makeHand());
      view.setCardSelected(2, true);

      const otherSlots = [...container.querySelectorAll<HTMLElement>('.card-slot')]
          .filter((_, i) => i !== 2);
      const noneSelected = otherSlots.every(
          (slot) => !slot.classList.contains('card-slot--selected'),
      );
      expect(noneSelected).toBe(true);
    });

    it('debe ignorar un índice fuera de rango sin lanzar errores', () => {
      view.renderHand(makeHand());
      expect(() => view.setCardSelected(99, true)).not.toThrow();
    });
  });

  // ── replaceCards ───────────────────────────────────────────────────────

  describe('replaceCards', () => {
    it('debe actualizar el src de la imagen en las posiciones reemplazadas', () => {
      view.renderHand(makeHand());
      const newCard = makeCard(6, 'diamonds');
      view.replaceCards([0], [newCard]);

      const image = container.querySelector<HTMLImageElement>(
          '[data-card-index="0"] img',
      );
      expect(image?.src).toContain(newCard.getImagePath());
    });

    it('debe actualizar el alt de la imagen con el nuevo toString()', () => {
      view.renderHand(makeHand());
      const newCard = makeCard(6, 'diamonds');
      view.replaceCards([0], [newCard]);

      const image = container.querySelector<HTMLImageElement>(
          '[data-card-index="0"] img',
      );
      expect(image?.alt).toBe(newCard.toString());
    });

    it('debe eliminar la clase card-slot--selected de las posiciones reemplazadas', () => {
      view.renderHand(makeHand());
      view.setCardSelected(1, true);
      view.replaceCards([1], [makeCard(4, 'clubs')]);

      const slot = container.querySelector<HTMLElement>('[data-card-index="1"]');
      expect(slot?.classList.contains('card-slot--selected')).toBe(false);
    });

    it('debe reemplazar múltiples posiciones correctamente', () => {
      view.renderHand(makeHand());
      const newCards = [makeCard(3, 'clubs'), makeCard(8, 'hearts')];
      view.replaceCards([2, 5], newCards);

      const image2 = container.querySelector<HTMLImageElement>('[data-card-index="2"] img');
      const image5 = container.querySelector<HTMLImageElement>('[data-card-index="5"] img');

      expect(image2?.src).toContain(newCards[0].getImagePath());
      expect(image5?.src).toContain(newCards[1].getImagePath());
    });


    it('índice fuera de rango - no lanza y deja los slots intactos', () => {
      view.renderHand(makeHand());
      expect(() => view.replaceCards([99], [makeCard(6, 'diamonds')])).not.toThrow();

      const firstImage = container.querySelector<HTMLImageElement>(
          '[data-card-index="0"] img',
      );
      expect(firstImage?.src).toContain('2_of_spades');
    });

    it('índice fuera de rango — mezcla de índices válidos e inválidos actualiza solo los válidos', () => {
      view.renderHand(makeHand());
      const newCard = makeCard(10, 'hearts');
      view.replaceCards([0, 99], [newCard, makeCard(6, 'diamonds')]);

      const image0 = container.querySelector<HTMLImageElement>(
          '[data-card-index="0"] img',
      );
      expect(image0?.src).toContain(newCard.getImagePath());
    });

    it('línea 74 — slot sin <img> no lanza error', () => {
      view.renderHand(makeHand());
      const slot = container.querySelector<HTMLElement>('[data-card-index="0"]')!;
      slot.innerHTML = ''; // elimina el <img> del DOM

      expect(() => view.replaceCards([0], [makeCard(8, 'clubs')])).not.toThrow();
    });

    it('línea 74 — slot sin <img> no impide actualizar los slots restantes', () => {
      view.renderHand(makeHand());
      const slot = container.querySelector<HTMLElement>('[data-card-index="0"]')!;
      slot.innerHTML = '';

      const newCard = makeCard(9, 'hearts');
      view.replaceCards([0, 1], [makeCard(8, 'clubs'), newCard]);

      const image1 = container.querySelector<HTMLImageElement>(
          '[data-card-index="1"] img',
      );
      expect(image1?.src).toContain(newCard.getImagePath());
    });
  });

  // ── Robustez ante cambios en la estructura de la carta ────────────────

  describe('robustez ante cambios en la estructura de la carta', () => {
    it('renderHand debe funcionar aunque Card tenga propiedades adicionales', () => {
      class ExtendedCard extends Card {
        extraProperty: string;
        constructor(
            rank: number,
            suit: 'spades' | 'hearts' | 'diamonds' | 'clubs',
            label: RankLabel = '2' as RankLabel,
        ) {
          super(rank, suit, label, `/img/${rank}_of_${suit}.png`);
          this.extraProperty = 'extra';
        }
      }

      const extendedHand = [
        new ExtendedCard(2, 'spades'),
        new ExtendedCard(5, 'hearts'),
      ];
      expect(() => view.renderHand(extendedHand)).not.toThrow();
    });
  });
});
