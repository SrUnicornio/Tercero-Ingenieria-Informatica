/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trapezoid-params.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Parámetros lógicos que definen el estado del modelo de la calculadora
 *   de áreas por la regla del trapecio.
 *   Todos los campos son de solo lectura: el modelo produce una nueva
 *   copia al actualizar, nunca muta el objeto existente.
 */

/**
 * @interface TrapezoidParams
 * @description Estado completo del cálculo de la regla del trapecio.
 *   Representa la expresión matemática, el intervalo de integración y
 *   el número de trapecios.
 * @param expression - Expresión matemática como cadena evaluable por mathjs (p.ej. "x^2 + 1").
 * @param start - Extremo inferior del intervalo de integración [start, end].
 * @param end - Extremo superior del intervalo de integración [start, end].
 * @param trapezoidCount - Número de trapecios en los que se divide el intervalo.
 */
export interface TrapezoidParams {
  readonly expression: string;
  readonly start: number;
  readonly end: number;
  readonly trapezoidCount: number;
}

/**
 * @description Valores iniciales que coinciden con los del HTML
 *   (expression="x^2 + 1", start=0, end=2, trapezoids=4).
 */
export const DEFAULT_TRAPEZOID_PARAMS: TrapezoidParams = {
  expression: 'x^2 + 1',
  start: 0,
  end: 2,
  trapezoidCount: 4,
};
