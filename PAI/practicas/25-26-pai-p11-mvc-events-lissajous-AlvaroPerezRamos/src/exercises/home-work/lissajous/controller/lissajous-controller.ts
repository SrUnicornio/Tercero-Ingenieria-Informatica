/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file lissajous-controller.ts
 * @description
 *   Controlador (capa C del patrón MVC) de la aplicación de curvas de Lissajous.
 *
 *   Responsabilidades (SRP):
 *   - Conectar el modelo y la vista sin que se conozcan entre sí.
 *   - Arrancar y mantener el bucle de animación con `requestAnimationFrame`.
 *   - Propagar los cambios del usuario (panel de controles) al modelo.
 *   - Solicitar un nuevo render a la vista en cada frame.
 *   - Gestionar el `ResizeObserver` para adaptar el canvas al viewport.
 *
 *   Esta clase NO conoce detalles de física, de Canvas ni de HTML.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { LissajousModel, LissajousParams } from '../model/lissajous-model.js';
import { LissajousView } from '../view/lissajous-view.js';

/**
 * @class LissajousController
 * @classdesc
 *   Controlador MVC. Orquesta modelo y vista sin conocer sus implementaciones
 *   internas.
 *
 *   El bucle de animación usa `requestAnimationFrame` de forma continua.
 *   Cuando `isPhaseAnimated` es `false`, se sigue re-renderizando (el
 *   usuario puede cambiar parámetros manualmente) pero el modelo no avanza
 *   el desfase.
 *
 * @example
 * ```typescript
 * const model = new LissajousModel();
 * const view  = new LissajousView();
 * new LissajousController(model, view);
 * ```
 */
export class LissajousController {
  /** Referencia al canvas necesaria para el ResizeObserver. */
  private readonly canvasElement: HTMLCanvasElement;

  /**
   * @constructor
   * @param lissajousModel - Modelo de la curva de Lissajous.
   * @param lissajousView  - Vista que gestiona el canvas y los controles.
   * @throws {Error} Si el elemento canvas no está en el DOM.
   */
  constructor(
    private readonly lissajousModel: LissajousModel,
    private readonly lissajousView: LissajousView,
  ) {
    const canvas = document.getElementById('lissajousCanvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(
        'LissajousController: no se encontró <canvas id="lissajousCanvas">.',
      );
    }
    this.canvasElement = canvas;
  }

  /**
   * @method run
   * @description Arranca la aplicación. Este método es el punto de entrada
   *   del controlador, y se encarga de inicializar la aplicación.
   *
   *   Se ha separado de `constructor` para permitir una inicialización
   *   más flexible (por ejemplo, arrancar el bucle de animación solo
   *   después de configurar todo lo necesario).
   */
  run(): void {
    this.initialize();
  }

  // ---------------------------------------------------------------------------
  // Privados — inicialización
  // ---------------------------------------------------------------------------

  /**
   * @method initialize
   * @description Inicializa la aplicación en orden
   */
  private initialize(): void {
    this.lissajousView.syncCanvasSize();
    this.lissajousView.updateControlsFromParams(this.lissajousModel.getParams());
    this.registerControlListeners();
    this.registerResizeObserver();
    this.startAnimationLoop();
  }

  /**
   * @method registerControlListeners
   * @description
   *   Conecta el callback de cambio de parámetros de la vista con el modelo.
   *   El callback recibe los cambios parciales y los envía directamente al
   *   modelo; no hay lógica de negocio en el controlador.
   */
  private registerControlListeners(): void {
    this.lissajousView.onParamChange((updates: Partial<LissajousParams>) => {
      this.lissajousModel.setParams(updates);
    });
  }

  /**
   * @method registerResizeObserver
   * @description
   *   Registra un ResizeObserver sobre el canvas para sincronizar sus
   *   dimensiones lógicas cuando el viewport cambia de tamaño.
   *   Esto garantiza que el canvas cuadrado se recalcule correctamente.
   */
  private registerResizeObserver(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.lissajousView.syncCanvasSize();
    });
    resizeObserver.observe(this.canvasElement);
  }

  // ---------------------------------------------------------------------------
  // Privados — bucle de animación
  // ---------------------------------------------------------------------------

  /**
   * @method startAnimationLoop
   * @description Arranca el bucle continuo de `requestAnimationFrame`.
   */
  private startAnimationLoop(): void {
    const animationFrame = (): void => {
      this.lissajousModel.advancePhaseAnimation();
      const curvePoints = this.lissajousModel.computeCurvePoints();
      const currentParams = this.lissajousModel.getParams();
      this.lissajousView.render(curvePoints, currentParams);
      this.lissajousView.updateControlsFromParams(currentParams);
      requestAnimationFrame(animationFrame);
    };
    requestAnimationFrame(animationFrame);
  }
}