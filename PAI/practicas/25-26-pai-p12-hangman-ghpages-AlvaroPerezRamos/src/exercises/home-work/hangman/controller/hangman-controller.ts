/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-controller.ts
 * @description Controlador del Ahorcado. Conecta los eventos del modelo
 *   con los métodos de la vista. No contiene lógica de juego ni de DOM.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HangmanModel} from '../model/hangman-model.js';
import {HangmanView} from '../view/hangman-view.js';

const VALID_LETTER_RE = /^\p{L}$/u;

/**
 * Controlador MVC del Ahorcado.
 * Registra los listeners entre modelo y vista, y gestiona el teclado físico.
 */
export class HangmanController {
  private readonly keydownHandler: (event: KeyboardEvent) => void;

  /**
   * @param model Modelo del juego.
   * @param view  Vista del juego.
   */
  constructor(
    private readonly model: HangmanModel,
    private readonly view: HangmanView,
  ) {
    this.keydownHandler = (event: KeyboardEvent) => {
      if (VALID_LETTER_RE.test(event.key)) {
        this.model.play(event.key.toLowerCase());
      }
    };
  }

  /**
   * Conecta eventos del modelo con métodos de la vista y arranca la partida.
   */
  run(): void {
    this.model.newGameEvent.addListener(({wordLength, category, word}) => {
      this.view.onNewGame(wordLength, category, word);
    });

    this.model.letterHitEvent.addListener(({letter, positions}) => {
      this.view.onLetterHit(letter, positions);
    });

    this.model.letterMissEvent.addListener(({letter, failCount}) => {
      this.view.onLetterMiss(letter, failCount);
    });

    this.model.gameOverEvent.addListener(({playerWon, secretWord}) => {
      this.view.onGameOver(playerWon, secretWord);
    });

    this.view.keyboard.letterPressEvent.addListener((letter) => {
      this.model.play(letter);
    });

    this.view.newGameEvent.addListener(() => {
      this.model.startNewGame();
    });

    document.addEventListener('keydown', this.keydownHandler);

    this.model.startNewGame();
  }
}
