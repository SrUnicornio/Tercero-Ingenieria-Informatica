/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file lissajous-client.ts
 * @description
 *   Punto de entrada del bundle: instancia el modelo, la vista y el
 *   controlador, arrancando la aplicación cuando el DOM está listo.
 *
 *   La curva comenzará a dibujarse automáticamente sin ninguna
 *   intervención del usuario, tal como especifica el enunciado.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { LissajousModel } from './model/lissajous-model.js';
import { LissajousView } from './view/lissajous-view.js';
import { LissajousController } from './controller/lissajous-controller.js';

/**
 * @function main
 * @description
 *   Punto de arranque de la SPA. Instancia el modelo, la vista y el
 *   controlador siguiendo el patrón MVC. El controlador toma el control
 *   desde ese momento: registra listeners, sincroniza el canvas y arranca
 *   el bucle de animación.
 */
function main(): void {
  const lissajousModel = new LissajousModel();
  const lissajousView = new LissajousView();
  const lissajousController = new LissajousController(lissajousModel, lissajousView);
  lissajousController.run();
}

main();