/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file balatro-client.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Punto de entrada de la aplicación Balatro. Crea el modelo, la vista y el controlador,
 */

import {BalatroModel} from './model/game/balatro-model';
import {BalatroView} from './view/balatro-view';
import {BalatroController} from './controller/balatro-controller';

/**
 * Función principal que arranca la aplicación Balatro.
 */
export const main = (): void => {
  const model = new BalatroModel();
  const view = new BalatroView();
  const controller = new BalatroController(model, view);
  controller.run();
};

main();
