/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file numeric-controls-panel.ts
 * @description
 *   Implementación concreta de `BaseControlsGroup` para los controles
 *   numéricos (`input type="number"`). Incluye además la gestión del
 *   checkbox que activa la animación del desfase.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import { BaseControlsGroup } from './base-controls-group.js';
import { LissajousParams } from '../../interfaces/lissajous-params.js';
import { ControlsLimits } from '../../interfaces/controls-limits.js';
import { ControlBinding } from '../../interfaces/control-binding.js';

/**
 * @class NumericInputsGroup
 * @extends BaseControlsGroup
 * @classdesc
 *   Gestiona los inputs numéricos del panel de control.
 */
export class NumericInputsGroup extends BaseControlsGroup {
  private readonly bindings: ControlBinding[];

  /** @constructor 
   * @param limits - Límites de validación de los parámetros.
   */
  constructor(limits: ControlsLimits) {
    const bindings: ControlBinding[] = [
      { id: 'inputFrequencyX', param: 'frequencyX', parseFn: parseInt,
          min: limits.frequencyMin, max: limits.frequencyMax },
      { id: 'inputFrequencyY', param: 'frequencyY', parseFn: parseInt,
          min: limits.frequencyMin, max: limits.frequencyMax },
      { id: 'inputPhaseShift', param: 'phaseShift', parseFn: parseFloat,
          min: limits.phaseShiftMin, max: limits.phaseShiftMax,
          formatter: (value: number) => value.toFixed(2) },
      { id: 'inputAmplitudeX', param: 'amplitudeX', parseFn: parseInt,
          min: limits.amplitudeMin, max: limits.amplitudeMax },
      { id: 'inputAmplitudeY', param: 'amplitudeY', parseFn: parseInt,
          min: limits.amplitudeMin, max: limits.amplitudeMax },
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