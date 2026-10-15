/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file card.test.ts
 * @description Tests unitarios de la clase Card.
 *   Cubre: almacenamiento de propiedades, inmutabilidad observable
 *   y correcta representación textual con toString().
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {Card} from '../../../balatro/model/game/card';
import {describe, it, expect} from 'vitest';

describe('Card', () => {
  describe('propiedades', () => {
    it('debe almacenar rank, suit, label e imagePath sin modificarlos', () => {
      const card = new Card(14, 'spades', 'A', '/img/ace_of_spades.png');

      expect(card.getRank()).toBe(14);
      expect(card.getSuit()).toBe('spades');
      expect(card.getLabel()).toBe('A');
      expect(card.getImagePath()).toBe('/img/ace_of_spades.png');
    });

    it('debe almacenar correctamente un 2 de corazones', () => {
      const card = new Card(2, 'hearts', '2', '/img/2_of_hearts.png');

      expect(card.getRank()).toBe(2);
      expect(card.getSuit()).toBe('hearts');
      expect(card.getLabel()).toBe('2');
    });

    it('debe almacenar correctamente una J de diamantes', () => {
      const card = new Card(11, 'diamonds', 'J', '/img/jack_of_diamonds.png');

      expect(card.getRank()).toBe(11);
      expect(card.getLabel()).toBe('J');
      expect(card.getSuit()).toBe('diamonds');
    });
  });

  // ── toString ────────────────────────────────────────────────────────────

  describe('toString', () => {
    it('debe devolver el símbolo ♠ para spades', () => {
      expect(new Card(14, 'spades', 'A', '').toString()).toBe('A♠');
    });

    it('debe devolver el símbolo ♥ para hearts', () => {
      expect(new Card(14, 'hearts', 'A', '').toString()).toBe('A♥');
    });

    it('debe devolver el símbolo ♦ para diamonds', () => {
      expect(new Card(14, 'diamonds', 'A', '').toString()).toBe('A♦');
    });

    it('debe devolver el símbolo ♣ para clubs', () => {
      expect(new Card(14, 'clubs', 'A', '').toString()).toBe('A♣');
    });

    it('debe anteponer la etiqueta al símbolo para cartas de dos dígitos', () => {
      expect(new Card(10, 'hearts', '10', '').toString()).toBe('10♥');
    });

    it('debe funcionar con figuras (J, Q, K)', () => {
      expect(new Card(11, 'clubs', 'J', '').toString()).toBe('J♣');
      expect(new Card(12, 'spades', 'Q', '').toString()).toBe('Q♠');
      expect(new Card(13, 'diamonds', 'K', '').toString()).toBe('K♦');
    });
  });
});
