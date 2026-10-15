/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Polynomial class implementation in TypeScript, following object-oriented design principles. 
 * The Polynomial class represents a polynomial expression and provides methods for evaluating the polynomial at a given value, adding two polynomials together, and multiplying two polynomials. 
 * The class uses an array to store the coefficients of the polynomial, where the index of the coefficient corresponds to the power of x. 
 * For example, the coefficient at index 0 represents the constant term, the coefficient at index 1 represents the linear term, and so on.
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 * @see {@link https://en.wikipedia.org/wiki/Polynomial}
 */

/**
 * @desc Class representing a polynomial expression.
 */
export class Polynomial {
  /**
   * @desc Creates a new Polynomial instance with the given coefficients.
   * @param coefficients An array of numbers representing the coefficients of the polynomial, where the index corresponds to the power of x.
   */
  constructor(private readonly coefficients: number[]) {
    if (!Array.isArray(coefficients) || coefficients.some(coef => typeof coef !== 'number')) {
      throw new Error('Coefficients must be an array of numbers.');
    }
    if (coefficients.length === 0) {
      throw new Error('Coefficients array cannot be empty.');
    }
  }

  /**
   * @desc Represents the polynomial as a string.
   */
  toString(): string {
    let polinomialString = '';
    for (let i = this.coefficients.length - 1; i >= 0; i--) {
      const coefficient = this.coefficients[i];
      if (coefficient !== 0) {
        polinomialString += this.formatTerm(coefficient, i);
      }
    }
    return polinomialString.trim() || '0';
  }

  /**
   * @desc Evealuates the polynomial at a given value of x.
   * @param value The value of x at which to evaluate the polynomial.
   * @return The result of evaluating the polynomial at the given value.
   */
  evaluate(value: number): number {
    return this.coefficients.reduce((acc, coefficient, index) => acc + coefficient * Math.pow(value, index), 0);
  }

  /**
   * @desc Returns a new Polynomial instance representing the opposite of the current polynomial (i.e., all coefficients negated).
   * @return A new Polynomial instance representing the opposite of the current polynomial.
   */
  opposite(): Polynomial {
    const oppositeCoefficients = this.coefficients.map(coefficient => -coefficient);
    return new Polynomial(oppositeCoefficients);
  }

  /**
   * @desc Multiplies the polynomial by a scalar value and returns a new Polynomial instance representing the result.
   * @param scalar The scalar value to multiply the polynomial by.
   * @return A new Polynomial instance representing the result of the scalar multiplication.
   */
  scalarMultiplication(scalar: number): Polynomial {
    const resultCoefficients = this.coefficients.map(coefficient => coefficient * scalar);
    return new Polynomial(resultCoefficients);
  }

  /**
   * @desc Adds two polynomials together and returns a new Polynomial instance representing the sum.
   * @param firstPolynomial The first polynomial to add.
   * @param secondPolynomial The second polynomial to add.
   * @return A new Polynomial instance representing the sum of the two polynomials.
   */
  static sum(firstPolynomial: Polynomial, secondPolynomial: Polynomial): Polynomial {
    const maxLength = Math.max(firstPolynomial.coefficients.length, secondPolynomial.coefficients.length);
    const resultCoefficients = new Array(maxLength).fill(0);

    for (let i = 0; i < maxLength; i++) {
      const firstCoefficient = firstPolynomial.coefficients[i] || 0;
      const secondCoefficient = secondPolynomial.coefficients[i] || 0;
      resultCoefficients[i] = firstCoefficient + secondCoefficient;
    }

    return new Polynomial(resultCoefficients);
  }

  /**
   * @desc Multiplies two polynomials together and returns a new Polynomial instance representing the product.
   * @param firstPolynomial The first polynomial to multiply.
   * @param secondPolynomial The second polynomial to multiply.
   * @return A new Polynomial instance representing the product of the two polynomials.
   */
  static multiply(firstPolynomial: Polynomial, secondPolynomial: Polynomial): Polynomial {
    const resultCoefficients = new Array(firstPolynomial.coefficients.length + secondPolynomial.coefficients.length - 1).fill(0);

    for (let i = 0; i < firstPolynomial.coefficients.length; i++) {
      for (let j = 0; j < secondPolynomial.coefficients.length; j++) {
        resultCoefficients[i + j] += firstPolynomial.coefficients[i] * secondPolynomial.coefficients[j];
      }
    }

    return new Polynomial(resultCoefficients);
  }

  /**
   * @desc Formats a single term of the polynomial for string representation.
   * @param coefficient The coefficient of the term.
   * @param index The index of the coefficient, which corresponds to the power of x.
   * @returns A string representing the term in the polynomial.
   */
  private formatTerm(coefficient: number, index: number): string {
    const sign = coefficient > 0 ? ' + ' : ' - ';
    const absCoefficient = Math.abs(coefficient);
    const variablePart = index === 0 ? '' : `x${index > 1 ? `^${index}` : ''}`;
    return (index === this.coefficients.length - 1 && coefficient > 0)?
      `${absCoefficient}${variablePart}` : `${sign}${absCoefficient}${variablePart}`;
  }

}