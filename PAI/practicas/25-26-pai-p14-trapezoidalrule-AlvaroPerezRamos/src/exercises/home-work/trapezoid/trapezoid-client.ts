/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-client.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Punto de entrada del bundle. Instancia las tres capas MVC y arranca
 *   la aplicación. El cliente NO interactúa con el modelo ni con la vista
 *   directamente: solo los instancia y se los pasa al controlador.
 */

import {TrapezoidModel} from './model/trapezoid-model';
import {TrapezoidView} from './view/trapezoid-view';
import {TrapezoidController} from './controller/trapezoid-controller';

/**
 * @function main
 * @description Crea las tres capas MVC y delega el control al controlador.
 *   Modelo y vista no se conocen entre sí: el controlador es el único
 *   punto de unión.
 */
function main(): void {
  const trapezoidModel = new TrapezoidModel();
  const trapezoidView = new TrapezoidView();
  const trapezoidController = new TrapezoidController(
      trapezoidModel, trapezoidView,
  );
  trapezoidController.run();
}

main();
