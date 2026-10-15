/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-core.ts
 * @description
 *  Implementación del modelo geométrico del sistema de coordenadas cartesianas.
 *  Define la clase CoordinateSystemModel que calcula el origen y la escala en píxeles por unidad,
 *  y la clase CartesianCoordinateSystem que actúa como fachada pública para renderizar el sistema completo en un canvas.
 * 
 * @author Álvaro Pérez Ramos
 * @since March 2026
 */

import { MathFunction } from './math-functions.js';
import { Point, CartesianGridConfig, DEFAULT_CARTESIAN_GRID_CONFIG } from './config.js';
import { CanvasManager, LineDrawer, GridRenderer, AxisRenderer, FunctionPlotter } from './render.js';

/**
 * @class CoordinateSystemModel
 * @classdesc Modelo geométrico del sistema de coordenadas cartesianas.
 * Calcula el origen y la escala en píxeles por unidad.
 * Proporciona métodos para convertir entre coordenadas cartesianas y píxeles.
 */
export class CoordinateSystemModel {
  private readonly origin: Point;
  private readonly pixelsPerUnitX: number
  private readonly pixelsPerUnitY: number

  /**
   * @constructor
   * @description Inicializa el modelo con las dimensiones del canvas y la escala.
   * @param width - Ancho del canvas en píxeles.
   * @param height - Altura del canvas en píxeles.
   * @param pixelsPerUnitX - Número de píxeles en el eje X que representan una unidad en el sistema de coordenadas.
   * @param pixelsPerUnitY - Número de píxeles en el eje Y que representan una unidad en el sistema de coordenadas.
   */
  constructor(width: number, height: number, config: CartesianGridConfig) {
    this.origin = { x: width / 2, y: height / 2 };
    this.pixelsPerUnitX = config.majorStepPx / config.unitsPerTickX;
    this.pixelsPerUnitY = config.majorStepPx / config.unitsPerTickY;
  }

  /**
   * @method getOrigin
   * @description Devuelve el punto de origen del sistema de coordenadas en píxeles.
   * @returns El punto de origen del sistema de coordenadas.
   */
  getOrigin(): Point {
    return this.origin;
  }

  /**
   * @method getPixelsPerUnit
   * @description Devuelve el número de píxeles que representan una unidad en el sistema de coordenadas.
   * @returns El número de píxeles por unidad.
   */
  getPixelsPerUnitX(): number {
    return this.pixelsPerUnitX;
  }

  /**
   * @method getPixelsPerUnitY
   * @description Devuelve el número de píxeles que representan una unidad en el eje Y del sistema de coordenadas.
   * @returns El número de píxeles por unidad en el eje Y.
   */
  getPixelsPerUnitY(): number {
    return this.pixelsPerUnitY;
  }
}

/**
 * @class CartesianCoordinateSystem
 * @classdesc Fachada pública del sistema de coordenadas cartesianas.
 * Proporciona un método simple para renderizar el sistema completo en un canvas, ocultando la complejidad interna de los renderizadores y el modelo.
 * Permite personalizar la configuración del grid y los ejes al crear una instancia de esta clase.
 */
export class CartesianCoordinateSystem {
  private readonly canvas: CanvasManager;
  private readonly grid: GridRenderer;
  private readonly axis: AxisRenderer;
  private readonly plotter: FunctionPlotter;

  /**
   * @constructor
   * @description Inicializa el sistema de coordenadas cartesianas con el ID del canvas y una configuración opcional.
   * Crea las instancias necesarias para manejar el canvas, el modelo geométrico y los renderizadores del grid y los ejes.
   * @param canvasId - ID del elemento canvas donde se renderizará el sistema de coordenadas.
   * @param config - Configuración opcional para personalizar la apariencia del grid y los ejes. Si no se proporciona, se utilizará la configuración por defecto.
   * @throws Error si el canvas no es válido o si no se puede obtener el contexto 2D.
   */
  constructor(canvasId: string, config?: Partial<CartesianGridConfig>) {
    this.canvas = new CanvasManager(canvasId);

    const finalConfig = { ...DEFAULT_CARTESIAN_GRID_CONFIG, ...config };
    const lineDrawer = new LineDrawer(this.canvas);

    const model = new CoordinateSystemModel(
      this.canvas.getWidth(),
      this.canvas.getHeight(),
      finalConfig,
    );

    this.grid = new GridRenderer(this.canvas, model, finalConfig, lineDrawer);
    this.axis = new AxisRenderer(this.canvas, model, finalConfig, lineDrawer);
    this.plotter = new FunctionPlotter(this.canvas, model);
  }

  /**
   * @method render
   * @description Renderiza el sistema de coordenadas cartesianas completo en el canvas.
   * Limpia el canvas antes de dibujar, y luego llama a los métodos de los renderizadores para dibujar el grid y los ejes.
   * Este método es la única interfaz pública para renderizar el sistema, ocultando toda la complejidad interna.
   */
  render(): void {
    this.canvas.clear();
    this.grid.draw();
    this.axis.draw();
  }

  /**
   * @method plotFunction
   * @description Dibuja una función matemática sobre el sistema de coordenadas.
   * @param func - Función matemática a representar.
   */
  plotFunction(func: MathFunction): void {
    this.plotter.plot(func);
  }
}