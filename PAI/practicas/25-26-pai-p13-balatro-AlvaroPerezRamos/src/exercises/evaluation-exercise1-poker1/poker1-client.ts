/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-client.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Punto de entrada de la aplicación Póker-1.
 *   Instancia el modelo, la vista y el controlador, y arranca la partida.
 */

import {Poker1Model} from './model/poker1-model';
import {Poker1View} from './view/poker1-view';
import {Poker1Controller} from './controller/poker1-controller';

/**
 * Función principal. Instancia las tres capas MVC y arranca la aplicación.
 */
const main = (): void => {
  const model = new Poker1Model();
  const view = new Poker1View();
  const controller = new Poker1Controller(model, view);
  controller.run();
};

main();
