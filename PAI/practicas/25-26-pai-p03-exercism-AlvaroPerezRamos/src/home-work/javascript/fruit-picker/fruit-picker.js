/// <reference path="./global.d.ts" />
//
// @ts-check
//
// The lines above enable type checking for this file. Various IDEs interpret
// the @ts-check and reference directives. Together, they give you helpful
// autocompletion when implementing this exercise. You don't need to understand
// them in order to use it.
//
// In your own projects, files, and code, you can play with @ts-check as well.

/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 09 2026
 * @desc Fruit Picker - JavaScript
 *  The problem is to implement a fruit picker that can order fruits from a grocer and notify the user of the success or failure of the order.
 * @see {@link https://exercism.org/tracks/javascript/exercises/fruit-picker} 
 */

import { notify } from './notifier';
import { order } from './grocer';

/**
 * @return void
 */
export function onSuccess() {
  return notify({ message: 'SUCCESS' });
}

/**
 * @return void
 */
export function onError() {
  return notify({ message: 'ERROR' });
}

/**
 * @param {GrocerQuery} query
 * @param {FruitPickerSuccessCallback} onSuccessCallback
 * @param {FruitPickerErrorCallback} onErrorCallback
 * @return void
 */
export function orderFromGrocer(query, onSuccessCallback, onErrorCallback) {
  return order(query, onSuccessCallback, onErrorCallback);
}

/**
 * @param {string} variety
 * @param {number} quantity
 * @return void
 */
export function postOrder(variety, quantity) {
  const query = { variety, quantity };
  return orderFromGrocer(query, onSuccess, onError);
}
