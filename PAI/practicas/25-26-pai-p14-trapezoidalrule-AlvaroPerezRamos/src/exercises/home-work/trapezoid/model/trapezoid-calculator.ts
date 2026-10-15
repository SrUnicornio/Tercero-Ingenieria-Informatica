/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-calculator.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Cálculo puro de la regla del trapecio.
 *
 *   La regla del trapecio compuesta:
 *     h = (end - start) / n
 *     Área ≈ h/2 · [f(x₀) + 2·f(x₁) + ... + 2·f(xₙ₋₁) + f(xₙ)]
 *
 *   Los puntos de división incluyen los extremos del intervalo para
 *   que el renderer pueda dibujar el primero y el último.
 */

import {EvaluateAt} from '../observer/event';

/**
 * @interface TrapezoidPoint
 * @description Par (x, y) de un vértice superior de un trapecio.
 * @param x - Coordenada X matemática.
 * @param y - Valor de la función f(x).
 */
export interface TrapezoidPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * @interface TrapezoidResult
 * @description Resultado del cálculo de la regla del trapecio.
 * @param totalArea - Área total aproximada (suma algebraica: negativa bajo el eje X).
 *  El signo refleja si el área neta es positiva o negativa.
 * @param divisionPoints - Puntos de división incluyendo los extremos.
 *   Longitud: trapezoidCount + 1.
 */
export interface TrapezoidResult {
  readonly totalArea: number;
  readonly divisionPoints: readonly TrapezoidPoint[];
}

/**
 *   Calcula el área bajo f(x) en [start, end] usando la regla del
 *   trapecio compuesta con n subintervalos.
 */
export class TrapezoidCalculator {
  /**
   * Aplica la regla del trapecio compuesta y devuelve el área total y los puntos de división.
   * @param start - Extremo izquierdo del intervalo.
   * @param end - Extremo derecho del intervalo.
   * @param trapezoidCount - Número de subintervalos (n ≥ 1).
   * @param evaluateAt - Callback que evalúa f(x).
   * @returns Área total y puntos de división.
   */
  compute(
      start: number,
      end: number,
      trapezoidCount: number,
      evaluateAt: EvaluateAt,
  ): TrapezoidResult {
    const stepWidth = (end - start) / trapezoidCount;
    const divisionPoints: TrapezoidPoint[] = [];

    for (let index = 0; index <= trapezoidCount; index++) {
      const x = start + index * stepWidth;
      const y = evaluateAt(x);
      divisionPoints.push({x, y: isFinite(y) ? y : 0});
    }

    let sum = divisionPoints[0].y + divisionPoints[trapezoidCount].y;
    for (let index = 1; index < trapezoidCount; index++) {
      sum += 2 * divisionPoints[index].y;
    }
    const totalArea = (stepWidth / 2) * sum;

    return {totalArea, divisionPoints};
  }
}
