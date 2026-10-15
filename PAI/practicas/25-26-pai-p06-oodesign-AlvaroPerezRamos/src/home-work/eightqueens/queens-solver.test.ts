
import { describe, expect, test } from '@jest/globals';
import { ChessBoard } from './chess-board';
import { QueensSolver } from './queens-solver';

describe('QueensSolver', () => {
  const knownSolutions: Record<number, number> = {
    1: 1,
    2: 0,
    3: 0,
    4: 2,
    5: 10,
    6: 4,
  };

  for (const n of Object.keys(knownSolutions)) {
    test(`N=${n} has correct number of solutions`, () => {
      const board = new ChessBoard(Number(n));
      const solver = new QueensSolver(board);

      expect(solver.solve()).toBe(knownSolutions[Number(n)]);
    });
  }
});