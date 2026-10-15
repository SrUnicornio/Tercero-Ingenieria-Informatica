/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file app2.ts
 * @description
 *   Punto de composición para el layout alternativo (alvaro-perez-ramos-proyectile2.html).
 *   Idéntico a {@link App} pero usa los IDs del segundo HTML.
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
 * @class App2
 * @classdesc Composición MVC para el layout 2.
 */
export class App2 {
  private readonly controller: ProjectileController;
  private readonly canvasP1: HTMLCanvasElement;
  private readonly canvasP2: HTMLCanvasElement;

  constructor() {
    this.canvasP1 = this.requireCanvasById('canvasP1');
    this.canvasP2 = this.requireCanvasById('canvasP2');

    const deps: ControllerDependencies = {
      model: new ProjectileModel(),
      projectileView: new ProjectileView(this.canvasP1),
      infoView: new InfoView(this.canvasP2),
      controlsView: new ControlsView(
        'speedInput2',
        'angleInput2',
        'heightInput2',
        'accumulateCheckbox2',
        'showTrajectoryCheckbox2',
        'launchButton2',
        'clearButton2',
      ),
      colorStrategy: new CyclicColorStrategy(),
      canvasP1: this.canvasP1,
    };

    this.controller = new ProjectileController(deps);
  }

  initialize(): void {
    this.canvasP1.width = this.canvasP1.clientWidth;
    this.canvasP1.height = this.canvasP1.clientHeight;
    this.canvasP2.width = this.canvasP2.clientWidth;
    this.canvasP2.height = this.canvasP2.clientHeight;
    
    this.controller.initialize();
  }

  private requireCanvasById(elementId: string): HTMLCanvasElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`App2: no se encontró <canvas id="${elementId}">.`);
    }
    return element;
  }
}