/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file lissajous-model.ts
 * @description Modelo (capa M del patrón MVC) de la curva de Lissajous.
 *   Almacena los parámetros actuales, calcula los puntos de la curva
 *   y gestiona la animación automática del desfase.
 *   No conoce el Canvas, el DOM ni la Vista.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { LissajousParams, DEFAULT_LISSAJOUS_PARAMS } from '../interfaces/lissajous-params.js';
import { LissajousPoint } from '../interfaces/lissajous-point.js';

export { LissajousParams, LissajousPoint };

/** Incremento del desfase por frame cuando la animación está activa. */
const PHASE_ANIMATION_STEP = 0.005;

/** Número de puntos calculados para trazar la curva. Mayor → más suave. */
const CURVE_POINT_COUNT = 2000;

/**
 * @class LissajousModel
 * @classdesc
 *   Calcula puntos de la curva de Lissajous y gestiona la animación del desfase.
 *   `getParams()` devuelve siempre una copia defensiva del estado interno.
 *
 * @example
 * ```typescript
 * const model = new LissajousModel();
 * model.setParams({ frequencyX: 3, frequencyY: 2 });
 * const points = model.computeCurvePoints();
 * model.advancePhaseAnimation();
 * ```
 */
export class LissajousModel {
  private currentParams: LissajousParams;

  /**
   * @constructor
   * @param initialParams - Campos opcionales; el resto toma los valores por defecto.
   */
  constructor(initialParams: Partial<LissajousParams> = {}) {
    this.currentParams = { ...DEFAULT_LISSAJOUS_PARAMS, ...initialParams };
  }

  // ---------------------------------------------------------------------------
  // Parámetros
  // ---------------------------------------------------------------------------

  /**
   * @method getParams
   * @description Devuelve una copia inmutable de los parámetros actuales.
   * @returns Copia inmutable de los parámetros actuales. */
  getParams(): LissajousParams {
    return { ...this.currentParams };
  }

  /**
   * @method setParams
   * @description Actualiza los parámetros de forma parcial.
   * @param updates - Campos a modificar; el resto permanece sin cambios.
   */
  setParams(updates: Partial<LissajousParams>): void {
    this.currentParams = { ...this.currentParams, ...updates };
  }

  // ---------------------------------------------------------------------------
  // Cálculo matemático
  // ---------------------------------------------------------------------------

  /**
   * @method computeCurvePoints
   * @description
   * Calcula los puntos de la curva en coordenadas normalizadas [-1, 1].
   *
   * Ecuaciones paramétricas (t ∈ [0, 2π]):
   *   x(t) = sin(frequencyX · t + phaseShift · π)
   *   y(t) = sin(frequencyY · t)
   *
   * @returns Array de puntos normalizados de la curva.
   */
  computeCurvePoints(): readonly LissajousPoint[] {
    const { frequencyX, frequencyY, phaseShift } = this.currentParams;
    const phaseShiftRadians = phaseShift * Math.PI;
    const points: LissajousPoint[] = [];

    for (let step = 0; step <= CURVE_POINT_COUNT; step++) {
      const parameterT = (step / CURVE_POINT_COUNT) * 2 * Math.PI;
      points.push({
        x: Math.sin(frequencyX * parameterT + phaseShiftRadians),
        y: Math.sin(frequencyY * parameterT),
      });
    }

    return points;
  }

  // ---------------------------------------------------------------------------
  // Animación
  // ---------------------------------------------------------------------------

  /**
   * Incrementa el desfase en {@link PHASE_ANIMATION_STEP} si la animación está activa,
   * manteniéndolo en [0, 2). Debe llamarse una vez por frame.
   */
  advancePhaseAnimation(): void {
    if (!this.currentParams.isPhaseAnimated) return;
    const updatedPhase = (this.currentParams.phaseShift + PHASE_ANIMATION_STEP) % 2;
    this.currentParams = { ...this.currentParams, phaseShift: updatedPhase };
  }
}