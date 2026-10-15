/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file controls-panel.ts
 * @description
 *   Fachada del panel de controles (capa V del patrón MVC).
 *   Orquesta `NumericInputsGroup`, `SliderInputsGroup` y el checkbox
 *   de animación, exponiendo una interfaz única a `LissajousView`.
 *
 *   El checkbox `checkboxPhaseAnimated` se gestiona aquí porque es un
 *   control de tipo toggle, distinto de los inputs numéricos que maneja
 *   `BaseControlsGroup`. Centralizar su gestión en la fachada respeta SRP:
 *   la abstracción solo conoce controles numéricos.
 *
 *   Patrón Facade:   oculta la división interna de grupos de controles.
 *   Patrón Observer: el callback de `onParamChange` desacopla vista y controlador.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import { LissajousParams } from '../../interfaces/lissajous-params.js';
import {
  ControlsLimits,
  DEFAULT_CONTROLS_LIMITS,
} from '../../interfaces/controls-limits.js';
import { NumericInputsGroup } from './numeric-controls-panel.js';
import { SliderInputsGroup } from './slides-controls-panel.js';

/**
 * @class ControlsPanel
 * @classdesc
 *   Fachada del panel de controles. Proporciona una interfaz unificada
 *   para la interacción con `LissajousView` dentro del patrón MVC.
 *   Gestiona directamente el checkbox de animación de fase (toggle),
 *   cuyo tipo es diferente al de los controles numéricos delegados.
 */
export class ControlsPanel {
  private readonly limits: ControlsLimits;
  private readonly numericGroup: NumericInputsGroup;
  private readonly sliderGroup?: SliderInputsGroup;
  private readonly checkboxPhaseAnimated: HTMLInputElement;

  /**
   * @constructor
   * @param limits - Límites opcionales para los controles.
   * @throws {Error} Si el checkbox no existe en el DOM.
   */
  constructor(limits: Partial<ControlsLimits> = {}) {
    this.limits = { ...DEFAULT_CONTROLS_LIMITS, ...limits };
    this.numericGroup = new NumericInputsGroup(this.limits);
    this.sliderGroup = new SliderInputsGroup(this.limits);
    this.checkboxPhaseAnimated = this.requireCheckboxById('checkboxPhaseAnimated');
  }

  /**
   * @method updateFromParams
   * @description Sincroniza todos los controles con el estado del modelo.
   * @param params - Estado actual del modelo.
   */
  updateFromParams(params: LissajousParams): void {
    this.numericGroup.updateFromParams(params);
    this.sliderGroup?.updateFromParams(params);
    this.checkboxPhaseAnimated.checked = params.isPhaseAnimated;
  }

  /**
   * @method onParamChange
   * @description
   *   Registra el callback de cambios en todos los controles.
   *   Cualquier input (numérico, range o checkbox) invocará el mismo callback.
   * @param callback - Función invocada con los cambios parciales del modelo.
   */
  onParamChange(callback: (updates: Partial<LissajousParams>) => void): void {
    this.numericGroup.onParamChange(callback);
    this.sliderGroup?.onParamChange(callback);
    this.checkboxPhaseAnimated.addEventListener('change', () => {
      callback({ isPhaseAnimated: this.checkboxPhaseAnimated.checked });
    });
  }

  /**
   * @private
   * @method requireCheckboxById
   * @description Obtiene un HTMLInputElement[type=checkbox] por id o lanza un error.
   * @throws {Error} Si el elemento no existe o no es HTMLInputElement.
   */
  private requireCheckboxById(elementId: string): HTMLInputElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLInputElement)) {
      throw new Error(`ControlsPanel: no se encontró <input id="${elementId}">.`);
    }
    return element;
  }
}