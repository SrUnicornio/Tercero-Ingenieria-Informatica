/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * 
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Poetry Club Door Policy exercise
 *   The problem is to determine the correct character to respond with at the front or back door based on the line of the poem.
 * @see {@link https://exercism.org/tracks/javascript/exercises/poetry-club-door-policy}
 */

/**
 * Retrieve card from cards array at the 0-based position
 *
 * @param {number[]} cards
 * @param {number} position
 *
 * @returns {number} the card
 */
const getItem = (cards, position) => cards[position];

/**
 * Exchange card with replacementCard at the 0-based position
 *
 * @param {number[]} cards
 * @param {number} position
 * @param {number} replacementCard
 *
 * @returns {number[]} the cards with the change applied
 */
const setItem = (cards, position, replacementCard) => {
  cards.splice(position, 1, replacementCard);
  return cards;
};

/**
 * Insert newCard at the end of the cards array
 *
 * @param {number[]} cards
 * @param {number} newCard
 *
 * @returns {number[]} the cards with the newCard applied
 */
const insertItemAtTop = (cards, newCard) => {
  cards.push(newCard);
  return cards;
};

/**
 * Remove the card at the 0-based position
 *
 * @param {number[]} cards
 * @param {number} position
 *
 * @returns {number[]} the cards without the removed card
 */
const removeItem = (cards, position) => {
  cards.splice(position, 1);
  return cards;
};

/**
 * Remove card from the end of the cards array
 *
 * @param {number[]} cards
 *
 * @returns {number[]} the cards without the removed card
 */
const removeItemFromTop = cards => {
  cards.pop();
  return cards;
};

/**
 * Insert newCard at beginning of the cards array
 *
 * @param {number[]} cards
 * @param {number} newCard
 *
 * @returns {number[]} the cards including the new card
 */
const insertItemAtBottom = (cards, newCard) => {
  cards.unshift(newCard);
  return cards;
};

/**
 * Remove card from the beginning of the cards
 *
 * @param {number[]} cards
 *
 * @returns {number[]} the cards without the removed card
 */
const removeItemAtBottom = cards => {
  cards.shift();
  return cards;
};

/**
 * Compare the number of cards with the given stackSize
 *
 * @param {number[]} cards
 * @param {number} stackSize
 *
 * @returns {boolean} true if there are exactly stackSize number of cards, false otherwise
 */
const checkSizeOfStack = (cards, stackSize) => cards.length === stackSize;

export{
  getItem,
  setItem,
  insertItemAtTop,
  removeItem,
  removeItemFromTop,
  insertItemAtBottom,
  removeItemAtBottom,
  checkSizeOfStack
};