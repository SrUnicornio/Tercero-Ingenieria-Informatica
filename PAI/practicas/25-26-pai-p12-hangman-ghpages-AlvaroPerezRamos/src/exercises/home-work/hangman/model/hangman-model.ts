/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-model.ts
 * @description Modelo del juego del Ahorcado. Gestiona la lógica y emite
 *   eventos cuando el estado cambia. No conoce el DOM ni la vista,
 *   ni ninguna categoría concreta: solo depende del contrato WordProvider.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {Event} from '../observer/event.js';
import {
  type WordProvider,
  type LetterHitData,
  type LetterMissData,
  type GameOverData,
  type NewGameData,
} from '../interfaces/game-state.js';

/** Número máximo de fallos antes de perder la partida. */
export const MAX_FAILED_ATTEMPTS = 6;

/**
 * Modelo del Ahorcado.
 * Emite cuatro eventos que el controlador conecta con la vista:
 * - `newGameEvent`    → nueva partida iniciada
 * - `letterHitEvent`  → letra acertada
 * - `letterMissEvent` → letra fallada
 * - `gameOverEvent`   → partida terminada
 */
export class HangmanModel {
  /** Palabra secreta de la partida en curso. */
  private secretWord: string = '';
  /** Categoría de la palabra secreta de la partida en curso. */
  private currentCategory: string = '';
  /** Letras acertadas por el jugador. */
  private readonly guessed: Set<string> = new Set();
  /** Letras falladas por el jugador. */
  private readonly failed: Set<string> = new Set();
  /** Indica si la partida ha terminado. */
  private over: boolean = false;

  readonly newGameEvent = new Event<NewGameData>();
  readonly letterHitEvent = new Event<LetterHitData>();
  readonly letterMissEvent = new Event<LetterMissData>();
  readonly gameOverEvent = new Event<GameOverData>();

  /**
   * @param wordProvider Función que devuelve un WordEntry aleatorio.
   *   Inyectada desde el cliente; el modelo no sabe qué hay detrás.
   */
  constructor(private readonly wordProvider: WordProvider) { }

  /**
   * Inicia una nueva partida: obtiene palabra y categoría del provider,
   * reinicia el estado interno y emite newGameEvent.
   */
  startNewGame(): void {
    const entry = this.wordProvider();
    this.secretWord = entry.word;
    this.currentCategory = entry.category;
    this.guessed.clear();
    this.failed.clear();
    this.over = false;
    this.newGameEvent.trigger({
      wordLength: this.secretWord.length,
      category: this.currentCategory,
      word: this.secretWord,
    });
  }

  /**
   * Registra el intento del jugador con una letra.
   * Ignora la letra si la partida terminó o si ya fue usada.
   * @param letter Letra en minúsculas.
   */
  play(letter: string): void {
    if (this.over) return;
    const cleanLetter = this.normalize(letter);
    if (this.isSeparator(cleanLetter) || cleanLetter === '') return;
    if (this.guessed.has(cleanLetter) || this.failed.has(cleanLetter)) return;

    const positions = this.findPositions(cleanLetter);

    if (positions.length > 0) {
      this.guessed.add(cleanLetter);
      this.letterHitEvent.trigger({letter: cleanLetter, positions});
      if (this.allLettersFound()) {
        this.over = true;
        this.gameOverEvent.trigger({
          playerWon: true,
          secretWord: this.secretWord,
        });
      }
    } else {
      this.failed.add(cleanLetter);
      this.letterMissEvent.trigger({
        letter: cleanLetter, failCount: this.failed.size,
      });
      if (this.failed.size >= MAX_FAILED_ATTEMPTS) {
        this.over = true;
        this.gameOverEvent.trigger({
          playerWon: false,
          secretWord: this.secretWord,
        });
      }
    }
  }

  /**
   * Normaliza una cadena: la convierte a minúsculas y elimina acentos.
   *
   * @param word Cadena a normalizar.
   * @returns Cadena normalizada.
   */
  private normalize(word: string): string {
    return word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .normalize('NFC');
  }

  /**
   * Devuelve los índices de la palabra secreta donde aparece la letra.
   * @param letter Letra a buscar.
   * @returns Array de índices (puede estar vacío).
   */
  private findPositions(letter: string): number[] {
    const cleanLetter = this.normalize(letter);
    const positions: number[] = [];
    for (let i = 0; i < this.secretWord.length; i++) {
      if (this.normalize(this.secretWord[i]) === cleanLetter) positions.push(i);
    }
    return positions;
  }

  /**
   * Comprueba si todas las letras de la palabra han sido adivinadas.
   * Los espacios (palabras compuestas) se ignoran: no cuentan como letra
   * a adivinar.
   */
  private allLettersFound(): boolean {
    return [...this.secretWord].every(
        (character) => this.isSeparator(character) ||
        this.guessed.has(this.normalize(character)),
    );
  }

  /**
   * Determina si un carácter es un separador (espacio, guion u otro símbolo) o una letra normal. Los separadores no se consideran letras a adivinar.
   *
   * @param character - Carácter a clasificar.
   * @returns `true` si el carácter es un separador, `false` si es una letra normal.
   */
  private isSeparator(character: string): boolean {
    return character === ' ' || /[^a-záéíóúàèìòùâêîôûäëïöüñç\p{L}]/u.test(character);
  }
}

