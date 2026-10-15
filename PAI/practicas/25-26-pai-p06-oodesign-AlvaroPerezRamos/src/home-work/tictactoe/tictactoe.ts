/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Tic Tac Toe game implementation in TypeScript, following object-oriented design principles.
 * The TicTacToe class manages the game state, including the game board, current player, and winner. It provides methods for making moves, checking for wins and draws, and retrieving the current state of the game.
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 */

// Define types for the game
type Player = 'X' | 'O';

// Each cell on the board can either be occupied by a Player or be empty (null).
type Cell = Player | null;

// The board is a 3x3 grid of cells.
type Board = Cell[][];

export class TicTacToe {
  private board: Board;
  private currentPlayer: Player = 'X';
  private winner: Player | null = null;

  constructor(private readonly size: number = 3) {
    this.board = this.createEmptyBoard();
  }

  /**
   * Creates an empty game board initialized with null values.
   * @returns A 2D array representing the game board, where each cell is initialized to null.
   */
  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  /**
   * Returns the winner of the game, if there is one. If the game is still ongoing or ended in a draw, it returns null.
   * @returns The player who won the game ('X' or 'O'), or null if there is no winner yet.
   */
  getWinner(): Player | null {
    return this.winner;
  }

  /**
   * Returns the current state of the game board.
   * @return A 2D array representing the game board, where each cell is either 'X', 'O', or null (empty).
   */
  getBoard(): Board {
    return this.board;
  }

  /**
   * Attempts to make a move for the current player at the specified row and column.
   * 
   * @param row - The row index for the move.
   * @param col - The column index for the move.
   * @return True if the move was successful, false if the move was invalid (e.g., cell already occupied or out of bounds).
   */
  makeMove(row: number, col: number): boolean {
    if (!this.isMoveAllowed(row, col)) return false;

    this.board[row][col] = this.currentPlayer;

    if (this.hasPlayerWon(this.currentPlayer)) {
      this.winner = this.currentPlayer;
    } else {
      this.switchPlayer();
    }

    return true;
  }

  /**
   * Checks if the game has ended in a draw. A draw occurs when there is no winner and the board is full (no empty cells).
   * @returns True if the game is a draw, false otherwise.
   */
  isDraw(): boolean {
    return this.winner === null && this.isBoardFull();
  }

  /**
   * Creates an empty game board initialized with null values.
   * @return A 2D array representing the game board, where each cell is initialized to null.
   */
  private createEmptyBoard(): Board {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  /**
   * Checks if the current player has won the game by checking all rows, columns, and diagonals for a winning condition.
   * @param row - The row index of the last move.
   * @param col - The column index of the last move.
   * @returns True if the current player has won, false otherwise.
   */
  private isMoveAllowed(row: number, col: number): boolean {
    return (
      this.winner === null &&
      row >= 0 &&
      row < this.size &&
      col >= 0 &&
      col < this.size &&
      this.board[row][col] === null
    );
  }

  /**
   * Checks if the specified player has won the game by checking all rows, columns, and diagonals for a winning condition.
   */
  private switchPlayer(): void {
    this.currentPlayer =
      this.currentPlayer === 'X' ? 'O' : 'X';
  }

  /**
   * Checks if the specified player has won the game by checking all rows, columns, and diagonals for a winning condition.
   * @param player - The player to check for a winning condition ('X' or 'O').
   * @returns True if the specified player has won, false otherwise.
   */
  private hasPlayerWon(player: Player): boolean {
    for (let i = 0; i < this.size; i++) {
      if (
        this.board[i].every(c => c === player) ||
        this.board.every(row => row[i] === player)
      ) {
        return true;
      }
    }

    if (
      this.board.every((row, i) => row[i] === player) ||
      this.board.every(
        (row, i) => row[this.size - 1 - i] === player,
      )
    ) {
      return true;
    }

    return false;
  }

  /**
   * Checks if the game board is full, which would indicate a draw if there is no winner.
   * @returns True if the board is full (no empty cells), false otherwise.
   */
  private isBoardFull(): boolean {
    return this.board.every(row =>
      row.every(cell => cell !== null),
    );
  }
}

class TicTacToeView {
  constructor(private readonly game: TicTacToe) { }

  /**
   * Renders the current state of the game board to the console in a human-readable format, showing the positions of 'X', 'O', and empty cells.
   */
  render(): void {
    const board = this.game.getBoard();

    const output = board
      .map(row =>
        row.map(cell => cell ?? ' ').join(' | ')
      )
      .join('\n---------\n');

    console.log(output);
  }
}

function main() {
  const game = new TicTacToe();
  const view = new TicTacToeView(game);

  view.render();

  game.makeMove(0, 0); // X
  view.render();

  game.makeMove(1, 1); // O
  view.render();

  game.makeMove(0, 1); // X
  view.render();

  game.makeMove(1, 0); // O
  view.render();

  game.makeMove(0, 2); // X wins
  view.render();

  console.log(`Winner: ${game.getWinner()}`);
}

if (require.main === module) {
  main();
}