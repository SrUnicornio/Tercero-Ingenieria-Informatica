/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file score-panel-view.test.ts
 * @description Tests unitarios de ScorePanelView.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {ScorePanelView} from '../../balatro/view/score-panel-view';
import {describe, it, expect, beforeEach} from 'vitest';

function buildPanel(): {
  view: ScorePanelView;
  deckRemainingDisplay: HTMLElement;
  scoreTotalDisplay: HTMLElement;
  progressFill: HTMLElement;
  progressText: HTMLElement;
  handSizeIndicator: HTMLElement;
  previewHandName: HTMLElement;
  previewChipsDisplay: HTMLElement;
  previewMultDisplay: HTMLElement;
  previewTotalDisplay: HTMLElement;
  } {
  const deckRemainingDisplay = document.createElement('span');
  const scoreTotalDisplay = document.createElement('span');
  const progressFill = document.createElement('div');
  const progressText = document.createElement('span');
  const handSizeIndicator = document.createElement('span');
  const previewHandName = document.createElement('span');
  const previewChipsDisplay = document.createElement('span');
  const previewMultDisplay = document.createElement('span');
  const previewTotalDisplay = document.createElement('span');

  const view = new ScorePanelView(
      {
        deckRemaining: deckRemainingDisplay,
        scoreTotal: scoreTotalDisplay,
        progressFill,
        progressText,
      },
      {
        handSizeIndicator,
        handName: previewHandName,
        chips: previewChipsDisplay,
        multiplier: previewMultDisplay,
        total: previewTotalDisplay,
      },
  );

  return {
    view, deckRemainingDisplay, scoreTotalDisplay, progressFill,
    progressText, handSizeIndicator,
    previewHandName, previewChipsDisplay, previewMultDisplay,
    previewTotalDisplay,
  };
}

