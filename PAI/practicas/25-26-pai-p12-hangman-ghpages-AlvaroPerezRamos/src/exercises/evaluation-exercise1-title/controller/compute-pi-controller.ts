/**
 * @file compute-pi-controller.ts
 * @description Controlador principal que coordina el modelo y la vista
 * para inicializar la simulación de cálculo de π mediante Monte Carlo.
 * @module ComputePiController
 */

import {ComputePiModel} from '../model/compute-pi-model.js';
import {ComputePiView} from '../view/compute-pi-view.js';

/**
 * Controlador que conecta el modelo con la vista.
 */
export class ComputePiController {
  /**
   * @param {!ComputePiModel} model Modelo que gestiona los datos.
   * @param {!ComputePiView} view Vista encargada del renderizado.
   */
  constructor(
    private readonly model: ComputePiModel,
    private readonly view: ComputePiView,
  ) {
    window.addEventListener('resize', () => this.handleResize());
  }

  run(): void {
    this.render();
  }

  /**
   * Encapsula la lógica de renderizado para poder llamarla en el inicio y en el resize.
   */
  private render(): void {
    const config = this.model.getConfig();
    const colors = this.model.getColors();
    this.view.renderInitialView(config, colors);
  }

  private handleResize(): void {
    this.render();
  }
}
