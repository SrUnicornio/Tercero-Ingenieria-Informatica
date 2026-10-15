/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file math-functions.ts
 * @description
 *   Modelo de funciones matemáticas evaluables.
 *
 *   El navegador no puede resolver especificadores bare como 'mathjs'
 *   en módulos ES nativos (sin bundler). Por eso mathjs se importa
 *   desde CDN usando una URL completa, que el navegador resuelve.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  March 2026
 */

// @ts-ignore — el navegador resuelve esta URL en runtime.
// TypeScript no puede verificar módulos CDN, pero los tipos
// se modelan localmente con las interfaces de abajo.
import * as math from 'https://cdn.jsdelivr.net/npm/mathjs@13/+esm';

/**
 * @interface EvalFunction
 * @description
 *   Subconjunto mínimo de la API de mathjs que esta aplicación consume.
 *   Modela el objeto devuelto por `math.compile()`.
 */
interface EvalFunction {
  /**
   * Evalúa la expresión compilada en el ámbito dado.
   *
   * @param scope - Variables del ámbito de evaluación, ej: `{ x: 2 }`.
   * @returns El resultado numérico de la evaluación.
   */
  evaluate(scope: Record<string, number>): number;
}

/**
 * @interface MathJsStatic
 * @description
 *   Subconjunto mínimo de la API estática de mathjs que se usa en
 *   esta aplicación: únicamente el método `compile`.
 */
interface MathJsStatic {
  /**
   * Parsea y compila una expresión matemática.
   *
   * @param expression - Expresión en notación mathjs, ej: `"sin(x)"`.
   * @returns Un objeto {@link EvalFunction} listo para ser evaluado.
   * @throws {Error} Si la expresión contiene errores de sintaxis.
   */
  compile(expression: string): EvalFunction;
}

/**
 * @interface MathFunction
 * @description
 *   Contrato para cualquier función matemática evaluable.
 *   Permite desacoplar el resto del sistema de la implementación concreta.
 */
export interface MathFunction {
  /**
   * Evalúa la función en un valor dado de x.
   *
   * @param x - Valor de entrada.
   * @returns Resultado numérico, o NaN si la función no está definida en x.
   */
  evaluate(x: number): number;

  /**
   * Devuelve la expresión original tal como fue introducida.
   *
   * @returns La cadena de texto de la expresión, ej: `"sin(x)"`.
   */
  getExpression(): string;
}

/**
 * @class ExpressionFunction
 * @classdesc
 *   Adaptador que convierte una expresión matemática en string
 *   en una {@link MathFunction} evaluable, usando mathjs como motor.
 *
 *   La expresión se compila una única vez en el constructor para
 *   maximizar el rendimiento durante el muestreo de la función.
 *
 * @example
 * ```typescript
 * const f = new ExpressionFunction('sin(x)');
 * f.evaluate(Math.PI / 2); // 1
 * f.evaluate(Math.PI);     // ~0
 * ```
 */
export class ExpressionFunction implements MathFunction {
  /**
   * Expresión compilada por mathjs, tipada con la interfaz local
   * {@link EvalFunction} en lugar de `any`.
   */
  private readonly compiledExpression: EvalFunction;

  /**
   * @constructor
   * @param expression - Expresión matemática válida para mathjs,
   *                     ej: `"sin(x)"`, `"x^2 + 1"`, `"exp(x)"`.
   * @throws {Error} Si la expresión tiene errores de sintaxis.
   */
  constructor(private readonly expression: string) {
    try {
      // Casteamos `math` a nuestra interfaz local MathJsStatic.
      // Esto es seguro: usamos exactamente los métodos que declaramos.
      this.compiledExpression = (math as unknown as MathJsStatic)
        .compile(this.expression);
    } catch {
      throw new Error(`Expresión matemática inválida: "${this.expression}"`);
    }
  }

  /**
   * @method evaluate
   * @description
   *   Evalúa la expresión compilada en el valor x dado.
   *   Devuelve NaN si el resultado no es un número finito.
   *
   * @param x - Valor de la variable independiente.
   * @returns f(x) como número, o NaN si no está definido.
   */
  evaluate(x: number): number {
    try {
      const result: number = this.compiledExpression.evaluate({ x });
      return isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  }

  /**
   * @method getExpression
   * @description Devuelve la expresión original introducida por el usuario.
   * @returns La cadena de texto de la expresión.
   */
  getExpression(): string {
    return this.expression;
  }
}