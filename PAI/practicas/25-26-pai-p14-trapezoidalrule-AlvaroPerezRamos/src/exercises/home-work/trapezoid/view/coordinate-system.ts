/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file coordinate-system.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Fachada del sistema de coordenadas cartesianas.
 */

import {CoordinateTransformer} from '../util/coordinate-transformer';
import {CoordinateConfig} from '../interfaces/coordinate-config';
import {GridRenderer} from './grid-renderer';
import {AxisX} from './axis/axis-x';
import {AxisY} from './axis/axis-y';

/**
 * Fachada que agrupa la cuadrícula y los dos ejes cartesianos.
 * Se construye una vez en TrapezoidView y se actualiza con
 * update() cuando el dominio matemático cambia.
 */
export class CoordinateSystem {
  private gridRenderer: GridRenderer;
  private axisX: AxisX;
  private axisY: AxisY;

  /**
   * @param renderingContext - Contexto 2D del canvas.
   * @param transformer      - Conversor coordenadas matemáticas → píxeles.
   * @param config           - Configuración visual compartida.
   */
  constructor(
    private readonly renderingContext: CanvasRenderingContext2D,
    transformer: CoordinateTransformer,
    private readonly config: CoordinateConfig,
  ) {
    this.gridRenderer =
      new GridRenderer(renderingContext, transformer, config);
    this.axisX = new AxisX(renderingContext, transformer, config);
    this.axisY = new AxisY(renderingContext, transformer, config);
  }

  /**
   * Reconstruye los renderizadores internos con el nuevo transformer.
   * Debe llamarse cada vez que el dominio matemático cambie (nueva
   * expresión, nuevo start/end, resize del canvas).
   * @param transformer - Nuevo conversor coordenadas matemáticas → píxeles.
   */
  update(transformer: CoordinateTransformer): void {
    this.gridRenderer =
      new GridRenderer(this.renderingContext, transformer, this.config);
    this.axisX =
      new AxisX(this.renderingContext, transformer, this.config);
    this.axisY =
      new AxisY(this.renderingContext, transformer, this.config);
  }

  /**
   * Dibuja la cuadrícula y los dos ejes sobre el contexto actual.
   * Orden: grid primero (fondo), luego ejes (encima).
   */
  draw(): void {
    this.gridRenderer.draw();
    this.axisX.draw();
    this.axisY.draw();
  }
}
