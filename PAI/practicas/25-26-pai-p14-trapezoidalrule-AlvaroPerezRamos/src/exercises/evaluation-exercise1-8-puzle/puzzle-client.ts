/**
 * Universidad de La Laguna — PAI P14
 * @file puzzle-client.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since May 2026
 * @description Punto de entrada de la SPA 8-Puzzle.
 *              Instancia Modelo, Vista y Controlador y arranca.
 */

import {PuzzleModel} from './model/puzzle-model.js';
import {PuzzleView} from './view/puzzle-view.js';
import {PuzzleController} from './controller/puzzle-controller.js';

function main(): void {
  const model = new PuzzleModel();
  const view = new PuzzleView();
  const controller = new PuzzleController(model, view);
  controller.run();
}

main();
