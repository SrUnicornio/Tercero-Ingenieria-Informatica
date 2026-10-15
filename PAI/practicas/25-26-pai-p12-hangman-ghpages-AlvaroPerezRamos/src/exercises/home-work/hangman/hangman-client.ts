/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-client.ts
 * @description Punto de entrada del programa.
 *   Instancia el trío MVC e inyecta el WordProvider en el modelo.
 *   El modelo no sabe qué categorías existen; solo recibe la función.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {getRandomWordEntry} from './data/word-dictionary.js';
import {HangmanModel} from './model/hangman-model.js';
import {HangmanView} from './view/hangman-view.js';
import {HangmanController} from './controller/hangman-controller.js';

/** Instancia el modelo, la vista y el controlador, y arranca la aplicación. */
function main(): void {
  const model = new HangmanModel(getRandomWordEntry);
  const view = new HangmanView();
  const controller = new HangmanController(model, view);
  controller.run();
}

main();
