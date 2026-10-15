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
 * @desc Lasagna Master exercise
 *   The problem is to determine the numeric value of a resistor based on its color bands.
 * @see {@link https://exercism.org/tracks/javascript/exercises/lasagna-master}
 */


/**
 * Determines the cooking status of the lasagna based on the remaining time.
 * @param {number} remainingTime 
 * @returns {string} The cooking status message.
 */
const cookingStatus = (remainingTime) => {
  if (remainingTime === undefined) {
    return 'You forgot to set the timer.';
  }
  if (remainingTime === 0) {
    return 'Lasagna is done.';
  }
  return 'Not done, please wait.';
};

/**
 * Calculates the preparation time for the lasagna based on the number of layers and time per layer.
 * @param {string[]} layers 
 * @param {number} timePerLayer 
 * @returns {number}
 */
const preparationTime = (layers, timePerLayer = 2) => {
  return layers.length * timePerLayer;
};

/**
 * Calculates the quantities of noodles and sauce needed for the lasagna based on the layers.
 * @param {string[]} layers 
 * @returns {{noodles: number, sauce: number}} An object containing the quantities of noodles and sauce.
 */
const quantities = (layers) => {
  const noodles = layers.filter(layer => layer === 'noodles').length * 50;
  const sauce = layers.filter(layer => layer === 'sauce').length * 0.2;
  return { noodles, sauce };
};

/**
 * Adds the secret ingredient from the friend's list to the user's list.
 * @param {string[]} friendsList 
 * @param {string[]} myList 
 * @returns {void}
 */
const addSecretIngredient = (friendsList, myList) => {
  const secretIngredient = friendsList[friendsList.length - 1];
  myList.push(secretIngredient);
};

/**
 * Scales the recipe based on the desired number of portions.
 * @param {{[ingredient: string]: number}} recipe
 * @param {number} portions
 * @return {{[ingredient: string]: number}} A new object representing the scaled recipe.
 */
const scaleRecipe = (recipe, portions) => {
  const scaledRecipe = /** @type {{[ingredient: string]: number}} */ ({});
  for (const ingredient in recipe) {
    const quantity = recipe[ingredient];
    const scaledQuantity = quantity * (portions / 2);
    scaledRecipe[ingredient] = scaledQuantity;
  }
  return scaledRecipe;
};

export { cookingStatus,
  preparationTime,
  quantities,
  addSecretIngredient,
  scaleRecipe
 };