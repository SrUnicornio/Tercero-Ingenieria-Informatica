/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-system.ts
 * @description
 *   Fachada del sistema de coordenadas cartesianas.
 *
 *   Agrupa {@link GridRenderer}, {@link AxisX} y {@link AxisY} en un único
 *   objeto que se construye una sola vez y se reutiliza en cada redibujado.
 *   Cuando la escala cambia, basta con llamar a `updateTransformer()`.
 *
 *   Motivación: en el diseño anterior, `drawGridAndAxes()` en `ProjectileView`
 *   construía tres objetos nuevos en cada llamada (problema de rendimiento y
 *   de diseño). Esta clase resuelve ambos problemas.
 *
 *   Patrón: Facade — oculta la complejidad de los tres renderizadores.
 *
 *   SRP: esta clase no dibuja nada directamente; solo coordina.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CoordinateTransformer } from '../util/coordinate-transformer.js';
import { AxisConfig } from './axis/axis.js';
import { AxisX } from './axis/axis-x.js';
import { AxisY } from './axis/axis-y.js';
import { GridRenderer } from './grid-renderer.js';

/**
 * @class CoordinateSystem
 * @classdesc
 *   Fachada que agrupa la cuadrícula y los dos ejes cartesianos.
 *
 *   Se construye una vez en {@link ProjectileView} y se actualiza
 *   con `updateTransformer()` cuando la escala cambia tras un nuevo
 *   lanzamiento.
 */
export class CoordinateSystem {
  private grid: GridRenderer;
  private axisX: AxisX;
  private axisY: AxisY;

  /**
   * @param context     - Contexto 2D del canvas.
   * @param transformer - Conversor metros → píxeles inicial.
   * @param axisConfig  - Configuración visual y de escala.
   */
  constructor(
    private readonly context: CanvasRenderingContext2D,
    transformer: CoordinateTransformer,
    private readonly axisConfig: AxisConfig,
  ) {
    this.grid = new GridRenderer(context, transformer);
    this.axisX = new AxisX(context, transformer, axisConfig);
    this.axisY = new AxisY(context, transformer, axisConfig);
  }

  /**
   * @method updateTransformer
   * @description
   *   Reconstruye los renderizadores internos con el nuevo transformer.
   *   Debe llamarse cada vez que cambie la escala (maxX / maxY).
   *
   * @param transformer - Nuevo conversor metros → píxeles.
   */
  updateTransformer(transformer: CoordinateTransformer): void {
    this.grid = new GridRenderer(this.context, transformer);
    this.axisX = new AxisX(this.context, transformer, this.axisConfig);
    this.axisY = new AxisY(this.context, transformer, this.axisConfig);
  }

  /**
   * @method draw
   * @description
   *   Dibuja la cuadrícula y los dos ejes sobre el contexto actual.
   *   Puede llamarse en cualquier momento, independientemente de si
   *   hay una parábola activa.
   */
  draw(): void {
    this.grid.draw();
    this.axisX.draw();
    this.axisY.draw();
  }
}