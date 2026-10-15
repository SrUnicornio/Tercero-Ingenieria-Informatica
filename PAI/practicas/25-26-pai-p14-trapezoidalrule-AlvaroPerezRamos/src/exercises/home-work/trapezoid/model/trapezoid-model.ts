/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-model.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Fachada de la capa Modelo del patrón MVC.
 */

import {
  TrapezoidParams,
  DEFAULT_TRAPEZOID_PARAMS,
} from '../interfaces/trapezoid-params';
import {FunctionEvaluator} from './function-evaluator';
import {
  TrapezoidCalculator,
  TrapezoidResult,
} from './trapezoid-calculator';

/**
 * @interface YRange
 * @description Rango Y calculado a partir del muestreo de la función,
 *   con un margen proporcional para que la curva no quede pegada al borde.
 * @param yMin - Extremo inferior del rango Y con margen.
 * @param yMax - Extremo superior del rango Y con margen.
 */
export interface YRange {
  readonly yMin: number;
  readonly yMax: number;
}

/** Número de puntos usados para estimar el rango Y. */
const Y_RANGE_SAMPLE_COUNT = 200;

/**
 * Margen proporcional añadido al rango Y bruto.
 * Un valor de 0.15 añade un 15 % del span total arriba y abajo.
 */
const Y_RANGE_MARGIN_RATIO = 0.15;

/**
 * Margen mínimo absoluto cuando la función es constante (span = 0),
 * para evitar una escala degenerada.
 */
const Y_RANGE_MIN_MARGIN = 1;

/**
 * Fachada del modelo. El controlador es el único cliente de esta clase.
 * La vista nunca la interroga directamente.
 */
export class TrapezoidModel {
  private currentParams: TrapezoidParams;
  private currentCanvasWidth: number = 0;
  private currentCanvasHeight: number = 0;
  private functionEvaluator: FunctionEvaluator;

  /**
   * @param initialParams - Parámetros iniciales del cálculo (opcional).
   */
  constructor(initialParams: Partial<TrapezoidParams> = {}) {
    this.currentParams = {...DEFAULT_TRAPEZOID_PARAMS, ...initialParams};
    this.functionEvaluator =
      new FunctionEvaluator(this.currentParams.expression);
  }

  /**
   * Evalúa f(x) en el punto dado usando la expresión actual.
   * @param x - Valor de la variable independiente.
   * @returns f(x), o NaN si no está definido en x.
   */
  evaluateAt(x: number): number {
    return this.functionEvaluator.evaluate(x);
  }

  /**
   * Muestrea la función en el intervalo [start, end] y devuelve
   * el rango [yMin, yMax] con margen visual proporcional.
   * El controlador usa este rango para construir el CoordinateDomain.
   * @returns Rango Y con margen.
   */
  computeYRange(): YRange {
    const {start, end} = this.currentParams;
    const step = (end - start) / Y_RANGE_SAMPLE_COUNT;
    const finiteValues: number[] = [];

    for (let sampleIndex = 0; sampleIndex <= Y_RANGE_SAMPLE_COUNT;
      sampleIndex++) {
      const y = this.functionEvaluator.evaluate(start + sampleIndex * step);
      if (isFinite(y)) finiteValues.push(y);
    }

    if (finiteValues.length === 0) {
      return {yMin: -Y_RANGE_MIN_MARGIN, yMax: Y_RANGE_MIN_MARGIN};
    }

    const rawMin = Math.min(...finiteValues);
    const rawMax = Math.max(...finiteValues);
    const span = rawMax - rawMin;
    const margin = span > 0 ?
      span * Y_RANGE_MARGIN_RATIO :
      Y_RANGE_MIN_MARGIN;

    const yMinWithMargin = Math.min(rawMin - margin, 0);
    const yMaxWithMargin = Math.max(rawMax + margin, 0);
    return {yMin: yMinWithMargin, yMax: yMaxWithMargin};
  }

  /**
   * @returns Copia inmutable de los parámetros actuales.
   */
  getParams(): TrapezoidParams {
    return {...this.currentParams};
  }

  /**
   * Actualiza los parámetros y recompila el evaluador si la expresión ha cambiado.
   * @param updates - Campos a modificar.
   * @throws {Error} Si la nueva expresión es inválida.
   */
  setParams(updates: Partial<TrapezoidParams>): void {
    this.currentParams = {...this.currentParams, ...updates};
    if (updates.expression !== undefined) {
      this.functionEvaluator =
        new FunctionEvaluator(this.currentParams.expression);
    }
  }

  /**
   * Sincroniza las dimensiones del canvas para que el controlador
   * pueda construir el CoordinateTransformer en cada redibujado.
   * @param newWidth  - Nuevo ancho del canvas en píxeles.
   * @param newHeight - Nuevo alto del canvas en píxeles.
   */
  updateCanvasDimensions(newWidth: number, newHeight: number): void {
    this.currentCanvasWidth = newWidth;
    this.currentCanvasHeight = newHeight;
  }

  /**
   * @returns Tupla [width, height] de las últimas dimensiones registradas.
   */
  getCanvasDimensions(): [number, number] {
    return [this.currentCanvasWidth, this.currentCanvasHeight];
  }

  /**
   * Aplica la regla del trapecio compuesta con los parámetros actuales
   * y devuelve el área total y los puntos de división para el renderer.
   * @returns Resultado del cálculo: área total y puntos de división.
   */
  computeArea(): TrapezoidResult {
    const {start, end, trapezoidCount} = this.currentParams;
    const calculator = new TrapezoidCalculator();
    return calculator.compute(
        start, end, trapezoidCount,
        (x) => this.functionEvaluator.evaluate(x),
    );
  }
}
