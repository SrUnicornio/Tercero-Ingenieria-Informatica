/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file controls-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Subelemento de la vista responsable del panel de controles HTML.
 *   Lee inputs, valida (NaN y start < end) y dispara onUpdateRequested
 *   cuando los parámetros son correctos. El controlador nunca toca el DOM.
 */

import {Event} from '../observer/event';
import {TrapezoidParams} from '../interfaces/trapezoid-params';

/** IDs de los elementos del panel de controles en el HTML. */
const DOM_IDS = {
  inputExpression: 'input-expression',
  inputTrapezoids: 'input-trapezoids',
  inputStart: 'input-start',
  inputEnd: 'input-end',
  btnUpdate: 'btn-update',
  errorParagraph: 'trap-error',
} as const;

/** Clase de Bulma que oculta un elemento. */
const HIDDEN_CLASS = 'is-hidden';

/**
 * @interface FormInputs
 * @description Agrupa los cuatro inputs del formulario en un único atributo.
 * @param expression - Input de la expresión matemática.
 * @param trapezoids - Input del número de trapecios.
 * @param start - Input del extremo izquierdo del intervalo.
 * @param end - Input del extremo derecho del intervalo.
 */
export interface FormInputs {
  readonly expression: HTMLInputElement;
  readonly trapezoids: HTMLInputElement;
  readonly start: HTMLInputElement;
  readonly end: HTMLInputElement;
}

/**
 * Clase que gestiona el panel de controles, lee y valida los inputs,
 * y dispara el evento onUpdateRequested con los parámetros listos para el modelo.
 */
export class ControlsView {
  /** Dispara cuando el usuario pulsa Update con parámetros válidos. */
  readonly onUpdateRequested: Event<TrapezoidParams> =
    new Event<TrapezoidParams>();

  private readonly formInputs: FormInputs;
  private readonly updateButton: HTMLButtonElement;
  private readonly errorParagraph: HTMLElement;

  /** @throws {Error} Si algún elemento del DOM requerido no existe. */
  constructor() {
    this.formInputs = {
      expression: this.requireInputById(DOM_IDS.inputExpression),
      trapezoids: this.requireInputById(DOM_IDS.inputTrapezoids),
      start: this.requireInputById(DOM_IDS.inputStart),
      end: this.requireInputById(DOM_IDS.inputEnd),
    };
    this.updateButton = this.requireButtonById(DOM_IDS.btnUpdate);
    this.errorParagraph = this.requireElementById(DOM_IDS.errorParagraph);
    this.registerUpdateListener();
  }

  /**
   * Muestra un mensaje de error en el párrafo dedicado a ello.
   * @param message - Texto del error a mostrar.
   */
  showError(message: string): void {
    this.errorParagraph.textContent = message;
    this.errorParagraph.classList.remove(HIDDEN_CLASS);
  }

  /** Oculta el mensaje de error. */
  clearError(): void {
    this.errorParagraph.classList.add(HIDDEN_CLASS);
  }

  /** Registra el listener para el botón Update. */
  private registerUpdateListener(): void {
    this.updateButton.addEventListener('click', () => {
      this.handleUpdateClick();
    });

    const inputElements = Object.values(this.formInputs);
    for (const input of inputElements) {
      input.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.handleUpdateClick();
        }
      });
    }
  }

  /** Lanza el evento onUpdateRequested si los parámetros son válidos; muestra error si no. */
  private handleUpdateClick(): void {
    const params = this.readAndValidateParams();
    if (params === null) return;
    this.clearError();
    this.onUpdateRequested.trigger(params);
  }

  /**
   * Lee los valores de los inputs, los valida, y devuelve un objeto TrapezoidParams si todo es correcto.
   * Si hay algún error, muestra el mensaje correspondiente y devuelve null.
   * @returns Un objeto TrapezoidParams con los valores de los inputs si son válidos, o null si hay algún error.
   */
  private readAndValidateParams(): TrapezoidParams | null {
    const expression = this.formInputs.expression.value.trim();
    const trapezoidCount = parseInt(this.formInputs.trapezoids.value, 10);
    const start = parseFloat(this.formInputs.start.value);
    const end = parseFloat(this.formInputs.end.value);

    if (!expression) return this.fail('La expresión no puede estar vacía.');
    if (isNaN(trapezoidCount) || trapezoidCount < 1) return this.fail('El número de trapecios debe ser un entero ≥ 1.');
    if (isNaN(start) || isNaN(end)) return this.fail('Start y End deben ser números válidos.');
    if (start >= end) return this.fail('Start debe ser menor que End.');

    return {expression, trapezoidCount, start, end};
  }

  /**
   * Muestra un mensaje de error y devuelve null.
   * @param message - Texto del error a mostrar.
   * @returns null.
   */
  private fail(message: string): null {
    this.showError(message);
    return null;
  }

  /**
   * Consigue un elemento del DOM por su ID y verifica que es un input.
   * @param elementId - ID del elemento a buscar.
   * @throws {Error} Si el elemento no existe o no es un input.
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
   * Consigue un elemento del DOM por su ID y verifica que es un botón.
   * @param elementId - ID del elemento a buscar.
   * @throws {Error} Si el elemento no existe o no es un botón.
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

  /**
   * Consigue un elemento del DOM por su ID y verifica que es un HTMLElement.
   * @param elementId - ID del elemento a buscar.
   * @throws {Error} Si el elemento no existe.
   */
  private requireElementById(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLElement)) {
      throw new Error(
          `ControlsView: no se encontró #${elementId}.`,
      );
    }
    return element;
  }
}
