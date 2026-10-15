/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file round-manager.test.ts
 * @description Tests unitarios de RoundManager.
 *   Cubre: reset, registerHandScore, useDiscard, getters de estado
 *   (score, handsRemaining, discardsRemaining, scoreGoal) y
 *   flags de fin de partida (isVictory, isDefeated).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {RoundManager} from '../../../balatro/model/game/round-manager';
import {describe, it, expect, beforeEach} from 'vitest';

/** Manos disponibles por nivel (debe coincidir con la constante interna). */
const HANDS_PER_LEVEL = 3;

/** Descartes disponibles por nivel. */
const DISCARDS_PER_LEVEL = 3;

/** Puntuación objetivo del Small Blind. */
const SMALL_BLIND_GOAL = 300;

describe('RoundManager', () => {
  let manager: RoundManager;

  beforeEach(() => {
    manager = new RoundManager();
  });

  // ── estado inicial ─────────────────────────────────────────────────────

  describe('estado inicial', () => {
    it('debe tener score = 0', () => {
      expect(manager.getScore()).toBe(0);
    });

    it(`debe tener handsRemaining = ${HANDS_PER_LEVEL}`, () => {
      expect(manager.getHandsRemaining()).toBe(HANDS_PER_LEVEL);
    });

    it(`debe tener discardsRemaining = ${DISCARDS_PER_LEVEL}`, () => {
      expect(manager.getDiscardsRemaining()).toBe(DISCARDS_PER_LEVEL);
    });

    it(`debe tener scoreGoal = ${SMALL_BLIND_GOAL}`, () => {
      expect(manager.getScoreGoal()).toBe(SMALL_BLIND_GOAL);
    });

    it('no debe ser victoria ni derrota al inicio', () => {
      expect(manager.getIsVictory()).toBe(false);
      expect(manager.getIsDefeated()).toBe(false);
    });

    it('debe devolver el número de manos iniciales del nivel', () => {
      expect(manager.getInitialHands()).toBe(HANDS_PER_LEVEL);
    });

    it('debe devolver el número de descartes iniciales del nivel', () => {
      expect(manager.getInitialDiscards()).toBe(DISCARDS_PER_LEVEL);
    });
  });

  // ── reset ──────────────────────────────────────────────────────────────

  describe('reset', () => {
    it('debe restablecer score a 0', () => {
      manager.registerHandScore(150);
      manager.reset();
      expect(manager.getScore()).toBe(0);
    });

    it(`debe restablecer handsRemaining a ${HANDS_PER_LEVEL}`, () => {
      manager.registerHandScore(10);
      manager.registerHandScore(10);
      manager.reset();
      expect(manager.getHandsRemaining()).toBe(HANDS_PER_LEVEL);
    });

    it(`debe restablecer discardsRemaining a ${DISCARDS_PER_LEVEL}`, () => {
      manager.useDiscard();
      manager.reset();
      expect(manager.getDiscardsRemaining()).toBe(DISCARDS_PER_LEVEL);
    });

    it('debe limpiar los flags de victoria y derrota', () => {
      // Forzamos victoria
      manager.registerHandScore(SMALL_BLIND_GOAL);
      expect(manager.getIsVictory()).toBe(true);

      manager.reset();
      expect(manager.getIsVictory()).toBe(false);
      expect(manager.getIsDefeated()).toBe(false);
    });
  });

  // ── registerHandScore ──────────────────────────────────────────────────

  describe('registerHandScore', () => {
    it('debe acumular la puntuación correctamente', () => {
      manager.registerHandScore(50);
      manager.registerHandScore(80);
      expect(manager.getScore()).toBe(130);
    });

    it('debe devolver el total acumulado tras la mano', () => {
      manager.registerHandScore(100);
      const total = manager.registerHandScore(75);
      expect(total).toBe(175);
    });

    it('debe decrementar handsRemaining en 1 por llamada', () => {
      manager.registerHandScore(10);
      expect(manager.getHandsRemaining()).toBe(HANDS_PER_LEVEL - 1);
    });

    it('debe decrementar handsRemaining hasta 0 tras agotar las manos', () => {
      for (let i = 0; i < HANDS_PER_LEVEL; i++) {
        manager.registerHandScore(10);
      }
      expect(manager.getHandsRemaining()).toBe(0);
    });

    it('no debe modificar discardsRemaining', () => {
      manager.registerHandScore(50);
      expect(manager.getDiscardsRemaining()).toBe(DISCARDS_PER_LEVEL);
    });
  });

  // ── useDiscard ─────────────────────────────────────────────────────────

  describe('useDiscard', () => {
    it('debe decrementar discardsRemaining en 1', () => {
      manager.useDiscard();
      expect(manager.getDiscardsRemaining()).toBe(DISCARDS_PER_LEVEL - 1);
    });

    it('debe llegar a 0 tras agotar todos los descartes', () => {
      for (let i = 0; i < DISCARDS_PER_LEVEL; i++) {
        manager.useDiscard();
      }
      expect(manager.getDiscardsRemaining()).toBe(0);
    });

    it('no debe modificar score ni handsRemaining', () => {
      manager.useDiscard();
      expect(manager.getScore()).toBe(0);
      expect(manager.getHandsRemaining()).toBe(HANDS_PER_LEVEL);
    });
  });

  // ── isVictory ──────────────────────────────────────────────────────────

  describe('isVictory', () => {
    it('debe ser false mientras score < scoreGoal', () => {
      manager.registerHandScore(SMALL_BLIND_GOAL - 1);
      expect(manager.getIsVictory()).toBe(false);
    });

    it('debe ser true cuando score === scoreGoal', () => {
      manager.registerHandScore(SMALL_BLIND_GOAL);
      expect(manager.getIsVictory()).toBe(true);
    });

    it('debe ser true cuando score > scoreGoal', () => {
      manager.registerHandScore(SMALL_BLIND_GOAL + 100);
      expect(manager.getIsVictory()).toBe(true);
    });

    it('debe ser true aunque queden manos disponibles', () => {
      manager.registerHandScore(SMALL_BLIND_GOAL);
      expect(manager.getHandsRemaining()).toBeGreaterThan(0);
      expect(manager.getIsVictory()).toBe(true);
    });
  });

  // ── isDefeated ─────────────────────────────────────────────────────────

  describe('isDefeated', () => {
    it('debe ser false mientras queden manos', () => {
      manager.registerHandScore(10);
      expect(manager.getIsDefeated()).toBe(false);
    });

    it('debe ser false si se agotaron las manos pero se alcanzó el objetivo', () => {
      for (let i = 0; i < HANDS_PER_LEVEL; i++) {
        manager.registerHandScore(SMALL_BLIND_GOAL);
      }
      expect(manager.getIsDefeated()).toBe(false);
    });

    it('debe ser true cuando se agotan las manos sin alcanzar el objetivo', () => {
      for (let i = 0; i < HANDS_PER_LEVEL; i++) {
        manager.registerHandScore(1);
      }
      expect(manager.getHandsRemaining()).toBe(0);
      expect(manager.getIsDefeated()).toBe(true);
    });

    it('no debe ser true si todavía quedan manos aunque score sea bajo', () => {
      manager.registerHandScore(1);
      expect(manager.getIsDefeated()).toBe(false);
    });
  });

  // ── isVictory e isDefeated son mutuamente excluyentes ─────────────────

  describe('exclusión mutua victory / defeated', () => {
    it('no pueden ser ambos true a la vez', () => {
      // Agotamos manos CON puntuación suficiente → victoria, no derrota
      for (let i = 0; i < HANDS_PER_LEVEL; i++) {
        manager.registerHandScore(SMALL_BLIND_GOAL);
      }
      expect(manager.getIsVictory() && manager.getIsDefeated()).toBe(false);
    });

    it('pueden ser ambos false (partida en curso)', () => {
      manager.registerHandScore(10);
      expect(manager.getIsVictory()).toBe(false);
      expect(manager.getIsDefeated()).toBe(false);
    });
  });
});
