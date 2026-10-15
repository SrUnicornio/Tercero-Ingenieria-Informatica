/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file controls-view.ts
 * @description
 *   Vista del panel de controles P3 (capa V del MVC).
 *
 *   Responsabilidades (SRP):
 *    - Leer y validar los valores de los inputs del formulario.
 *    - Registrar los callbacks para los eventos de usuario:
 *      "Lanzar" y "Limpiar".
 *    - Informar si se deben acumular las trayectorias.
 *
 *   Esta clase no conoce el modelo ni el controlador.
 *   Simplemente expone los datos del DOM de forma tipada.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { ProjectileLaunchParams } from '../model/projectile-model.js';

/**
 * @class ControlsView
 * @classdesc
 *   Encapsula el panel de controles P3 y provee una API limpia
 *   al controlador para leer los parámetros de lanzamiento.
 *
 * @example
 * ```typescript
 * const controls = new ControlsView(
 *   'speedInput', 'angleInput', 'heightInput',
 *   'launchButton', 'clearButton',
 * );
 * controls.onLaunch(() => controller.handleLaunch());
 * controls.onClear(() => controller.handleClear());
 * const params = controls.getLaunchParams();
 * ```
 */
export class ControlsView {
  /** Input de velocidad inicial. */
  private readonly speedInput: HTMLInputElement;

  /** Input de ángulo de lanzamiento. */
  private readonly angleInput: HTMLInputElement;

  /** Input de altura inicial. */
  private readonly heightInput: HTMLInputElement;

  /** Checkbox: mostrar trayectoria durante el vuelo. */
  private readonly accumulateCheckbox: HTMLInputElement;

  /** Checkbox: mostrar trayectoria durante el vuelo. */
  private readonly showTrajectoryCheckbox: HTMLInputElement;

  /** Botón de lanzamiento. */
  private readonly launchButton: HTMLButtonElement;

  /** Botón de limpieza. */
  private readonly clearButton: HTMLButtonElement;

  /**
   * @param speedInputId       - ID del input de velocidad.
   * @param angleInputId       - ID del input de ángulo.
   * @param heightInputId      - ID del input de altura.
   * @param accumulateId       - ID del checkbox de acumulación.
   * @param showTrajectoryId   - ID del checkbox de mostrar trayectoria.
   * @param launchButtonId     - ID del botón lanzar.
   * @param clearButtonId      - ID del botón limpiar.
   * @throws {Error} Si algún elemento del DOM no existe.
   */
  constructor(
    speedInputId: string,
    angleInputId: string,
    heightInputId: string,
    accumulateId: string,
    showTrajectoryId: string,
    launchButtonId: string,
    clearButtonId: string,
  ) {
    this.speedInput =
      this.requireInputById(speedInputId);
    this.angleInput =
      this.requireInputById(angleInputId);
    this.heightInput =
      this.requireInputById(heightInputId);
    this.showTrajectoryCheckbox =
      this.requireInputById(showTrajectoryId);
    this.launchButton =
      this.requireButtonById(launchButtonId);
    this.clearButton =
      this.requireButtonById(clearButtonId);
    this.accumulateCheckbox =
      this.requireInputById(accumulateId);

  }

  // -------------------------------------------------------------------------
  // Registro de eventos
  // -------------------------------------------------------------------------

