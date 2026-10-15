/// <reference path="./global.d.ts" />
// @ts-check

/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 09 2026
 * @desc Elyse's destructured enchantmets
 *  The problem is to manipulate a deck of cards using destructuring assignment in JavaScript.
 *  The tasks include getting specific cards from the deck, swapping cards, rotating cards, and picking or swapping piles of cards.
 * @see {@link https://exercism.org/tracks/javascript/exercises/elyses-destructured-enchantments}
 */

/**
 * Get the first card in the given deck
 *
 * @param {Card[]} deck
 *
 * @returns {Card} the first card in the deck
 */
export const getFirstCard = (deck) => {
  const [firstCard] = deck;
  return firstCard;
}


/**
 * Get the second card in the given deck
 *
 * @param {Card[]} deck
 *
 * @returns {Card} the second card in the deck
 */
export const getSecondCard = (deck) => {
  const [, secondCard] = deck;
  return secondCard;
}

/**
 * Switch the position of the two cards
 *
 * @param {[Card, Card]} deck
 *
 * @returns {[Card, Card]} new deck with the 2 cards swapped
 */
export const swapTwoCards = (deck) => {
  const [firstCard, secondCard] = deck;
  return [secondCard, firstCard];
}

/**
 * Rotate (shift) the position of the three cards (by one place)
 *
 * @param {[Card, Card, Card]} deck
 *
 * @returns {[Card, Card, Card]} new deck with the 3 cards shifted by one position
 */
export const shiftThreeCardsAround = (deck) => {
  const [firstCard, secondCard, thirdCard] = deck;
  return [secondCard, thirdCard, firstCard];
}

/**
 * Grab the chosen pile from the available piles
 *
 * @param {{ chosen: Card[], disregarded: Card[] }} piles
 *
 * @returns {Card[]} the pile named chosen
 */
export const pickNamedPile = (piles) => {
  const { chosen } = piles;
  return chosen;
}

/**
 * Swap the chosen pile for the disregarded pile and the disregarded pile for the chosen pile
 *
 * @param {{ chosen: Card[], disregarded: Card[] }} piles
 * @returns {{ chosen: Card[], disregarded: Card[] }} new piles where the two piles are swapped
 */
export const swapNamedPile = (piles) => {
  const { chosen: disregarded, disregarded: chosen } = piles;
  return { chosen, disregarded };
}