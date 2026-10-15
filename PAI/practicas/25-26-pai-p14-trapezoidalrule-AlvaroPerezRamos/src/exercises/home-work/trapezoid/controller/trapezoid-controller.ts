/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-controller.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Controlador (capa C del patrón MVC).
 */

import {TrapezoidModel} from '../model/trapezoid-model';
import {TrapezoidView} from '../view/trapezoid-view';
import {
  CoordinateTransformer,
  CanvasLayout,
  CoordinateDomain,
} from '../util/coordinate-transformer';
import {
  DEFAULT_COORDINATE_CONFIG,
} from '../interfaces/coordinate-config';

/**
 * Controlador MVC. Conecta el evento de la vista con el modelo y
 * solicita renders. No valida datos, no manipula el DOM y no conoce
 * los IDs de los elementos HTML.
 */
export class TrapezoidController {
  /**
   * @param trapezoidModel - Fachada del modelo.
   * @param trapezoidView  - Fachada de la vista.
   */
  constructor(
    private readonly trapezoidModel: TrapezoidModel,
    private readonly trapezoidView: TrapezoidView,
  ) { }

  /**
   * Punto de entrada. Realiza el render inicial y registra los listeners de input y resize.
   */
  run(): void {
    this.initialize();
  }

  /** Inicialización completa de la aplicación. */
  private initialize(): void {
    this.syncAndRender();
    this.registerInputListener();
    this.registerResizeObserver();
  }

  /**
   * Sincroniza las dimensiones del canvas con el modelo y solicita
   * un render completo.
   */
  private syncAndRender(): void {
    this.trapezoidView.syncCanvasSize();
    const [width, height] = this.trapezoidView.getDimensions();
    this.trapezoidModel.updateCanvasDimensions(width, height);
    this.render();
  }

  /**
   * Lee del modelo todo lo que la vista necesita, construye el
   * CoordinateTransformer unificado y solicita los renders.
   * La vista no interroga al modelo en ningún momento.
   */
  private render(): void {
    const [width, height] = this.trapezoidView.getDimensions();
    const {start, end} = this.trapezoidModel.getParams();
    const {yMin, yMax} = this.trapezoidModel.computeYRange();
    const config = DEFAULT_COORDINATE_CONFIG;

    const layout: CanvasLayout = {
      canvasWidth: width,
      canvasHeight: height,
      marginLeft: config.marginLeft,
      marginBottom: config.marginBottom,
      marginTop: config.marginTop,
      marginRight: config.marginRight,
    };

    const domain: CoordinateDomain = {
      mathStart: start,
      mathEnd: end,
      mathYMin: yMin,
      mathYMax: yMax,
    };

    const transformer = new CoordinateTransformer(layout, domain);

    const {totalArea, divisionPoints} =
      this.trapezoidModel.computeArea();

    this.trapezoidView.renderCoordinateSystem(transformer, config);
    this.trapezoidView.renderTrapezoids(divisionPoints, transformer);
    this.trapezoidView.renderFunction(
        start,
        end,
        transformer,
        (x) => this.trapezoidModel.evaluateAt(x),
    );
    this.trapezoidView.renderResult(totalArea);
  }

  /**
   * Se suscribe al evento onUpdateRequested de la vista. Cuando
   * ControlsView valida los inputs y dispara el evento, el controlador
   * actualiza el modelo y solicita un render.
   */
  private registerInputListener(): void {
    this.trapezoidView.getInputRouter().onUpdateRequested.addListener(
        (params) => {
          this.trapezoidModel.setParams(params);
          this.render();
        },
    );
  }

  /**
   * Sincroniza el canvas cuando el viewport cambia.
   */
  private registerResizeObserver(): void {
    const canvasElement = this.trapezoidView.getCanvasElement();
    const resizeObserver = new ResizeObserver(() => {
      this.syncAndRender();
    });
    resizeObserver.observe(canvasElement);
  }
}
