/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Implements a ChessBoard class that represents the state of an N x N chessboard for the N-Queens problem. 
 * The class provides methods to place and remove queens, check if a position is safe for placing a queen, and retrieve the current state of the board. 
 * It serves as a crucial component for the QueensSolver class, which uses it to manage the board state while searching for valid configurations of queens.
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 */

/**
 * The ChessBoard class represents an N x N chessboard for the N-Queens problem. It provides methods to manage the placement of queens and check for conflicts.
 */
export class ChessBoard {
  private readonly board: boolean[][];

  /**
   * Constructs a new ChessBoard of the specified size, initializing an empty board with no queens placed. 
   * The board is represented as a 2D array of booleans, where true indicates the presence of a queen and false indicates an empty cell.
   * 
   * @param size 
   */
  constructor(private readonly size: number) {
    if (size <= 0) {
      throw new Error('Board size must be positive');
    }

    this.board = Array.from(
      { length: size },
      () => Array(size).fill(false),
    );
  }

  /**
   * Gets the size of the chessboard, which is the number of rows and columns (N) in the N x N board.
   * @returns The size of the chessboard (N), which indicates that the board is N x N in dimensions.
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Checks if there is a queen at the specified row and column.
   * 
   * @param row - The row index to check for the presence of a queen. It should be a valid index within the bounds of the board (0 to size-1).
   * @param col - The column index to check for the presence of a queen. It should also be a valid index within the bounds of the board (0 to size-1).
   * @returns A boolean value indicating whether there is a queen at the specified position (true if there is a queen, false otherwise).
   */
  hasQueen(row: number, col: number): boolean {
    return this.board[row][col];
  }

  /**
   * Places a queen at the specified row and column by setting the corresponding cell in the board to true.
   * @param row - The row index where the queen should be placed. It should be a valid index within the bounds of the board (0 to size-1).
   * @param col - The column index where the queen should be placed. It should also be a valid index within the bounds of the board (0 to size-1).
   */
  placeQueen(row: number, col: number): void {
    this.board[row][col] = true;
  }

  /**
   * Removes a queen from the specified row and column by setting the corresponding cell in the board to false.
   * @param row - The row index from which the queen should be removed. It should be a valid index within the bounds of the board (0 to size-1).
   * @param col - The column index from which the queen should be removed. It should also be a valid index within the bounds of the board (0 to size-1).
   */
  removeQueen(row: number, col: number): void {
    this.board[row][col] = false;
  }

  /**
   * Checks if placing a queen at the specified row and column is safe, meaning that it does not result in any conflicts with existing queens on the board.
   * 
   * @param row - The row index where the queen is being considered for placement. It should be a valid index within the bounds of the board (0 to size-1).
   * @param col - The column index where the queen is being considered for placement. It should also be a valid index within the bounds of the board (0 to size-1).
   * @return A boolean value indicating whether it is safe to place a queen at the specified position (true if it is safe, false otherwise).
   */
  isSafe(row: number, col: number): boolean {
    return (
      !this.checkRow(row) &&
      !this.checkColumn(col) &&
      !this.checkDiagonals(row, col)
    );
  }

  /**
   * Checks if there is a queen in the specified row by iterating through the cells in that row and checking for the presence of a queen (true value).
   * 
   * @param row - The row index to check for the presence of a queen. It should be a valid index within the bounds of the board (0 to size-1).
   * @returns A boolean value indicating whether there is a queen in the specified row (true if there is a queen, false otherwise).
   */
  private checkRow(row: number): boolean {
    return this.board[row].some(cell => cell);
  }

  /**
   * Checks if there is a queen in the specified column by iterating through the cells in that column across all rows and checking for the presence of a queen (true value).
   * 
   * @param col - The column index to check for the presence of a queen. It should be a valid index within the bounds of the board (0 to size-1).
   * @returns A boolean value indicating whether there is a queen in the specified column (true if there is a queen, false otherwise).
   */
  private checkColumn(col: number): boolean {
    return this.board.some(row => row[col]);
  }

  /**
  * Checks for the presence of queens on the diagonals that intersect at the specified row and column. 
  * It iterates through all cells on the board and checks if there is a queen (true value) on any diagonal that would conflict with placing a queen at the specified position.
  * 
  * @param row - The row index where the queen is being considered for placement. It should be a valid index within the bounds of the board (0 to size-1).
  * @param col - The column index where the queen is being considered for placement. It should also be a valid index within the bounds of the board (0 to size-1).
  * @returns A boolean value indicating whether there is a queen on any diagonal that would conflict with placing a queen at the specified position (true if there is a conflict, false otherwise).
  */
  private checkDiagonals(row: number, col: number): boolean {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (
          this.board[r][c] &&
          Math.abs(r - row) === Math.abs(c - col)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Returns a snapshot of the current state of the chessboard as a 2D array of booleans, where true indicates the presence of a queen and false indicates an empty cell.
   */
  snapshot(): boolean[][] {
    return this.board.map(row => [...row]);
  }
}