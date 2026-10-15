/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-view.ts
 * @description Vista principal del Ahorcado. Facade que orquesta el renderer
 *   del ahorcado, el panel de texto y el teclado de letras.
 *
 *   El renderer se recibe por inyección de dependencia (DIP): HangmanView
 *   depende únicamente de la abstracción HangmanRenderer, sin conocer si
 *   se usa canvas, imágenes PNG u otra implementación futura.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HangmanRenderer} from './hangman-render/hangman-renderer.js';
import {HangmanCanvasRenderer} from './hangman-render/hangman-canvas-renderer.js';
import {HangmanImageRenderer} from './hangman-render/hangman-image-renderer.js';
import {GamePanelView} from './game-panel-view.js';
import {LetterKeyboard} from '../controller/letter-keyboard.js';
import {Event} from '../observer/event.js';
import {DEFAULT_RENDER_CONFIG} from '../interfaces/render-config.js';

/** IDs de los elementos del DOM que maneja esta vista. */
const DOM_IDS = {
  canvas: 'hangmanCanvas',
  wordDisplay: 'wordDisplay',
  remainingAttempts: 'remainingAttemptsDisplay',
  failedLetters: 'failedLettersDisplay',
  letterKeyboard: 'letterKeyboard',
  gameStatus: 'gameStatusMessage',
  newGameButton: 'newGameButton',
  categoryLabel: 'categoryLabel',
} as const;

/**
 * Vista principal. Cada método público corresponde a un evento del modelo.
 * El controlador conecta modelo → vista sin que ninguno conozca al otro.
 *
 * Si no se inyecta ningún renderer, construye internamente un
 * HangmanCanvasRenderer con la configuración por defecto.
 */
export class HangmanView {
  /** Evento emitido cuando el jugador pulsa «Nueva partida». */
  readonly newGameEvent = new Event<void>();
  /** Renderer inyectado (canvas o imágenes). */
  private readonly renderer: HangmanRenderer;
  /** Panel de texto que muestra la palabra, intentos restantes, letras falladas y mensaje final. */
  private readonly panel: GamePanelView;
  /** Teclado de letras expuesto al controlador para suscribir letterPressEvent. */
  readonly keyboard: LetterKeyboard;
  /** Contador de fallos local para pasar al renderer. */
  private failCount: number = 0;

  /**
   * @param renderer Implementación concreta de HangmanRenderer.
   *   Si se omite, se instancia un HangmanCanvasRenderer por defecto.
   */
  constructor() {
    try {
      this.renderer = new HangmanImageRenderer('hangmanImage', 'hangmanCanvas');
    } catch {
      const canvas = this.getElement<HTMLCanvasElement>(DOM_IDS.canvas);
      this.renderer = new HangmanCanvasRenderer(canvas, DEFAULT_RENDER_CONFIG);
    }

    this.panel = new GamePanelView(
        this.getElement(DOM_IDS.wordDisplay),
        this.getElement(DOM_IDS.remainingAttempts),
        this.getElement(DOM_IDS.failedLetters),
        this.getElement(DOM_IDS.gameStatus),
        this.getElement(DOM_IDS.categoryLabel),
    );

    this.keyboard = new LetterKeyboard(
        this.getElement(DOM_IDS.letterKeyboard),
    );

    this.getElement<HTMLButtonElement>(DOM_IDS.newGameButton)
        .addEventListener('click', () => {
          this.newGameEvent.trigger(undefined as unknown as void);
        });
  }

  /**
   * Inicializa la interfaz para una nueva partida.
   * @param wordLength Longitud de la palabra secreta.
   * @param category   Categoría de la palabra secreta.
   */
  onNewGame(wordLength: number, category: string, word: string): void {
    this.failCount = 0;
    this.renderer.render(0);
    this.panel.initWordDisplay(wordLength, category, word);
    this.keyboard.reset();
  }

  /**
   * Actualiza la vista cuando el jugador acierta una letra.
   * @param letter    Letra acertada.
   * @param positions Índices donde aparece en la palabra.
   */
  onLetterHit(letter: string, positions: readonly number[]): void {
    this.panel.revealLetter(positions);
    this.keyboard.markCorrect(letter);
  }

  /**
   * Actualiza la vista cuando el jugador falla una letra.
   * @param letter    Letra fallada.
   * @param failCount Número de fallos acumulados.
   */
  onLetterMiss(letter: string, failCount: number): void {
    this.failCount = failCount;
    this.renderer.render(this.failCount);
    this.panel.addFailedLetter(letter, failCount);
    this.keyboard.markWrong(letter);
  }

  /**
   * Actualiza la vista al terminar la partida.
   * @param playerWon  True si el jugador ganó.
   * @param secretWord Palabra secreta.
   */
  onGameOver(playerWon: boolean, secretWord: string): void {
    this.keyboard.disableAll();
    if (playerWon) {
      this.panel.showWin(secretWord);
    } else {
      this.panel.showLoss(secretWord);
    }
  }

  /**
   * Obtiene un elemento del DOM por su ID y lo devuelve tipado.
   * @param id ID del elemento.
   * @throws {Error} Si el elemento no existe en el DOM.
   */
  private getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T | null;
    if (!element) throw new Error(`DOM element #${id} not found`);
    return element;
  }
}
