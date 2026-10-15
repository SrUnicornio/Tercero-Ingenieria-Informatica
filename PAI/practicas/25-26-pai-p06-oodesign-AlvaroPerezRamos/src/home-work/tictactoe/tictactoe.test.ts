import { describe, expect, test, beforeEach } from '@jest/globals';
import { TicTacToe } from './tictactoe';

describe('TicTacToe Game', () => {
  let game: TicTacToe;

  beforeEach(() => {
    game = new TicTacToe();
  });

  test('initial board is empty', () => {
    const board = game.getBoard();
    expect(board.flat().every(c => c === null)).toBe(true);
  });

  test('first player is X', () => {
    expect(game.getCurrentPlayer()).toBe('X');
  });

  test('valid move updates board', () => {
    game.makeMove(0, 0);
    expect(game.getBoard()[0][0]).toBe('X');
  });

  test('players alternate turns', () => {
    game.makeMove(0, 0);
    expect(game.getCurrentPlayer()).toBe('O');
  });

  test('cannot overwrite cell', () => {
    game.makeMove(0, 0);
    expect(game.makeMove(0, 0)).toBe(false);
  });

  test('detects row win', () => {
    game.makeMove(0, 0); // X
    game.makeMove(1, 0);
    game.makeMove(0, 1); // X
    game.makeMove(1, 1);
    game.makeMove(0, 2); // X wins

    expect(game.getWinner()).toBe('X');
  });

  test('detects draw', () => {
    const moves = [
      [0, 0], [0, 1], [0, 2],
      [1, 1], [1, 0], [1, 2],
      [2, 1], [2, 0], [2, 2],
    ];

    moves.forEach(([r, c]) => game.makeMove(r, c));

    expect(game.isDraw()).toBe(true);
  });

  test('board cannot be mutated externally', () => {
    const board = game.getBoard();
    board[0][0] = 'X';

    expect(game.getBoard()[0][0]).toBe(null);
  });
});