describe('ScorePanelView', () => {
  let panel: ReturnType<typeof buildPanel>;

  beforeEach(() => {
    panel = buildPanel();
  });

  // ── updateDeckRemaining ────────────────────────────────────────────────

  describe('updateDeckRemaining', () => {
    it('debe mostrar las cartas restantes en formato X/52', () => {
      panel.view.updateDeckRemaining(44);
      expect(panel.deckRemainingDisplay.textContent).toBe('44/52');
    });

    it('debe actualizarse al llamarse varias veces', () => {
      panel.view.updateDeckRemaining(44);
      panel.view.updateDeckRemaining(40);
      expect(panel.deckRemainingDisplay.textContent).toBe('40/52');
    });

    it('debe mostrar 0/52 cuando el mazo está agotado', () => {
      panel.view.updateDeckRemaining(0);
      expect(panel.deckRemainingDisplay.textContent).toBe('0/52');
    });
  });

  // ── updateTotalScore ───────────────────────────────────────────────────

  describe('updateTotalScore', () => {
    it('debe mostrar la puntuación total en el elemento correspondiente', () => {
      panel.view.updateTotalScore(150);
      expect(panel.scoreTotalDisplay.textContent).toBe('150');
    });

    it('debe mostrar 0 al inicio de partida', () => {
      panel.view.updateTotalScore(0);
      expect(panel.scoreTotalDisplay.textContent).toBe('0');
    });

    it('debe reflejar la última llamada en llamadas sucesivas', () => {
      panel.view.updateTotalScore(100);
      panel.view.updateTotalScore(350);
      expect(panel.scoreTotalDisplay.textContent).toBe('350');
    });

    it('debe actualizar el ancho del relleno de la barra de progreso', () => {
      panel.view.updateTotalScore(150); // 150/300 = 50%
      expect(panel.progressFill.style.width).toBe('50%');
    });

    it('debe mostrar el porcentaje correcto en el texto de progreso', () => {
      panel.view.updateTotalScore(150);
      expect(panel.progressText.textContent).toBe('50%');
    });

    it('no debe superar 100% aunque la puntuación supere el objetivo', () => {
      panel.view.updateTotalScore(600);
      expect(panel.progressText.textContent).toBe('100%');
    });

    it('debe mostrar 0% cuando la puntuación es 0', () => {
      panel.view.updateTotalScore(0);
      expect(panel.progressText.textContent).toBe('0%');
    });

    it('debe añadir progress-fill--complete al superar el objetivo', () => {
      panel.view.updateTotalScore(300);
      expect(panel.progressFill.classList.contains('progress-fill--complete')).toBe(true);
    });

    it('debe quitar progress-fill--complete si baja del objetivo', () => {
      panel.view.updateTotalScore(300);
      panel.view.updateTotalScore(100);
      expect(panel.progressFill.classList.contains('progress-fill--complete')).toBe(false);
    });
  });

  // ── updateHandSizeIndicator ────────────────────────────────────────────

  describe('updateHandSizeIndicator', () => {
    it('debe mostrar "X / 5" con la selección actual', () => {
      panel.view.updateHandSizeIndicator(3, 5);
      expect(panel.handSizeIndicator.textContent).toBe('3 / 5');
    });

    it('debe mostrar "0 / 5" cuando no hay selección', () => {
      panel.view.updateHandSizeIndicator(0, 5);
      expect(panel.handSizeIndicator.textContent).toBe('0 / 5');
    });

    it('debe actualizarse correctamente al cambiar la selección', () => {
      panel.view.updateHandSizeIndicator(2, 5);
      panel.view.updateHandSizeIndicator(5, 5);
      expect(panel.handSizeIndicator.textContent).toBe('5 / 5');
    });
  });

  // ── updateScorePreview con HandResult ──────────────────────────────────

  describe('updateScorePreview — con HandResult', () => {
    it('debe mostrar el nombre de la jugada en previewHandName', () => {
      panel.view.updateScorePreview(
          {handName: 'Flush', chips: 35, multiplier: 4, scoringCards: []},
      );
      expect(panel.previewHandName.textContent).toBe('Flush');
    });

    it('debe sumar chips base + cardBonusChips en previewChipsDisplay', () => {
      panel.view.updateScorePreview(
          {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []},
          8,
      );
      expect(panel.previewChipsDisplay.textContent).toBe('18');
    });

    it('debe mostrar el multiplicador en previewMultDisplay', () => {
      panel.view.updateScorePreview(
          {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []},
      );
      expect(panel.previewMultDisplay.textContent).toBe('2');
    });

    it('debe mostrar el total calculado en previewTotalDisplay', () => {
      panel.view.updateScorePreview(
          {handName: 'Pair', chips: 10, multiplier: 2, scoringCards: []},
          5,
      );
      expect(panel.previewTotalDisplay.textContent).toContain('30');
    });

    it('debe actualizarse correctamente al cambiar la selección', () => {
      panel.view.updateScorePreview(
          {handName: 'High Card', chips: 5, multiplier: 1, scoringCards: []},
      );
      panel.view.updateScorePreview(
          {handName: 'Straight Flush', chips: 100, multiplier: 8, scoringCards: []},
      );
      expect(panel.previewHandName.textContent).toBe('Straight Flush');
      expect(panel.previewChipsDisplay.textContent).toBe('100');
      expect(panel.previewMultDisplay.textContent).toBe('8');
    });
  });

  // ── updateScorePreview con null ────────────────────────────────────────

  describe('updateScorePreview — con null (sin selección)', () => {
    it('debe mostrar "—" en previewHandName', () => {
      panel.view.updateScorePreview(null);
      expect(panel.previewHandName.textContent).toBe('—');
    });

    it('debe mostrar "0" en previewChipsDisplay', () => {
      panel.view.updateScorePreview(null);
      expect(panel.previewChipsDisplay.textContent).toBe('0');
    });

    it('debe mostrar "0" en previewMultDisplay', () => {
      panel.view.updateScorePreview(null);
      expect(panel.previewMultDisplay.textContent).toBe('0');
    });

    it('debe vaciar previewTotalDisplay', () => {
      panel.view.updateScorePreview(
          {handName: 'Flush', chips: 35, multiplier: 4, scoringCards: []},
      );
      panel.view.updateScorePreview(null);
      expect(panel.previewTotalDisplay.textContent).toBe('');
    });

    it('debe volver al estado neutro tras haber mostrado una jugada', () => {
      panel.view.updateScorePreview(
          {handName: 'Flush', chips: 35, multiplier: 4, scoringCards: []},
      );
      panel.view.updateScorePreview(null);
      expect(panel.previewHandName.textContent).toBe('—');
    });
  });
});
