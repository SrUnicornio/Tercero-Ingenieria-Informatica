/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file shape-client.ts
 * @description Client code to demonstrate the usage of Shape classes
 * and rendering them on an HTML Canvas.
 *
 * @author
 * Alvaro Pérez Ramos
 * alu0101574042@ull.edu.es
 *
 * @since 10 Mar 2026
 */

import {CanvasManager, ShapeScene, RandomShapeGenerator} from '../src/home-work/shapes/shape-core.js';
import {ShapeFactory} from '../src/home-work/shapes/shape-factory.js';

/**
 * @classdesc This class manages an animated preview of random shapes on an HTML Canvas element.
 * It initializes the canvas, listens for window resize and visibility change events, and continuously generates and renders random shapes until the page is hidden.
 * The animation loop is controlled by a counter that clears the scene after a certain number of frames to keep the preview dynamic and visually interesting.
 */
class IndexPreview {
  private canvasManager: CanvasManager;
  private scene: ShapeScene;

  private running = true;
  private counter = 0;

  constructor() {
    const canvas = document.getElementById('previewCanvas') as HTMLCanvasElement;
    this.canvasManager = new CanvasManager(canvas);
    const context = this.canvasManager.getContext();
    this.scene = new ShapeScene(context);

    this.initialize();
  }

  /**
   * @description Initializes the canvas preview by setting up event
   * listeners for window resizing and visibility changes, and starts
   * the animation loop that generates and renders random shapes on the canvas.
   */
  private initialize(): void {
    this.canvasManager.resize();
    window.addEventListener('resize', () => {
      this.canvasManager.resize();
      this.scene.redraw();
    });
    document.addEventListener('visibilitychange', () => this.handleVisibility());

    this.loop();
  }

  /**
   * @description Generates random shape parameters using
   * the RandomShapeGenerator and creates a shape using the ShapeFactory.
   */
  private drawRandom(): void {
    const data =
      RandomShapeGenerator.generate(
          this.canvasManager.getWidth(),
          this.canvasManager.getHeight(),
      );

    const shape =ShapeFactory.createShape(data);
    if (shape) {
      this.scene.add(shape);
    }
  }

  /**
   * @description The main animation loop that continuously
   * generates and renders random shapes on the canvas.
   */
  private loop(): void {
    if (!this.running) return;
    if (Math.random() < 0.05) {
      this.drawRandom();
    }

    this.counter++;

    if (this.counter > 400) {
      this.scene.clear();
      this.counter = 0;
    }
    requestAnimationFrame(() => this.loop());
  }

  /**
   * @description Handles the visibility change of the document.
   * If the document is hidden, it stops the animation loop by
   * setting the running flag to false.
   * If the document becomes visible again, it resumes the animation
   * loop by setting the running flag to true and calling the loop method.
   */
  private handleVisibility(): void {
    if (document.hidden) {
      this.running = false;
    } else {
      this.running = true;
      this.loop();
    }
  }
}

window.addEventListener('DOMContentLoaded',
    () => new IndexPreview(),
);
