/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file function-evaluator.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Adaptador que convierte una expresión matemática en string en una
 *   función evaluable, usando mathjs como motor (igual que en P09).
 *   La expresión se compila una única vez en el constructor para
 *   no recompilar en cada evaluación durante el muestreo.
 */

// @ts-ignore — el navegador resuelve esta URL en runtime.
import * as math from 'https://cdn.jsdelivr.net/npm/mathjs@13/+esm';

/**
 * Subconjunto mínimo de la API de mathjs que esta aplicación consume.
 * Se declara localmente para evitar depender de los tipos del paquete
 * npm cuando se importa desde CDN.
 */
export interface EvalFunction {
  /** @param scope - Variables del ámbito, ej: `{ x: 2 }`. */
  evaluate(scope: Record<string, number>): number;
}

/** Subconjunto mínimo de la API estática de mathjs. */
export interface MathJsStatic {
  /**
   * @param expression - Expresión en notación mathjs, ej: `"sin(x)"`.
   * @throws {Error} Si la expresión contiene errores de sintaxis.
   */
  compile(expression: string): EvalFunction;
}

/**
 * Compila y evalúa una expresión matemática con mathjs.
 * Devuelve NaN si el resultado no es un número finito (asíntotas,
 * divisiones por cero, etc.), de forma que el llamador pueda
 * decidir cómo tratarlo.
 */
export class FunctionEvaluator {
  private readonly compiledExpression: EvalFunction;

  /**
   * @param expression - Expresión matemática evaluable por mathjs,
   *   ej: `"x^2 + 1"`, `"sin(x)"`, `"1/x"`.
   * @throws {Error} Si la expresión tiene errores de sintaxis.
   */
  constructor(private readonly expression: string) {
    try {
      this.compiledExpression =
        (math as unknown as MathJsStatic).compile(expression);
    } catch {
      throw new Error(
          `FunctionEvaluator: expresión inválida: "${expression}".`,
      );
    }
  }

  /**
   * Evalúa f(x) en el punto dado usando la expresión actual.
   * @param x - Valor de la variable independiente.
   * @returns f(x) como número, o NaN si no está definido en x.
   */
  evaluate(x: number): number {
    try {
      const result: number = this.compiledExpression.evaluate({x});
      return isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  }

  /** @returns La expresión original introducida. */
  getExpression(): string {
    return this.expression;
  }
}
