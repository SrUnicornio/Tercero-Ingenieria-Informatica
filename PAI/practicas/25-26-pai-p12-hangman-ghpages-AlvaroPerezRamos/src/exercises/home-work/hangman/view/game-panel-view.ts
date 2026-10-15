/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file game-panel-view.ts
 * @description Panel de texto del juego: casillas de la palabra,
 *   contador de intentos, letras falladas y mensaje de estado.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {MAX_FAILED_ATTEMPTS} from '../model/hangman-model.js';

/**
 * Subvista que gestiona los elementos de texto del panel lateral.
 */
export class GamePanelView {
  /** Palabra secreta original (con acentos) para revelar correctamente. */
  private originalWord: string = '';

  /**
   * @param wordDisplay         Contenedor de las casillas de la palabra.
   * @param remainingAttemptsEl Elemento de intentos restantes.
   * @param failedLettersEl     Elemento de letras falladas.
   * @param gameStatusEl        Elemento del mensaje de estado.
   * @param categoryLabelEl     Elemento que muestra la categoría activa.
   */
  constructor(
    private readonly wordDisplay: HTMLElement,
    private readonly remainingAttemptsEl: HTMLElement,
    private readonly failedLettersEl: HTMLElement,
    private readonly gameStatusEl: HTMLElement,
    private readonly categoryLabelEl: HTMLElement,
  ) { }

  /**
   * Construye las casillas vacías al inicio de una nueva partida.
   * @param wordLength Número de letras de la palabra secreta.
   * @param category   Categoría de la palabra secreta.
   * @param word       Palabra secreta completa, necesaria para marcar los espacios en palabras compuestas.
   */
  initWordDisplay(wordLength: number, category: string, word: string): void {
    this.originalWord = word;
    this.wordDisplay.innerHTML = '';

    for (let i = 0; i < wordLength; i++) {
      const char = word[i];
      const type = this.getCharType(char);
      const cell = document.createElement('span');

      if (type === 'space') {
        cell.className = 'word-display__space';
      } else if (type === 'separator') {
        cell.className = 'word-display__hyphen';
        cell.textContent = char;
      } else {
        cell.className = 'word-display__cell';
      }

      cell.dataset['index'] = String(i);
      this.wordDisplay.appendChild(cell);
    }

    this.remainingAttemptsEl.textContent = String(MAX_FAILED_ATTEMPTS);
    this.failedLettersEl.textContent = '—';
    this.gameStatusEl.textContent = '';
    this.gameStatusEl.className = 'game-status';
    this.categoryLabelEl.textContent = category;
  }

  /**
   * Revela una letra acertada en sus posiciones usando la palabra original.
   * @param positions Índices donde aparece en la palabra.
   */
  revealLetter(positions: readonly number[]): void {
    for (const index of positions) {
      const cell = this.wordDisplay
          .querySelector<HTMLElement>(`[data-index="${index}"]`);
      if (cell) cell.textContent = this.originalWord[index].toUpperCase();
    }
  }

  /**
   * Añade una letra fallada a la lista y actualiza el contador.
   * @param letter    Letra fallada.
   * @param failCount Número de fallos acumulados.
   */
  addFailedLetter(letter: string, failCount: number): void {
    const current = this.failedLettersEl.textContent ?? '';
    const letters = current === '—' ? [] : current.split(', ');
    letters.push(letter.toUpperCase());
    this.failedLettersEl.textContent = letters.join(', ');
    this.remainingAttemptsEl.textContent =
      String(MAX_FAILED_ATTEMPTS - failCount);
  }

  /**
   * Muestra el mensaje de victoria.
   * @param word Palabra secreta.
   */
  showWin(word: string): void {
    this.gameStatusEl.textContent =
      `¡Ganaste! La palabra era "${word.toUpperCase()}"`;
    this.gameStatusEl.className = 'game-status game-status--win';
  }

  /**
   * Muestra el mensaje de derrota y revela las letras no descubiertas.
   * @param word Palabra secreta.
   */
  showLoss(word: string): void {
    this.revealAll();
    this.gameStatusEl.textContent =
      `¡Perdiste! La palabra era "${word.toUpperCase()}"`;
    this.gameStatusEl.className = 'game-status game-status--lose';
  }

  /**
   * Revela todas las casillas con la palabra secreta (derrota).
   * Usa data-index para manejar correctamente palabras compuestas.
   */
  private revealAll(): void {
    const cells = this.wordDisplay
        .querySelectorAll<HTMLElement>('.word-display__cell');
    cells.forEach((cell) => {
      if (!cell.textContent) {
        const index = Number(cell.dataset['index']);
        cell.textContent = this.originalWord[index].toUpperCase();
      }
    });
  }

  /**
   * Determina el tipo de carácter para marcar espacios y guiones en palabras compuestas.
   *
   * @param character - Carácter a clasificar.
   * @returns 'space' si es un espacio, 'separator' si es un guion u otro separador, o 'letter' si es una letra normal.
   */
  private getCharType(character: string): 'space' | 'separator' | 'letter' {
    if (character === ' ') return 'space';
    if (/[^a-záéíóúàèìòùâêîôûäëïöüñç\p{L}]/u.test(character)) return 'separator';
    return 'letter';
  }
}
