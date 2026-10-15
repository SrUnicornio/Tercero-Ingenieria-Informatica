/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file control-binding.ts
 * @description
 *   Interfaz que describe la correspondencia entre un elemento del DOM
 *   y una propiedad del modelo `LissajousParams`.
 *   Usada por `BaseControlsGroup` para registrar listeners de forma genérica.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { LissajousParams } from './lissajous-params.js';

/**
 * @interface ControlBinding
 * @description Define la correspondencia entre un elemento del DOM y
 * una propiedad del modelo `LissajousParams`.
 */
export interface ControlBinding {
  /** Identificador del elemento HTML. */
  id: string;

  /** Propiedad del modelo asociada al control. */
  param: keyof LissajousParams;

  /** Función de parseo del valor introducido (parseInt o parseFloat). */
  parseFn: (value: string, radix?: number) => number;

  /** Valor mínimo permitido. */
  min: number;

  /** Valor máximo permitido. */
  max: number;

  /** Función opcional para formatear el valor al sincronizarlo con el DOM. */
  formatter?: (value: number) => string;
}