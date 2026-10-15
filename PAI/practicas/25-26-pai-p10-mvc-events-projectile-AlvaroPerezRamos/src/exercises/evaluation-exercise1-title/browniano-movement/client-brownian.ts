/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file client-brownian.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import { BrownianModel } from "./model/brownian-model.js";
import { BrownianView } from "./view/brownian-view.js";
import { BrownianController } from "./controller/brownian-controller.js";

function main(): void {
  const view = new BrownianView();
  const model = new BrownianModel();
  new BrownianController(model, view);
} 

main();