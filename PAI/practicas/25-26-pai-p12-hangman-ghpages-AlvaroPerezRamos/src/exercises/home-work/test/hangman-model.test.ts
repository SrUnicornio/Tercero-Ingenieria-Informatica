/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-model.test.ts
 * @description Tests unitarios de HangmanModel.
 *   Cubre: arranque de partida, jugadas correctas e incorrectas,
 *   detección de victoria y derrota, normalización de letras con
 *   acento, palabras compuestas (con espacio y guion), y el límite
 *   exacto de MAX_FAILED_ATTEMPTS.
 *
 *   Se usa un WordProvider stub para controlar la palabra secreta
 *   en cada escenario, sin depender de datos reales.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HangmanModel, MAX_FAILED_ATTEMPTS} from '../hangman/model/hangman-model';
import {
  type WordProvider,
  type NewGameData,
  type LetterHitData,
  type LetterMissData,
  type GameOverData,
} from '../hangman/interfaces/game-state';

import {describe, it, expect, jest} from '@jest/globals';
// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Crea un WordProvider stub que siempre devuelve la misma palabra y categoría.
 *
 * @param word     Palabra secreta a inyectar.
 * @param category Categoría a inyectar.
 * @returns Función compatible con WordProvider.
 */
function makeWordProvider(word: string, category = 'Test'): WordProvider {
  return () => ({word, category});
}

/**
 * Crea un HangmanModel ya arrancado con la palabra dada.
 *
 * @param word     Palabra secreta.
 * @param category Categoría.
 * @returns Modelo con una partida en curso.
 */
