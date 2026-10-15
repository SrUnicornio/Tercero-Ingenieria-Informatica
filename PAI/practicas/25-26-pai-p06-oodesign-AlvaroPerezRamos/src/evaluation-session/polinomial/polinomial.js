"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polynomial = void 0;
/**
 * @desc Class representing a polynomial expression.
 */
var Polynomial = /** @class */ (function () {
    /**
     * @desc Creates a new Polynomial instance with the given coefficients.
     * @param coefficients An array of numbers representing the coefficients of the polynomial, where the index corresponds to the power of x.
     */
    function Polynomial(coefficients) {
        this.coefficients = coefficients;
        if (!Array.isArray(coefficients) || coefficients.some(function (coef) { return typeof coef !== 'number'; })) {
            throw new Error('Coefficients must be an array of numbers.');
        }
        if (coefficients.length === 0) {
            throw new Error('Coefficients array cannot be empty.');
        }
    }
    /**
     * @desc Represents the polynomial as a string.
     */
    Polynomial.prototype.toString = function () {
        var polinomialString = '';
        for (var i = this.coefficients.length - 1; i >= 0; i--) {
            var coefficient = this.coefficients[i];
            if (coefficient !== 0) {
                polinomialString += this.formatTerm(coefficient, i);
            }
        }
        return polinomialString.trim() || '0';
    };
    /**
     * @desc Evealuates the polynomial at a given value of x.
     * @param value The value of x at which to evaluate the polynomial.
     * @return The result of evaluating the polynomial at the given value.
     */
    Polynomial.prototype.evaluate = function (value) {
        return this.coefficients.reduce(function (acc, coefficient, index) { return acc + coefficient * Math.pow(value, index); }, 0);
    };
    /**
     * @desc Returns a new Polynomial instance representing the opposite of the current polynomial (i.e., all coefficients negated).
     */
    Polynomial.prototype.opposite = function () {
        var oppositeCoefficients = this.coefficients.map(function (coefficient) { return -coefficient; });
        return new Polynomial(oppositeCoefficients);
    };
    /**
     * @desc Multiplies the polynomial by a scalar value and returns a new Polynomial instance representing the result.
     * @param scalar The scalar value to multiply the polynomial by.
     * @return A new Polynomial instance representing the result of the scalar multiplication.
     */
    Polynomial.prototype.scalarMultiplication = function (scalar) {
        var resultCoefficients = this.coefficients.map(function (coefficient) { return coefficient * scalar; });
        return new Polynomial(resultCoefficients);
    };
    /**
     * @desc Adds two polynomials together and returns a new Polynomial instance representing the sum.
     * @param firstPolynomial The first polynomial to add.
     * @param secondPolynomial The second polynomial to add.
     * @return A new Polynomial instance representing the sum of the two polynomials.
     */
    Polynomial.sum = function (firstPolynomial, secondPolynomial) {
        var maxLength = Math.max(firstPolynomial.coefficients.length, secondPolynomial.coefficients.length);
        var resultCoefficients = new Array(maxLength).fill(0);
        for (var i = 0; i < maxLength; i++) {
            var firstCoefficient = firstPolynomial.coefficients[i] || 0;
            var secondCoefficient = secondPolynomial.coefficients[i] || 0;
            resultCoefficients[i] = firstCoefficient + secondCoefficient;
        }
        return new Polynomial(resultCoefficients);
    };
    /**
     * @desc Multiplies two polynomials together and returns a new Polynomial instance representing the product.
     * @param firstPolynomial The first polynomial to multiply.
     * @param secondPolynomial The second polynomial to multiply.
     * @return A new Polynomial instance representing the product of the two polynomials.
     */
    Polynomial.multiply = function (firstPolynomial, secondPolynomial) {
        var resultCoefficients = new Array(firstPolynomial.coefficients.length + secondPolynomial.coefficients.length - 1).fill(0);
        for (var i = 0; i < firstPolynomial.coefficients.length; i++) {
            for (var j = 0; j < secondPolynomial.coefficients.length; j++) {
                resultCoefficients[i + j] += firstPolynomial.coefficients[i] * secondPolynomial.coefficients[j];
            }
        }
        return new Polynomial(resultCoefficients);
    };
    /**
     * @desc Formats a single term of the polynomial for string representation.
     * @param coefficient The coefficient of the term.
     * @param index The index of the coefficient, which corresponds to the power of x.
     * @returns A string representing the term in the polynomial.
     */
    Polynomial.prototype.formatTerm = function (coefficient, index) {
        var sign = coefficient > 0 ? ' + ' : ' - ';
        var absCoefficient = Math.abs(coefficient);
        var variablePart = index === 0 ? '' : "x".concat(index > 1 ? "^".concat(index) : '');
        return (index === this.coefficients.length - 1 && coefficient > 0) ?
            "".concat(absCoefficient).concat(variablePart) : "".concat(sign).concat(absCoefficient).concat(variablePart);
    };
    return Polynomial;
}());
exports.Polynomial = Polynomial;
