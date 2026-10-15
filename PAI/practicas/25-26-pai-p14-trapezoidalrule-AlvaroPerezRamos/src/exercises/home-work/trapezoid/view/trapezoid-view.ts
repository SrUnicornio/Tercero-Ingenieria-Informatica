/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Fachada de la capa Vista del patrón MVC.
 */

import {CanvasView} from './canvas-view';
import {ControlsView} from './controls-view';
import {ResultView} from './result-view';
import {CoordinateSystem} from './coordinate-system';
import {FunctionRenderer} from './function-renderer';
import {TrapezoidRenderer} from './trapezoid-renderer';
import {CoordinateTransformer} from '../util/coordinate-transformer';
import {CoordinateConfig} from '../interfaces/coordinate-config';
import {TrapezoidPoint} from '../model/trapezoid-calculator';
import {EvaluateAt} from '../observer/event';

/**
 * Fachada de la vista. Delega cada responsabilidad en su subelemento
 * correspondiente y expone al controlador solo lo que este necesita.
 */
export class TrapezoidView {
  private readonly canvasView: CanvasView;
  private readonly controlsView: ControlsView;
  private readonly resultView: ResultView;
  private coordinateSystem: CoordinateSystem | null = null;

  /**
   * @param canvasId - ID del elemento <canvas> en el HTML.
   * @throws {Error} Si algún elemento del DOM requerido no existe.
   */
  constructor(canvasId: string = 'trap-canvas') {
    this.canvasView = new CanvasView(canvasId);
    this.controlsView = new ControlsView();
    this.resultView = new ResultView();
  }

  /**
   * @returns ControlsView para que el controlador suscriba onUpdateRequested.
   */
  getInputRouter(): ControlsView {
    return this.controlsView;
  }

  /**
   * @returns true si las dimensiones cambiaron.
   */
  syncCanvasSize(): boolean {
    return this.canvasView.syncSize();
  }

  /**
   * @returns Tupla [width, height] en píxeles.
   */
  getDimensions(): [number, number] {
    return this.canvasView.getDimensions();
  }

  /**
   * @returns El HTMLCanvasElement para registrar el ResizeObserver.
   */
  getCanvasElement(): HTMLCanvasElement {
    return this.canvasView.getCanvasElement();
  }

  /**
   * Borra el canvas y dibuja la cuadrícula y los ejes usando el
   * transformer actualizado. Crea el CoordinateSystem en la primera
   * llamada y lo actualiza en las siguientes.
   * @param transformer - Conversor coordenadas matemáticas → píxeles.
   * @param config - Configuración visual del sistema de coordenadas.
   */
  renderCoordinateSystem(
      transformer: CoordinateTransformer,
      config: CoordinateConfig,
  ): void {
    const context = this.canvasView.getContext();
    if (this.coordinateSystem === null) {
      this.coordinateSystem =
        new CoordinateSystem(context, transformer, config);
    } else {
      this.coordinateSystem.update(transformer);
    }
    this.coordinateSystem.draw();
  }

  /**
   * Dibuja la curva f(x) sobre el sistema de coordenadas.
   * @param start - Extremo izquierdo del dominio.
   * @param end - Extremo derecho del dominio.
   * @param transformer - Transformer activo para convertir coordenadas.
   * @param evaluateAt - Callback que evalúa f(x).
   */
  renderFunction(
      start: number,
      end: number,
      transformer: CoordinateTransformer,
      evaluateAt: EvaluateAt,
  ): void {
    const functionRenderer =
      new FunctionRenderer(this.canvasView.getContext());
    functionRenderer.draw(
        start,
        end,
        evaluateAt,
        (mathX) => transformer.toPixelX(mathX),
        (mathY) => transformer.toPixelY(mathY),
    );
  }

  /**
   * Dibuja el relleno rosa, las líneas de división discontinuas y los
   * puntos rojos en los vértices de los trapecios.
   * Debe llamarse ANTES de renderFunction para que la curva quede encima.
   * @param divisionPoints - Puntos de división calculados por el modelo.
   * @param transformer - Transformer activo para convertir coordenadas.
   */
  renderTrapezoids(
      divisionPoints: readonly TrapezoidPoint[],
      transformer: CoordinateTransformer,
  ): void {
    const renderer = new TrapezoidRenderer(
        this.canvasView.getContext(),
        transformer,
    );
    renderer.draw(divisionPoints);
  }

  /**
   * Actualiza el párrafo de resultado con el área total.
   * @param totalArea - Área total calculada por la regla del trapecio.
   */
  renderResult(totalArea: number): void {
    this.resultView.update(totalArea);
  }
}
