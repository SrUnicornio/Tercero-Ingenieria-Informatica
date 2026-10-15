/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trochoid-controller.ts
 * @description
 *   Controlador (capa C del patrón MVC) de la aplicación Trochoid.
 *
 *   Responsabilidades (SRP):
 *   - Conectar el modelo y la vista sin que se conozcan entre sí.
 *   - Arrancar y mantener el bucle de animación con `requestAnimationFrame`.
 *   - Propagar los eventos del usuario (botones) al modelo.
 *   - Solicitar un nuevo render a la vista en cada frame.
 *   - Gestionar el `ResizeObserver` para adaptar el canvas al viewport.
 *
 *   Esta clase NO conoce detalles de Canvas ni de cálculo matemático.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { TrochoidModel } from '../model/trochoid-model.js';
import { TrochoidView } from '../view/trochoid-view.js';

/**
 * @class TrochoidController
 * @classdesc
 *   Controlador MVC. Orquesta modelo y vista sin acoplamiento directo
 *   entre ellos.
 *
 *   DIP: recibe modelo y vista por inyección de dependencias.
 */
export class TrochoidController {
  /** Referencia al canvas necesaria para el ResizeObserver. */
  private readonly canvasElement: HTMLCanvasElement;

  /**
   * @constructor
   * @param model - Modelo de la Trochoid.
   * @param view  - Vista que gestiona el canvas.
   * @throws {Error} Si el elemento canvas no está en el DOM.
   */
  constructor(
    private readonly model: TrochoidModel,
    private readonly view: TrochoidView,
  ) {
    const canvas = document.getElementById('trochoidCanvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(
        'TrochoidController: no se encontró <canvas id="trochoidCanvas">.',
      );
    }
    this.canvasElement = canvas;
  }

  // ---------------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------------

  /**
   * @method run
   * @description
   *   Punto de entrada del controlador. Inicializa la aplicación,
   *   registra los observers y arranca el bucle de animación.
   */
  run(): void {
    this.initialize();
    this.registerResizeObserver();
    this.startAnimationLoop();
  }

  // ---------------------------------------------------------------------------
  // Privados — inicialización
  // ---------------------------------------------------------------------------

  /**
   * @method initialize
   * @description Sincroniza el canvas y realiza el primer render.
   */
  private initialize(): void {
    this.view.syncCanvasSize();
    this.view.render(this.model.getParams());
  }

  /**
   * @method registerResizeObserver
   * @description
   *   Registra un ResizeObserver sobre el canvas para sincronizar sus
   *   dimensiones lógicas cuando el viewport cambia de tamaño.
   */
  private registerResizeObserver(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.view.syncCanvasSize();
      this.view.render(this.model.getParams());
    });
    resizeObserver.observe(this.canvasElement);
  }

  // ---------------------------------------------------------------------------
  // Privados — bucle de animación
  // ---------------------------------------------------------------------------

  /**
   * @method startAnimationLoop
   * @description
   *   Arranca el bucle continuo de `requestAnimationFrame`.
   *   Cuando isAnimationActive es true, el modelo incrementa el ángulo.
   */
  private startAnimationLoop(): void {
    const frame = (): void => {
      this.model.advanceAnimation();
      this.view.render(this.model.getParams());
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}