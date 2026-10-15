/// <reference path="./global.d.ts" />
// @ts-check

/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc High Score Board exercise
 *   The problem is to manage a high score board for a game, allowing for adding players, updating scores, and applying bonuses.
 * @see {@link https://exercism.org/tracks/javascript/exercises/high-score-board}
 */

/**
 * Creates a new score board with an initial entry.
 *
 * @returns {Record<string, number>} new score board
 */
const createScoreBoard = () => {
  return { 'The Best Ever': 1000000 };
};

/**
 * Adds a player to a score board.
 *
 * @param {Record<string, number>} scoreBoard
 * @param {string} player
 * @param {number} score
 * @returns {Record<string, number>} updated score board
 */
const addPlayer = (scoreBoard, player, score) => {
  scoreBoard[player] = score;
  return scoreBoard;
};

/**
 * Removes a player from a score board.
 *
 * @param {Record<string, number>} scoreBoard
 * @param {string} player
 * @returns {Record<string, number>} updated score board
 */
const removePlayer = (scoreBoard, player) => {
  delete scoreBoard[player];
  return scoreBoard;
};

/**
 * Increases a player's score by the given amount.
 *
 * @param {Record<string, number>} scoreBoard
 * @param {string} player
 * @param {number} points
 * @returns {Record<string, number>} updated score board
 */
export function updateScore(scoreBoard, player, points) {
  if (scoreBoard[player] !== undefined) {
    scoreBoard[player] += points;
  }
  return scoreBoard;
}

/**
 * Applies 100 bonus points to all players on the board.
 *
 * @param {Record<string, number>} scoreBoard
 * @returns {Record<string, number>} updated score board
 */
export function applyMondayBonus(scoreBoard) {
  for (const player in scoreBoard) {
    scoreBoard[player] += 100;
  }
  return scoreBoard;
}

export { createScoreBoard, addPlayer, removePlayer };
