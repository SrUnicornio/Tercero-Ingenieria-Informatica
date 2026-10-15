/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file App.ts
 * @description
 *   Fachada principal de la aplicación (patrón Facade).
 *
 *   Oculta al cliente (`main.ts`) toda la lógica interna:
 *    - Instanciación del sistema de coordenadas y sus dependencias.
 *    - Gestión del DOM (canvas, input, botón).
 *    - Ciclo de renderizado (cuadrícula primero, función después).
 *    - Manejo de errores de expresiones inválidas.
 *
 *   El cliente solo necesita crear una instancia y llamar a {@link App.start}.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  March 2026
 */

import { CartesianCoordinateSystem } from './coordinate.js';
import { ExpressionFunction } from './math-functions.js';

/** Configuración mínima que el cliente debe conocer para crear la App. */
export interface AppConfig {
  /** id del elemento `<canvas>` en el DOM. */
  canvasId: string;
  /** id del `<input>` donde el usuario escribe la función. */
  inputId: string;
  /** id del `<button>` que dispara el renderizado. */
  buttonId: string;
  /** Expresión matemática que se representa al cargar la página. */
  defaultExpression: string;
}

/**
 * @class App
 * @classdesc
 *   Fachada de la aplicación de representación de funciones.
 *
 *   Encapsula la inicialización y el ciclo de vida completo:
 *   cuadrícula → función. El cliente solo llama a {@link start}.
 *
 * @example
 * ```typescript
 * const app = new App({
 *   canvasId:          'functionCanvas',
 *   inputId:           'functionInput',
 *   buttonId:          'renderButton',
 *   defaultExpression: 'sin(x)',
 * });
 * app.start();
 * ```
 */
export class App {
  /** Sistema de coordenadas cartesianas (cuadrícula + ejes + plotter). */
  private readonly coordinateSystem: CartesianCoordinateSystem;

  /** Campo de texto donde el usuario escribe la expresión. */
  private readonly functionInput: HTMLInputElement;

  /** Botón que dispara el renderizado. */
  private readonly renderButton: HTMLButtonElement;

  /** Expresión que se usa al arrancar (hardcoded). */
  private readonly defaultExpression: string;

  /**
   * @constructor
   * @description
   *   Inicializa todos los colaboradores internos.
   *   Lanza excepción si algún elemento del DOM no existe o es del tipo
   *   incorrecto, para detectar errores de configuración en el arranque.
   *
   * @param config - Configuración mínima de la aplicación.
   * @throws {Error} Si el canvas, el input o el botón no existen en el DOM.
   */
  constructor(config: AppConfig) {
    this.coordinateSystem = new CartesianCoordinateSystem(config.canvasId);
    this.functionInput = this.requireInput(config.inputId);
    this.renderButton = this.requireButton(config.buttonId);
    this.defaultExpression = config.defaultExpression;
  }

  /**
   * @method start
   * @description
   *   Arranca la aplicación:
   *    1. Dibuja la cuadrícula con la expresión por defecto.
   *    2. Registra los listeners del botón y del teclado.
   *
   *   Es el único método que el cliente necesita llamar.
   */
  start(): void {
    this.drawGrid();
    this.drawFunction(this.defaultExpression);
    this.registerEvents();
  }

  /**
   * @method drawGrid
   * @description
   *   Renderiza la cuadrícula y los ejes cartesianos.
   *   Se llama siempre antes de dibujar la función para limpiar el canvas.
   */
  private drawGrid(): void {
    this.coordinateSystem.render();
  }

  /**
   * @method drawFunction
   * @description
   *   Intenta parsear y dibujar la función matemática sobre la cuadrícula
   *   ya renderizada. Si la expresión es inválida muestra un mensaje de
   *   error sin romper la aplicación (la cuadrícula permanece visible).
   *
   * @param expression - Expresión matemática, ej: `"sin(x)"`, `"x^2"`.
   */
  private drawFunction(expression: string): void {
    try {
      const supraidex = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
      for (let i = 0; i < supraidex.length; i++) {
        const regex = new RegExp(supraidex[i], 'g');
        expression = expression.replace(regex, `^${i}`);
      }
      const mathFunction = new ExpressionFunction(expression);
      this.coordinateSystem.plotFunction(mathFunction);
    } catch {
      // La cuadrícula ya está pintada; solo avisamos al usuario.
      alert(`Expresión no válida: "${expression}"`);
    }
  }

  /**
   * @method registerEvents
   * @description
   *   Conecta los eventos del botón y del campo de texto a los métodos
   *   internos de la aplicación. El cliente no conoce estos detalles.
   *
   *   Al hacer clic (o pulsar Enter): redibuja cuadrícula y luego función.
   */
  private registerEvents(): void {
    this.renderButton.addEventListener('click', () => {
      const expression = this.functionInput.value.trim();
      if (expression.length > 0) {
        this.drawGrid();
        this.drawFunction(expression);
      }
    });

    this.functionInput.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.renderButton.click();
      }
    });
  }

  /**
   * @method requireInput
   * @description
   *   Obtiene un `<input>` del DOM por su id y lanza excepción si no existe.
   *
   * @param id - Valor del atributo `id` del elemento.
   * @returns El elemento `HTMLInputElement` encontrado.
   * @throws {Error} Si el elemento no existe o no es un `<input>`.
   */
  private requireInput(id: string): HTMLInputElement {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLInputElement)) {
      throw new Error(`No se encontró <input id="${id}"> en el DOM.`);
    }
    return element;
  }

  /**
   * @method requireButton
   * @description
   *   Obtiene un `<button>` del DOM por su id y lanza excepción si no existe.
   *
   * @param id - Valor del atributo `id` del elemento.
   * @returns El elemento `HTMLButtonElement` encontrado.
   * @throws {Error} Si el elemento no existe o no es un `<button>`.
   */
  private requireButton(id: string): HTMLButtonElement {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLButtonElement)) {
      throw new Error(`No se encontró <button id="${id}"> en el DOM.`);
    }
    return element;
  }
}