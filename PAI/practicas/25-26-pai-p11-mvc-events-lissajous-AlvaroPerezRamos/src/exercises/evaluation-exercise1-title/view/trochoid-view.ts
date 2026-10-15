/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trochoid-view.ts
 * @description
 *   Vista (capa V del patrón MVC) de la aplicación Trochoid.
 *   Fachada que orquesta el canvas delegando el dibujo:
 *     - {@link CartesianRenderer}: plano cartesiano (ejes, cuadrícula)
 *     - {@link TrochoidRenderer}: elementos dinámicos de la trocoide
 *
 *   Ejercicio 2: añade la curva trocoide, el círculo rodante negro,
 *   el segmento rojo y los puntos trazador y central.
 *
 *   SRP: solo gestiona la presentación visual y la composición de
 *   renderizadores. No conoce la lógica matemática ni el controlador.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { CartesianRenderer } from './cartesian-renderer.js';
import { TrochoidRenderer } from './trochoid-renderer.js';
import { TrochoidParams } from '../interfaces/trochoid-params.js';

/**
 * @class TrochoidView
 * @classdesc Vista MVC — Ejercicio 2.
 *   Fachada que orquesta el canvas delegando el plano cartesiano a
 *   {@link CartesianRenderer} y los elementos dinámicos a
 *   {@link TrochoidRenderer}.
 *   Los puntos marcadores (EJ1) se siguen mostrando junto a la trocoide.
 */
export class TrochoidView {
  private readonly canvasElement: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly cartesianRenderer: CartesianRenderer;
  private readonly trochoidRenderer: TrochoidRenderer;

  /** @throws {Error} Si el canvas no existe o no admite contexto 2D. */
  constructor() {
    this.canvasElement = this.requireCanvasById('trochoidCanvas');

    const context = this.canvasElement.getContext('2d');
    if (!context) {
      throw new Error('TrochoidView: no se pudo obtener el contexto 2D del canvas.');
    }
    this.context = context;
    this.cartesianRenderer = new CartesianRenderer(this.context);
    this.trochoidRenderer = new TrochoidRenderer(this.context, this.cartesianRenderer);
  }

  // ---------------------------------------------------------------------------
  // Tamaño del canvas
  // ---------------------------------------------------------------------------

  /**
   * @method syncCanvasSize
   * @description Sincroniza las dimensiones lógicas del canvas con su CSS.
   */
  syncCanvasSize(): void {
    const canvas = this.canvasElement;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  }

  // ---------------------------------------------------------------------------
  // Renderizado
  // ---------------------------------------------------------------------------

  /**
   * @method render
   * @description
   *   Redibuja el canvas completo en el siguiente orden:
   *     1. Plano cartesiano (fondo, cuadrícula, ejes, etiquetas)
   *     2. Puntos marcadores fijos (EJ1: (3,4) y (-2,-1))
   *     3. Curva trocoide (EJ2)
   *     4. Elementos dinámicos (círculo rodante, segmento, puntos)
   *
   * @param params       - Parámetros del modelo (radius, distance, angle, flags).
   * @param markerPoints - Puntos marcadores en coordenadas de mundo (desde modelo).
   */
  render(params: TrochoidParams): void {
    const { width, height } = this.canvasElement;

    // Capa 1: plano cartesiano (fondo, cuadrícula, ejes)
    this.cartesianRenderer.draw(width, height);

    // // Capa 3: curva trocoide
    // this.drawTrochoidCurve(params, width, height);

    // Capa 4: elementos dinámicos (círculos, segmento, puntos)
    this.trochoidRenderer.draw(params, width, height);
  }

  // ---------------------------------------------------------------------------
  // Privados — curva trocoide
  // ---------------------------------------------------------------------------

  /**
   * Dibuja la curva trocoide punto a punto como una línea continua.
   * Los puntos se obtienen del modelo a través del controlador,
   * pero por separación MVC, la vista no llama directamente al modelo.
   *
   * NOTA: En la implementación actual, los puntos de la curva se
   * calculan en el modelo y se pasan a través del controlador.
   * Para mantener SRP, este método recibe los puntos como parámetro.
   *
   * @param params       - Parámetros del modelo (para obtener la curva).
   * @param canvasWidth  - Ancho del canvas en píxeles.
   * @param canvasHeight - Alto del canvas en píxeles.
   */
  // private drawTrochoidCurve(params: TrochoidParams, canvasWidth: number, canvasHeight: number): void {
  //   // Los puntos de la curva deberían venir del modelo a través del controlador.
  //   // Por ahora, los calculamos aquí para mantener la funcionalidad,
  //   // pero en una refactorización futura se pasarían como parámetro.
  //   const curvePoints = this.computeTrochoidPoints(params);

  //   if (curvePoints.length < 2) return;

  //   const firstPoint = curvePoints[0];
  //   const firstPixel = this.cartesianRenderer.worldToCanvas(
  //     firstPoint.x,
  //     firstPoint.y,
  //     canvasWidth,
  //     canvasHeight,
  //   );

  //   this.context.save();
  //   this.context.strokeStyle = 'blue';
  //   this.context.lineWidth = 2;
  //   this.context.beginPath();
  //   this.context.moveTo(firstPixel.pixelX, firstPixel.pixelY);

  //   for (let i = 1; i < curvePoints.length; i++) {
  //     const point = curvePoints[i];
  //     const pixel = this.cartesianRenderer.worldToCanvas(
  //       point.x,
  //       point.y,
  //       canvasWidth,
  //       canvasHeight,
  //     );
  //     this.context.lineTo(pixel.pixelX, pixel.pixelY);
  //   }

  //   this.context.stroke();
  //   this.context.restore();
  // }

  /**
   * Calcula los puntos de la curva trocoide para los parámetros dados.
   * Ecuaciones paramétricas (t ∈ [0, 4π]):
   *   x(t) = r·t − d·sin(t)
   *   y(t) = r − d·cos(t)
   *
   * @param params - Parámetros actuales (radius, distance).
   * @param steps  - Número de puntos (por defecto 800).
   * @returns Array de puntos en coordenadas de mundo.
   */
  // private computeTrochoidPoints(params: TrochoidParams, steps = 800): Array<{ x: number; y: number }> {
  //   const { rollingCircleRadius: radius, tracingPointDistance: distance } = params;
  //   const points: Array<{ x: number; y: number }> = [];
  //   const maxParameter = 4 * Math.PI;

  //   for (let step = 0; step <= steps; step++) {
  //     const parameter = (step / steps) * maxParameter;
  //     points.push({
  //       x: radius * parameter - distance * Math.sin(parameter),
  //       y: radius - distance * Math.cos(parameter),
  //     });
  //   }
  //   return points;
  // }

  // ---------------------------------------------------------------------------
  // Privados — DOM
  // ---------------------------------------------------------------------------

  private requireCanvasById(elementId: string): HTMLCanvasElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`TrochoidView: no se encontró <canvas id="${elementId}">.`);
    }
    return element;
  }
}