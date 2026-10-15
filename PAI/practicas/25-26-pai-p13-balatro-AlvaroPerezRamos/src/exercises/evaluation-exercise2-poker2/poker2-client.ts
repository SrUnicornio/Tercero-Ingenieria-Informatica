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

import {Poker2Model} from './model/poker2-model';
import {Poker2View} from './view/poker2-view';
import {Poker2Controller} from './controller/poker2-controller';

/**
 * Función principal. Instancia las tres capas MVC y arranca la aplicación.
 */
const main = (): void => {
  const model = new Poker2Model();
  const view = new Poker2View();
  const controller = new Poker2Controller(model, view);
  controller.run();
};

main();
