/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file cliente.ts
 * @description Cliente de ComputePi. Punto de entrada de la aplicación. Instancia el modelo,
 *   el controlador y la vista.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {ComputePiModel} from './model/compute-pi-model.js';
import {ComputePiView} from './view/compute-pi-view.js';
import {ComputePiController} from './controller/compute-pi-controller.js';

/** Punto de entrada. */
function main(): void {
  const model = new ComputePiModel();
  const view = new ComputePiView();
  const controller = new ComputePiController(model, view);
  controller.run();
}

main();
