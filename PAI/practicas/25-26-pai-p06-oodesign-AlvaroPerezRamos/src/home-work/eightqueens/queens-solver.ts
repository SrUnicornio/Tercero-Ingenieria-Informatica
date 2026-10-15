/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Implements a QueensSolver class that uses a recursive backtracking algorithm to solve the N-Queens problem, counting the number of valid configurations of queens on a chessboard. 
 * The solver interacts with a ChessBoard class to manage the state of the board and ensure that queens are placed in safe positions.
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 */


import { ChessBoard } from './chess-board';

export class QueensSolver {
  private solutions = 0;

  constructor(private readonly board: ChessBoard) { }

  /**
   * Initiates the recursive backtracking algorithm to find all valid configurations of queens on the chessboard. 
   * It resets the solutions count to zero before starting the recursive process and returns the total number of valid solutions found.
   * 
   * @returns The total number of valid configurations of queens on the chessboard, which is the number of solutions to the N-Queens problem for the given board size.
   */
  solve(): number {
    this.solutions = 0;
    this.placeRow(0);
    return this.solutions;
  }

  /**
   * Recursively attempts to place queens row by row, backtracking when necessary. When a valid configuration is found (when row equals the board size), it increments the solutions count.
   * @param row - The current row to attempt to place a queen in. Starts at 0 and increments with each recursive call until it reaches the board size, indicating a valid solution has been found.
   */
  private placeRow(row: number): void {
    const size = this.board.getSize();

    if (row === size) {
      this.solutions++;
      return;
    }

    for (let col = 0; col < size; col++) {
      if (this.board.isSafe(row, col)) {
        this.board.placeQueen(row, col);
        this.placeRow(row + 1);
        this.board.removeQueen(row, col);
      }
    }
  }
}