function buildStartedModel(word: string, category = 'Test'): HangmanModel {
  const model = new HangmanModel(makeWordProvider(word, category));
  model.startNewGame();
  return model;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HangmanModel', () => {
  // ── startNewGame ───────────────────────────────────────────────────────

  describe('startNewGame', () => {
    it('debe emitir newGameEvent con wordLength, category y word correctos', () => {
      const model = new HangmanModel(makeWordProvider('tigre', 'Animales'));
      const listener = jest.fn<(data: NewGameData) => void>();
      model.newGameEvent.addListener(listener);

      model.startNewGame();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({
        wordLength: 5,
        category: 'Animales',
        word: 'tigre',
      });
    });

    it('debe reiniciar el estado al iniciar una segunda partida', () => {
      const model = new HangmanModel(makeWordProvider('gato'));
      model.startNewGame();
      model.play('g'); // hit
      model.play('z'); // miss

      // Segunda partida con nueva palabra
      const newGameListener = jest.fn<(data: NewGameData) => void>();
      model.newGameEvent.addListener(newGameListener);
      model.startNewGame();

      // La letra 'g' ya no debe estar registrada como acertada
      const hitListener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(hitListener);
      model.play('g');

      expect(hitListener).toHaveBeenCalledTimes(1);
    });

    it('debe emitir newGameEvent cada vez que se llama', () => {
      const model = new HangmanModel(makeWordProvider('oso'));
      const listener = jest.fn<(data: NewGameData) => void>();
      model.newGameEvent.addListener(listener);

      model.startNewGame();
      model.startNewGame();

      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  // ── play — letra acertada ──────────────────────────────────────────────

  describe('play — acierto', () => {
    it('debe emitir letterHitEvent con la letra y sus posiciones', () => {
      const model = buildStartedModel('gato');
      const listener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(listener);

      model.play('a');

      expect(listener).toHaveBeenCalledWith({letter: 'a', positions: [1]});
    });

    it('debe devolver todas las posiciones cuando la letra aparece varias veces', () => {
      const model = buildStartedModel('banana');
      const listener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(listener);

      model.play('a');

      expect(listener).toHaveBeenCalledWith({letter: 'a', positions: [1, 3, 5]});
    });

    it('no debe emitir letterMissEvent al acertar', () => {
      const model = buildStartedModel('sol');
      const missListener = jest.fn<(data: LetterMissData) => void>();
      model.letterMissEvent.addListener(missListener);

      model.play('s');

      expect(missListener).not.toHaveBeenCalled();
    });

    it('debe ignorar una letra ya acertada en jugadas posteriores', () => {
      const model = buildStartedModel('pez');
      const hitListener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(hitListener);

      model.play('p');
      model.play('p'); // duplicada

      expect(hitListener).toHaveBeenCalledTimes(1);
    });
  });

  // ── play — fallo ───────────────────────────────────────────────────────

  describe('play — fallo', () => {
    it('debe emitir letterMissEvent con failCount incremental', () => {
      const model = buildStartedModel('oso');
      const listener = jest.fn<(data: LetterMissData) => void>();
      model.letterMissEvent.addListener(listener);

      model.play('z');
      model.play('x');

      expect(listener).toHaveBeenNthCalledWith(1, {letter: 'z', failCount: 1});
      expect(listener).toHaveBeenNthCalledWith(2, {letter: 'x', failCount: 2});
    });

    it('debe ignorar una letra ya fallada en jugadas posteriores', () => {
      const model = buildStartedModel('luna');
      const missListener = jest.fn<(data: LetterMissData) => void>();
      model.letterMissEvent.addListener(missListener);

      model.play('z');
      model.play('z'); // duplicada

      expect(missListener).toHaveBeenCalledTimes(1);
    });

    it('no debe emitir letterHitEvent al fallar', () => {
      const model = buildStartedModel('mar');
      const hitListener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(hitListener);

      model.play('z');

      expect(hitListener).not.toHaveBeenCalled();
    });
  });

  // ── victoria ───────────────────────────────────────────────────────────

  describe('victoria', () => {
    it('debe emitir gameOverEvent con playerWon=true al descubrir todas las letras', () => {
      const model = buildStartedModel('oso');
      const listener = jest.fn<(data: GameOverData) => void>();
      model.gameOverEvent.addListener(listener);

      model.play('o');
      model.play('s');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({playerWon: true, secretWord: 'oso'});
    });

    it('debe ignorar jugadas posteriores una vez que la partida terminó (victoria)', () => {
      const model = buildStartedModel('oso');
      const missListener = jest.fn<(data: LetterMissData) => void>();
      model.letterMissEvent.addListener(missListener);

      model.play('o');
      model.play('s');
      model.play('z'); // jugada tras victoria

      expect(missListener).not.toHaveBeenCalled();
    });
  });

  // ── derrota ────────────────────────────────────────────────────────────

  describe('derrota', () => {
    it(`debe emitir gameOverEvent con playerWon=false al alcanzar ${MAX_FAILED_ATTEMPTS} fallos`, () => {
      const model = buildStartedModel('oso');
      const listener = jest.fn<(data: GameOverData) => void>();
      model.gameOverEvent.addListener(listener);

      for (const letter of ['z', 'x', 'q', 'w', 'b', 'c']) {
        model.play(letter);
      }

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({playerWon: false, secretWord: 'oso'});
    });

    it('debe emitir gameOverEvent exactamente en el fallo número MAX_FAILED_ATTEMPTS', () => {
      const model = buildStartedModel('oso');
      const gameOverListener = jest.fn<(data: GameOverData) => void>();
      model.gameOverEvent.addListener(gameOverListener);

      const wrongLetters = ['z', 'x', 'q', 'w', 'b'];
      for (const letter of wrongLetters) {
        model.play(letter);
        expect(gameOverListener).not.toHaveBeenCalled();
      }

      model.play('c'); // fallo número 6 → derrota
      expect(gameOverListener).toHaveBeenCalledTimes(1);
    });

    it('debe ignorar jugadas posteriores una vez que la partida terminó (derrota)', () => {
      const model = buildStartedModel('oso');
      const hitListener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(hitListener);

      for (const letter of ['z', 'x', 'q', 'w', 'b', 'c']) {
        model.play(letter);
      }

      model.play('o'); // jugada tras derrota

      expect(hitListener).not.toHaveBeenCalled();
    });
  });

  // ── normalización y acento ─────────────────────────────────────────────

  describe('normalización de letras', () => {
    it('debe encontrar letras con acento en la palabra usando la versión sin acento', () => {
      const model = buildStartedModel('Águila');
      const hitListener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(hitListener);

      // El jugador teclea 'a' sin acento; debe revelar la posición 0 ('Á')
      model.play('a');

      expect(hitListener).toHaveBeenCalledWith({letter: 'a', positions: [0, 5]});
    });

    it('debe normalizar a minúsculas la letra enviada al evento', () => {
      const model = buildStartedModel('tigre');
      const hitListener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(hitListener);

      model.play('T'); // mayúscula

      expect(hitListener).toHaveBeenCalledWith({letter: 't', positions: [0]});
    });
  });

  // ── palabras compuestas ────────────────────────────────────────────────

  describe('palabras compuestas (separadores)', () => {
    it('debe tratar los espacios como separadores, no como letras a adivinar', () => {
      // 'osa polar': espacio en posición 3 no cuenta como letra
      const model = buildStartedModel('osa polar');
      const gameOverListener = jest.fn<(data: GameOverData) => void>();
      model.gameOverEvent.addListener(gameOverListener);

      // Descubrir todas las letras únicas: o, s, a, p, l, r
      for (const letter of ['o', 's', 'a', 'p', 'l', 'r']) {
        model.play(letter);
      }

      expect(gameOverListener).toHaveBeenCalledWith(
          expect.objectContaining({playerWon: true}),
      );
    });

    it('debe tratar los guiones como separadores en palabras compuestas', () => {
      const model = buildStartedModel('bien-estar');
      const gameOverListener = jest.fn<(data: GameOverData) => void>();
      model.gameOverEvent.addListener(gameOverListener);

      // Letras únicas: b, i, e, n, s, t, a, r
      for (const letter of ['b', 'i', 'e', 'n', 's', 't', 'a', 'r']) {
        model.play(letter);
      }

      expect(gameOverListener).toHaveBeenCalledWith(
          expect.objectContaining({playerWon: true}),
      );
    });

    it('debe devolver las posiciones correctas ignorando el espacio en la búsqueda', () => {
      // 'osa polar' → 'o' aparece en posiciones 0 y 4
      const model = buildStartedModel('osa polar');
      const hitListener = jest.fn<(data: LetterHitData) => void>();
      model.letterHitEvent.addListener(hitListener);

      model.play('o');

      expect(hitListener).toHaveBeenCalledWith({letter: 'o', positions: [0, 5]});
    });
  });
});
