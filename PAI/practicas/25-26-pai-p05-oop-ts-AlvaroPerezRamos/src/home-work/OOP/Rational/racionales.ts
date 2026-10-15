/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * Clase Racional — implementación siguiendo principios SOLID.
 *
 * @author Álvaro Pérez Ramos
 * @since 24 FEB 2026
 */

/**
 * Representa un número racional p/q.
 * La instancia es inmutable.
 */
export class Racional {
  private readonly numerator: number;
  private readonly denominator: number;

  /**
   * Construye un número racional simplificado.
   *
   * @param numerator Numerador
   * @param denominator Denominador (por defecto 1)
   */
  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error('El denominador no puede ser 0');
    }

    // Normalización del signo
    if (denominator < 0) {
      numerator *= -1;
      denominator *= -1;
    }

    const greatestCommonDivisor =
      computeGreatestCommonDivisor(numerator, denominator);

    this.numerator = numerator / greatestCommonDivisor;
    this.denominator = denominator / greatestCommonDivisor;
  }

  // Getters para acceder a los componentes del número racional
  getNumerator(): number {
    return this.numerator;
  }

  getDenominator(): number {
    return this.denominator;
  }

  // Calculos aritméticos que devuelven nuevos objetos Racional sin modificar los existentes

  add(other: Racional): Racional {
    return new Racional(
      this.numerator * other.denominator +
      other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  subtract(other: Racional): Racional {
    return new Racional(
      this.numerator * other.denominator -
      other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  multiply(other: Racional): Racional {
    return new Racional(
      this.numerator * other.numerator,
      this.denominator * other.denominator,
    );
  }

  divide(other: Racional): Racional {
    if (other.numerator === 0) {
      throw new Error('No se puede dividir entre 0');
    }

    return new Racional(
      this.numerator * other.denominator,
      this.denominator * other.numerator,
    );
  }

  /* ---------------- COMPARISON ---------------- */

  compare(other: Racional): number {
    const leftSide = this.numerator * other.denominator;
    const rightSide = other.numerator * this.denominator;

    if (leftSide === rightSide) return 0;
    return leftSide < rightSide ? -1 : 1;
  }

  equals(other: Racional): boolean {
    return this.compare(other) === 0;
  }

  lessThan(other: Racional): boolean {
    return this.compare(other) < 0;
  }

  greaterThan(other: Racional): boolean {
    return this.compare(other) > 0;
  }

  /* ---------------- REPRESENTATION ---------------- */

  toString(): string {
    return this.denominator === 1
      ? `${this.numerator}`
      : `${this.numerator}/${this.denominator}`;
  }
}

/**
 * Convierte una cadena en un número racional.
 * Formatos válidos:
 *   "a/b"
 *   "a"
 * 
 * @param text - Cadena a convertir
 * @returns Un objeto Racional representando el número racional
 * @throws Error si el formato es incorrecto o si los valores no son enteros
 */
export function parseRational(text: string): Racional {
  const parts = text.trim().split('/');

  if (parts.length < 1 || parts.length > 2) {
    throw new Error(
      'Formato incorrecto. Use "numerador/denominador" o "numerador"',
    );
  }

  const numerator = Number(parts[0]);
  const denominator =
    parts.length === 2 ? Number(parts[1]) : 1;

  if (!Number.isInteger(numerator) ||
    !Number.isInteger(denominator)) {
    throw new Error('Los valores deben ser enteros');
  }

  return new Racional(numerator, denominator);
}

/**
 * Calcula el máximo común divisor usando el algoritmo de Euclides.
 * 
 * @param firstInteger - Primer número entero
 * @param secondInteger - Segundo número entero
 * @returns El máximo común divisor de los dos números enteros
 */
function computeGreatestCommonDivisor(
  firstInteger: number,
  secondInteger: number,
): number {
  let dividend = Math.abs(firstInteger);
  let divisor = Math.abs(secondInteger);

  while (divisor !== 0) {
    [dividend, divisor] = [
      divisor,
      dividend % divisor,
    ];
  }

  return dividend;
}