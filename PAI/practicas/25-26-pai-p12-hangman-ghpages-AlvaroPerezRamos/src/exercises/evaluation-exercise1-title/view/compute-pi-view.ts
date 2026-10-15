/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file compute-pi-view.ts
 * @description Vista principal de la simulación MonteCarlo.
 *   Coordina el canvas (delegando el sistema de coordenadas a CoordinateSystemView),
 *   dibuja el cuadrado y el círculo, pinta los dardos y actualiza los contadores.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {ControlsView} from './controls-view.js';
import {CoordinateSystemView} from './coordinate-system-view.js';
import {CoordinateSystemConfig, ColorScheme} from '../interfaces/types.js';

/**
 * @class ComputePiView
 * @description Gestiona el canvas HTML y los elementos textuales del panel.
 *   Delega el dibujo del sistema de coordenadas a CoordinateSystemView y
 *   se ocupa únicamente de la capa de la simulación: cuadrado, círculo y dardos.
 */
export class ComputePiView {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private coordView?: CoordinateSystemView;
  private controlsView: ControlsView;

  constructor() {
    const canvasElement = document.getElementById('pi-canvas') as HTMLCanvasElement;
    const controlsContainer = document.querySelector('.controls-panel') as HTMLElement;

    if (!canvasElement || !controlsContainer) {
      throw new Error('No se encontraron los elementos del DOM necesarios');
    }

    this.canvas = canvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.controlsView = new ControlsView(controlsContainer);
  }

  /**
   * Renderiza todo el sistema.
   * Recibe los datos (config) y la estética (colors) del modelo.
  */
  renderInitialView(config: CoordinateSystemConfig, colors: ColorScheme): void {
    this.syncCanvasSize(); // Paso crítico antes de dibujar

    this.coordView = new CoordinateSystemView(this.context, config, colors);

    // Limpiamos todo el buffer
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujamos el sistema de coordenadas adaptado al nuevo width
    this.coordView.draw(this.canvas.width);
    this.drawSimulationShapes(config.circleRadius, colors.ullPurple);

    // El render de controles solo debe hacerse una vez o manejar su propia lógica
    // para no borrar inputs del usuario.
    if (!document.getElementById('button-add')) {
      this.controlsView.render();
    }
  }

  private syncCanvasSize(): void {
    // Tomamos el tamaño que el CSS le ha dado al elemento en el navegador
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    // Igualamos la resolución interna del dibujo
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  private drawSimulationShapes(radius: number, color: string): void {
    if (!this.coordView) return;

    const size = this.canvas.width;
    const centerX = this.coordView.toPixelX(0, size);
    const centerY = this.coordView.toPixelY(0, size);
    const pixelR = Math.abs(this.coordView.toPixelX(radius, size) - centerX);

    this.context.strokeStyle = color;
    this.context.lineWidth = 2;

    // Cuadrado de Monte Carlo
    this.context.strokeRect(
        centerX - pixelR, centerY - pixelR, pixelR * 2, pixelR * 2,
    );

    // Círculo inscrito
    this.context.beginPath();
    this.context.arc(centerX, centerY, pixelR, 0, Math.PI * 2);
    this.context.stroke();
  }
}
