
import { describe, test, expect, beforeEach } from '@jest/globals';
import { ChessBoard } from './chess-board';

describe('ChessBoard', () => {
  let board: ChessBoard;

  beforeEach(() => {
    board = new ChessBoard(4);
  });

  test('board initializes empty', () => {
    expect(board.hasQueen(0, 0)).toBe(false);
  });

  test('place and remove queen', () => {
    board.placeQueen(1, 1);
    expect(board.hasQueen(1, 1)).toBe(true);

    board.removeQueen(1, 1);
    expect(board.hasQueen(1, 1)).toBe(false);
  });

  test('detect row conflict', () => {
    board.placeQueen(0, 0);
    expect(board.isSafe(0, 2)).toBe(false);
  });

  test('detect column conflict', () => {
    board.placeQueen(0, 1);
    expect(board.isSafe(2, 1)).toBe(false);
  });

  test('detect diagonal conflict', () => {
    board.placeQueen(0, 0);
    expect(board.isSafe(1, 1)).toBe(false);
  });
});