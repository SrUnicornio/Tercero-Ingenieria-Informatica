/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file word-dictionary.ts
 * @description Punto central del sistema de categorías.
 *   Registra todas las categorías disponibles y expone getRandomWordEntry,
 *   que es el único WordProvider que el cliente inyecta al modelo.
 *
 *   Para añadir una categoría nueva basta con:
 *     1. Crear su fichero en data/categories/ extendiendo WordCategory.
 *     2. Importar su instancia aquí y añadirla a la lista.
 *   No hay que tocar ningún otro archivo.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {countriesSource} from './categories/countries-source.js';
import {animalsSource} from './categories/animals-source.js';
import {foodDrinkSource} from './categories/food-drink-source.js';
import {brandsSource} from './categories/brands-source.js';
import {videogamesSource} from './categories/videogames-source.js';
import {type WordCategory, type WordEntry} from '../interfaces/game-state.js';

/**
 * Elige una categoría aleatoria del registro y devuelve una palabra
 * aleatoria de esa categoría junto con su etiqueta.
 *
 * Es el WordProvider que se inyecta en HangmanModel desde hangman-client.
 *
 * @returns WordEntry con la palabra y la categoría seleccionadas.
 */
export function getRandomWordEntry(): WordEntry {
  const wordCategories: readonly WordCategory[] = [
    animalsSource,
    countriesSource,
    foodDrinkSource,
    brandsSource,
    videogamesSource,
  ];

  const index = Math.floor(Math.random() * wordCategories.length);
  const category = wordCategories[index];
  return {
    word: category.getWord(),
    category: category.label,
  };
}
