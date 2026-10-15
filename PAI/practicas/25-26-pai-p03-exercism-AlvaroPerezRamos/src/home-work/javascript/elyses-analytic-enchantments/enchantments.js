/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Elyse's Analytic Enchantments exercise
 *   The problem is to analyze a stack of cards and determine various properties such as the position of a card, 
 *   whether certain cards are included, and the positions of even or odd cards.
 * @see {@link https://exercism.org/tracks/javascript/exercises/elyses-analytic-enchantments}
 */

/**
 * Get the position (index) of the card in the given stack
 *
 * @param {number[]} stack
 * @param {number} card
 *
 * @returns {number} position of the card in the stack
 */
const getCardPosition = (stack, card) => {
  return stack.indexOf(card);
};

/**
 * Determine if the stack contains the card
 *
 * @param {number[]} stack
 * @param {number} card
 *
 * @returns {boolean} true if card is in the stack, false otherwise
 */
const doesStackIncludeCard = (stack, card) => {
  return stack.includes(card);
};

/**
 * Determine if each card is even
 *
 * @param {number[]} stack
 *
 * @returns {boolean} true if all cards are even, false otherwise
 */
const isEachCardEven = (stack) => {
  return stack.every(card => card % 2 === 0);
};

/**
 * Check if stack contains odd-value card
 *
 * @param {number[]} stack
 *
 * @returns {boolean} true if the array contains odd card, false otherwise
 */
const doesStackIncludeOddCard = (stack) => {
  return stack.some(card => card % 2 !== 0);
};

/**
 * Get the first odd card from the stack
 *
 * @param {number[]} stack
 *
 * @returns {number | undefined} the first odd value
 */
const getFirstOddCard = (stack) => {
  return stack.find(card => card % 2 !== 0);
};

/**
 * Determine the position of the first card that is even
 *
 * @param {number[]} stack
 *
 * @returns {number} position of the first card that is even
 */
const getFirstEvenCardPosition = (stack) => {
  return stack.findIndex(card => card % 2 === 0);
};

export { getCardPosition,
  doesStackIncludeCard,
  isEachCardEven,
  doesStackIncludeOddCard,
  getFirstOddCard,
  getFirstEvenCardPosition 
};
