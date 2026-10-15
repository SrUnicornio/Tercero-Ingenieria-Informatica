/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file compute-pi-model.ts
 * @description Modelo que gestiona los datos de la simulación Monte Carlo.
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {CoordinateSystemConfig, ColorScheme} from '../interfaces/types';

export class ComputePiModel {
  private readonly config: CoordinateSystemConfig = {
    axisMin: -5,
    axisMax: 5,
    circleRadius: 4,
    axisLabelMarginPx: 40,
    axisTickLengthPx: 5,
  };

  private readonly colors: ColorScheme = {
    ullPurple: '#5C068C',
    axisColor: '#333',
    gridLineColor: '#ddd',
  };

  getConfig(): CoordinateSystemConfig {
    return {...this.config};
  }

  getColors(): ColorScheme {
    return {...this.colors};
  }
}
