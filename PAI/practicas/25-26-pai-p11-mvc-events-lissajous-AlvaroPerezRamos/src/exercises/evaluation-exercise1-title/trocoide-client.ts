/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trochoid-client.ts
 * @description
 *   Punto de entrada del bundle: instancia el modelo, la vista y el
 *   controlador, arrancando la aplicación cuando el DOM está listo.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { TrochoidModel } from './model/trochoid-model.js';
import { TrochoidView } from './view/trochoid-view.js';
import { TrochoidController } from './controller/trochoid-controller.js';

/**
 * @function main
 * @description
 *   Punto de arranque de la SPA. Instancia el modelo, la vista y el
 *   controlador siguiendo el patrón MVC.
 */
function main(): void {
  const model = new TrochoidModel();
  const view = new TrochoidView();
  const controller = new TrochoidController(model, view);
  controller.run();
}

main();