  /**
   * @method onLaunch
   * @description Registra el callback para el evento de lanzamiento.
   * @param callback - Función a invocar al pulsar "Lanzar".
   */
  onLaunch(callback: () => void): void {
    this.launchButton.addEventListener('click', callback);

    const inputs = [this.speedInput, this.angleInput, this.heightInput];
    inputs.forEach(input => {
      input.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          callback();
        }
      });
    });
  }

  /**
   * @method onClear
   * @description Registra el callback para el evento de limpieza.
   * @param callback - Función a invocar al pulsar "Limpiar".
   */
  onClear(callback: () => void): void {
    this.clearButton.addEventListener('click', callback);
  }

  // -------------------------------------------------------------------------
  // Lectura de parámetros
  // -------------------------------------------------------------------------

  /**
   * @method getLaunchParams
   * @description
   *   Lee y valida los parámetros del formulario.
   *
   * @returns Los parámetros de lanzamiento validados.
   * @throws {Error} Si algún valor está fuera de rango.
   */
  getLaunchParams(): ProjectileLaunchParams {
    const initialSpeed = this.parsePositiveNumber(
      this.speedInput.value,
      'Velocidad inicial',
    );
    const angleDegrees = this.parseRangedNumber(
      this.angleInput.value,
      'Ángulo',
      1,
      89,
    );
    const initialHeight = this.parseNonNegativeNumber(
      this.heightInput.value,
      'Altura inicial',
    );

    return { initialSpeed, angleDegrees, initialHeight };
  }

  /**
   * @method shouldShowTrajectory
   * @description Indica si el usuario desea ver la estela de la trayectoria.
   * @returns `true` si el checkbox está marcado.
   */
  shouldShowTrajectory(): boolean {
    return this.showTrajectoryCheckbox.checked;
  }

  shouldAccumulateTrajectories(): boolean {
    return this.accumulateCheckbox.checked;
  }

  // -------------------------------------------------------------------------
  // Privados — parsers y helpers del DOM
  // -------------------------------------------------------------------------

  /**
   * Parsea un número positivo estricto desde un string de input.
   * @param rawValue - Valor crudo del input.
   * @param fieldName - Nombre del campo para el mensaje de error.
   * @returns El número parseado.
   * @throws {Error} Si el valor no es un número positivo.
   */
  private parsePositiveNumber(
    rawValue: string,
    fieldName: string,
  ): number {
    const value = parseFloat(rawValue);
    if (isNaN(value) || value <= 0) {
      throw new Error(
        `${fieldName} debe ser un número positivo.`,
      );
    }
    return value;
  }

  /**
   * Parsea un número no negativo desde un string de input.
   * @param rawValue  - Valor crudo del input.
   * @param fieldName - Nombre del campo para el mensaje de error.
   * @returns El número parseado.
   * @throws {Error} Si el valor es negativo.
   */
  private parseNonNegativeNumber(
    rawValue: string,
    fieldName: string,
  ): number {
    const value = parseFloat(rawValue);
    if (isNaN(value) || value < 0) {
      throw new Error(
        `${fieldName} no puede ser negativo.`,
      );
    }
    return value;
  }

  /**
   * Parsea un número dentro de un rango [min, max].
   * @param rawValue  - Valor crudo del input.
   * @param fieldName - Nombre del campo para el mensaje de error.
   * @param min       - Valor mínimo permitido.
   * @param max       - Valor máximo permitido.
   * @returns El número parseado.
   * @throws {Error} Si el valor está fuera del rango.
   */
  private parseRangedNumber(
    rawValue: string,
    fieldName: string,
    min: number,
    max: number,
  ): number {
    const value = parseFloat(rawValue);
    if (isNaN(value) || value < min || value > max) {
      throw new Error(
        `${fieldName} debe estar entre ${min} y ${max}.`,
      );
    }
    return value;
  }

  /**
   * Obtiene un HTMLInputElement por ID o lanza un error.
   * @param elementId - ID del elemento.
   * @returns El elemento obtenido.
   * @throws {Error} Si el elemento no existe.
   */
  private requireInputById(elementId: string): HTMLInputElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLInputElement)) {
      throw new Error(
        `ControlsView: no se encontró <input id="${elementId}">.`,
      );
    }
    return element;
  }

  /**
   * Obtiene un HTMLButtonElement por ID o lanza un error.
   * @param elementId - ID del elemento.
   * @returns El elemento obtenido.
   * @throws {Error} Si el elemento no existe.
   */
  private requireButtonById(elementId: string): HTMLButtonElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLButtonElement)) {
      throw new Error(
        `ControlsView: no se encontró <button id="${elementId}">.`,
      );
    }
    return element;
  }
}