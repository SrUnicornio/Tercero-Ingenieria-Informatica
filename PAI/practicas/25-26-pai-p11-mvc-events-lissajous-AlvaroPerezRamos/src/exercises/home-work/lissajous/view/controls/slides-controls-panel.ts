/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file slides-controls-panel.ts
 * @description
 *   Implementación concreta de `BaseControlsGroup` para los controles
 *   tipo slider (`input type="range"`).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import { BaseControlsGroup } from './base-controls-group.js';
import { ControlsLimits } from '../../interfaces/controls-limits.js';
import { LissajousParams } from '../../interfaces/lissajous-params.js';
import { ControlBinding } from '../../interfaces/control-binding.js';

/**
 * @class SliderInputsGroup
 * @extends BaseControlsGroup
 * @classdesc
 *   Gestiona los sliders del panel de control.
 */
export class SliderInputsGroup extends BaseControlsGroup {
  private readonly bindings: ControlBinding[];

  /**
   * @constructor
   * @param limits - Límites de validación de los parámetros. 
   */
  constructor(limits: ControlsLimits) {
    const bindings: ControlBinding[] = [
      { id: 'sliderFrequencyX', param: 'frequencyX', parseFn: parseInt, min: limits.frequencyMin, max: limits.frequencyMax },
      { id: 'sliderFrequencyY', param: 'frequencyY', parseFn: parseInt, min: limits.frequencyMin, max: limits.frequencyMax },
      { id: 'sliderPhaseShift', param: 'phaseShift', parseFn: parseFloat, min: limits.phaseShiftMin, max: limits.phaseShiftMax },
      { id: 'sliderAmplitudeX', param: 'amplitudeX', parseFn: parseInt, min: limits.amplitudeMin, max: limits.amplitudeMax },
      { id: 'sliderAmplitudeY', param: 'amplitudeY', parseFn: parseInt, min: limits.amplitudeMin, max: limits.amplitudeMax },
    ];

    super(bindings, limits);
    this.bindings = bindings;
  }

  /** @inheritdoc */
  protected getBinding(param: keyof LissajousParams): ControlBinding {
    const binding = this.bindings.find((binding) => binding.param === param);
    if (!binding) {
      throw new Error(`Binding no encontrado para el parámetro ${String(param)}`);
    }
    return binding;
  }
}