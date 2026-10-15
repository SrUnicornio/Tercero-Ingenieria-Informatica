/**
 * Universidad de La Laguna — PAI P14
 * @file puzzle-model.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since May 2026
 * @description Modelo del juego 8-Puzzle. Mantiene el estado del
 *              tablero y emite eventos al Controller cuando cambia.
 */

import {PuzzleEvent} from '../observer/puzzle-event-publisher.js';

export const BLANK_TILE = 0;
const GRID_COLUMNS = 3;
const SOLVED_BOARD: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, BLANK_TILE];

/**
 * Payload de los eventos emitidos por PuzzleModel. Contiene el estado
 * actual del tablero y el flag showNumbers para que la vista pueda renderizar
 */
export interface BoardChangedData {
  readonly board: readonly number[];
  readonly showNumbers: boolean;
}

/**
 * Payload de los eventos emitidos al cambiar el flag showNumbers. Contiene
 * el estado actual del tablero y el nuevo valor de showNumbers.
 */
export interface ShowNumbersChangedData {
  readonly board: readonly number[];
  readonly showNumbers: boolean;
}

/**
 * Interfaz que define los canales de eventos públicos del PuzzleModel. Permite
 * al Controller suscribirse a los eventos sin exponer métodos de trigger o el
 * estado interno del modelo.
 */
export interface PuzzleEventChannels {
  readonly onBoardChanged: PuzzleEvent<BoardChangedData>;
  readonly onShowNumbersChanged: PuzzleEvent<ShowNumbersChangedData>;
}

/**
 * Estado central del juego. Contiene el tablero y el flag
 * showNumbers. Emite eventos cuando el estado cambia.
 */
export class PuzzleModel {
  private board: number[] = [...SOLVED_BOARD];
  private showNumbers: boolean = false;

  readonly onBoardChanged = new PuzzleEvent<BoardChangedData>();
  readonly onShowNumbersChanged =
    new PuzzleEvent<ShowNumbersChangedData>();

  /** @returns Objeto con los eventos públicos para suscripción. */
  getChannels(): PuzzleEventChannels {
    return {
      onBoardChanged: this.onBoardChanged,
      onShowNumbersChanged: this.onShowNumbersChanged,
    };
  }

  /** @returns Copia inmutable del tablero actual. */
  getBoard(): readonly number[] {
    return [...this.board];
  }

  /** @returns Estado actual del flag showNumbers. */
  getShowNumbers(): boolean {
    return this.showNumbers;
  }

  /**
   * Mueve la pieza en clickedIndex a la casilla vacía si son
   * adyacentes horizontal o verticalmente.
   * @param clickedIndex - Índice (0–8) de la celda pulsada.
   * @returns true si el movimiento fue válido.
   */
  moveTile(clickedIndex: number): boolean {
    const blankIndex = this.board.indexOf(BLANK_TILE);
    if (!this.areAdjacent(clickedIndex, blankIndex)) return false;

    [this.board[clickedIndex], this.board[blankIndex]] =
      [this.board[blankIndex], this.board[clickedIndex]];

    this.onBoardChanged.trigger({
      board: this.getBoard(),
      showNumbers: this.showNumbers,
    });
    return true;
  }

  /**
   * Baraja el tablero garantizando resolubilidad y notifica.
   */
  shuffle(): void {
    do {
      this.fisherYatesShuffle();
    } while (!this.isSolvable());
    this.onBoardChanged.trigger({
      board: this.getBoard(),
      showNumbers: this.showNumbers,
    });
  }

  /**
   * Restaura el tablero al estado resuelto y notifica.
   */
  solve(): void {
    this.board = [...SOLVED_BOARD];
    this.onBoardChanged.trigger({
      board: this.getBoard(),
      showNumbers: this.showNumbers,
    });
  }

  /**
   * Actualiza el flag showNumbers y notifica.
   * @param value - Nuevo estado del flag.
   */
  setShowNumbers(value: boolean): void {
    this.showNumbers = value;
    this.onShowNumbersChanged.trigger({
      board: this.getBoard(),
      showNumbers: value,
    });
  }

  /**
   * Comprueba si dos índices son adyacentes horizontal o
   * verticalmente en el grid 3×3.
   * @param indexA - Primer índice.
   * @param indexB - Segundo índice.
   */
  private areAdjacent(indexA: number, indexB: number): boolean {
    const rowA = Math.floor(indexA / GRID_COLUMNS);
    const rowB = Math.floor(indexB / GRID_COLUMNS);
    const diff = Math.abs(indexA - indexB);

    const sameRow = rowA === rowB && diff === 1;
    const sameColumn = diff === GRID_COLUMNS;
    return sameRow || sameColumn;
  }

  /**
   * Baraja el tablero usando el algoritmo de Fisher-Yates. No
   */
  private fisherYatesShuffle(): void {
    for (let index = this.board.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [this.board[index], this.board[randomIndex]] =
        [this.board[randomIndex], this.board[index]];
    }
  }

  /**
   * Cuenta el número de inversiones en el tablero (pares de piezas
   * @returns true si el tablero actual es resoluble, false si no lo es.
   */
  private isSolvable(): boolean {
    const tiles = this.board.filter((tile) => tile !== BLANK_TILE);
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] > tiles[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  }
}
