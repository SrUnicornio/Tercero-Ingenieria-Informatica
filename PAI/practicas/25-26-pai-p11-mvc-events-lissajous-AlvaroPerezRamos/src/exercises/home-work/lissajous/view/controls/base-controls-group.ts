/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file base-controls-group.ts
 * @description
 *   Clase abstracta que encapsula la lógica común de los grupos de controles
 *   numéricos y de tipo range del panel.
 *
 *   Solo gestiona inputs de valor numérico (number y range).
 *   El checkbox `checkboxPhaseAnimated` NO pertenece aquí: es responsabilidad
 *   de `ControlsPanel` (fachada), que lo gestiona directamente.
 *
 *   SRP: esta clase no sabe nada de checkboxes ni de la fachada.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import { LissajousParams } from '../../interfaces/lissajous-params.js';
import { ControlsLimits } from '../../interfaces/controls-limits.js';
import { ControlBinding } from '../../interfaces/control-binding.js';

/**
 * @abstract
 * @class BaseControlsGroup
 * @classdesc
 *   Implementa la funcionalidad común a los grupos de controles numéricos
 *   (inputs de tipo `number` y `range`). Las clases derivadas únicamente
 *   deben proporcionar la lista de `ControlBinding` correspondiente a sus
 *   elementos y sobreescribir `getBinding`.
 */
export abstract class BaseControlsGroup {
  /** Mapa de elementos del DOM asociados a los parámetros del modelo. */
  protected readonly elements: Map<keyof LissajousParams, HTMLInputElement> =
    new Map();

  /**
   * @constructor
   * @param bindings - Configuración de los controles numéricos.
   * @param limits   - Límites de validación de los parámetros.
   * @throws {Error} Si algún elemento no existe en el DOM.
   */
  constructor(
    bindings: ControlBinding[],
    protected readonly limits: ControlsLimits,
  ) {
    bindings.forEach((binding) => {
      const element = this.requireInputById(binding.id);
      this.elements.set(binding.param, element);
    });
  }

  /**
   * @method updateFromParams
   * @description Sincroniza los valores de los controles con el modelo.
   * @param params - Estado actual del modelo.
   */
  updateFromParams(params: LissajousParams): void {
    this.elements.forEach((element, param) => {
      const value = params[param] as number;
      const binding = this.getBinding(param);
      element.value = binding.formatter
        ? binding.formatter(value)
        : String(value);
    });
  }

  /**
   * @method onParamChange
   * @description Registra listeners en los controles y notifica cambios.
   * @param callback - Función invocada con los cambios parciales del modelo.
   */
  onParamChange(callback: (updates: Partial<LissajousParams>) => void): void {
    this.elements.forEach((element, param) => {
      const binding = this.getBinding(param);
      this.registerNumericListener(
        element,
        binding.parseFn,
        binding.min,
        binding.max,
        (value) => callback({ [param]: value }),
      );
    });
  }

  /**
   * @protected
   * @abstract
   * @method getBinding
   * @description Devuelve la configuración del control para un parámetro dado.
   * @param param - Propiedad del modelo.
   */
  protected abstract getBinding(param: keyof LissajousParams): ControlBinding;

  /**
   * @protected
   * @method requireInputById
   * @description Obtiene un HTMLInputElement por id o lanza un error.
   * @throws {Error} Si el elemento no existe o no es HTMLInputElement.
   */
  protected requireInputById(elementId: string): HTMLInputElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLInputElement)) {
      throw new Error(`BaseControlsGroup: no se encontró <input id="${elementId}">.`);
    }
    return element;
  }

  /**
   * @private
   * @method registerNumericListener
   * @description Registra un listener: parsea, clampea y notifica al callback.
   * @param inputElement - Input a escuchar.
   * @param parseFn      - parseInt o parseFloat según el parámetro.
   * @param min          - Valor mínimo permitido.
   * @param max          - Valor máximo permitido.
   * @param onValid      - Callback con el valor clampado y válido.
   */
  private registerNumericListener(
    inputElement: HTMLInputElement,
    parseFn: (value: string, radix?: number) => number,
    min: number,
    max: number,
    onValid: (clampedValue: number) => void,
  ): void {
    inputElement.addEventListener('input', () => {
      const parsed = parseFn(inputElement.value, 10);
      if (isNaN(parsed)) return;
      onValid(Math.max(min, Math.min(max, parsed)));
    });
  }
}