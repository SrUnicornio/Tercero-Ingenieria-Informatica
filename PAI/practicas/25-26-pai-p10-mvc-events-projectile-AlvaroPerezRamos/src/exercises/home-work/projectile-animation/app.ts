/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file app.ts
 * @description
 *   Fachada de composición de la aplicación (patrón Facade + DI).
 *
 *   Instancia y conecta las tres capas del patrón MVC:
 *    - Model:      {@link ProjectileModel}
 *    - Views:      {@link ProjectileView}, {@link InfoView},
 *                  {@link ControlsView}
 *    - Controller: {@link ProjectileController}
 *
 *   Las dependencias del controlador se agrupan en un objeto
 *   {@link ControllerDependencies} para reducir el acoplamiento y
 *   evitar constructores con múltiples parámetros posicionales (DIP).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { ProjectileModel } from './model/projectile-model.js';
import { ProjectileView } from './view/projectile-view.js';
import { InfoView } from './view/info-view.js';
import { ControlsView } from './view/controls-view.js';
import {
  ProjectileController,
  ControllerDependencies,
} from './controller/projectile-controller.js';
import { CyclicColorStrategy } from './strategy/trajectory-color-strategy.js';

/**
 * @class App
 * @classdesc
 *   Punto de composición de la aplicación. Instancia todos los objetos
 *   MVC y los conecta a través del controlador.
 *
 *   Es el único lugar donde se conocen todos los IDs del DOM;
 *   el resto de clases solo conocen los objetos que necesitan.
 */
export class App {
  /** Controlador principal de la aplicación. */
  private readonly controller: ProjectileController;

  /**
   * @throws {Error} Si algún elemento del DOM requerido no existe.
   */
  constructor() {
    const canvasP1 = this.requireCanvasById('canvasP1');
    const canvasP2 = this.requireCanvasById('canvasP2');

    // Sincronizar el tamaño lógico del canvas P1 al tamaño CSS
    canvasP1.width = canvasP1.clientWidth;
    canvasP1.height = canvasP1.clientHeight;

    // Sincronizar el tamaño lógico del canvas P2 al tamaño CSS
    canvasP2.width = canvasP2.clientWidth;
    canvasP2.height = canvasP2.clientHeight;

    const deps: ControllerDependencies = {
      model: new ProjectileModel(),
      projectileView: new ProjectileView(canvasP1),
      infoView: new InfoView(canvasP2),
      controlsView: new ControlsView(
        'speedInput',
        'angleInput',
        'heightInput',
        'accumulateCheckbox',
        'showTrajectoryCheckbox',
        'launchButton',
        'clearButton',
      ),
      colorStrategy: new CyclicColorStrategy(),
      canvasP1,
    };

    this.controller = new ProjectileController(deps);
  }

  /**
   * @method initialize
   * @description
   *   Delega la inicialización al controlador (dibuja el estado inicial).
   */
  initialize(): void {
    this.controller.initialize();
  }

  // -------------------------------------------------------------------------
  // Privados
  // -------------------------------------------------------------------------

  /**
   * Obtiene un HTMLCanvasElement por ID o lanza un error.
   * @param elementId - ID del elemento canvas.
   * @returns El elemento canvas.
   * @throws {Error} Si el elemento no existe o no es un canvas.
   */
  private requireCanvasById(elementId: string): HTMLCanvasElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(
        `App: no se encontró <canvas id="${elementId}">.`,
      );
    }
    return element;
  }
}