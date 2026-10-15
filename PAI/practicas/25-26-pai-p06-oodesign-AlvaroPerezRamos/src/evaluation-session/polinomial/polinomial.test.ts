/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Tic Tac Toe game implementation in TypeScript, following object-oriented design principles.
 * The TicTacToe class manages the game state, including the game board, current player, and winner. It provides methods for making moves, checking for wins and draws, and retrieving the current state of the game.
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 */

import { describe, beforeEach, test, expect } from '@jest/globals';
import { Polynomial } from './polinomial';

describe('Polynomial', () => {
  let polynomial: Polynomial;
  let polynomial2: Polynomial;
  let polynomial3: Polynomial;

  beforeEach(() => {
    polynomial = new Polynomial([5, -7, 0, 4]);
    polynomial2 = new Polynomial([0, 0, 0]);
    polynomial3 = new Polynomial([0, 2, 0, -3]);
  });

  describe('constructor', () => {
    test('should create a polynomial with given coefficients', () => {
      expect(polynomial).toBeInstanceOf(Polynomial);
    });
    
    test('should throw an error if coefficients are not an array of numbers', () => {
      expect(() => new Polynomial('not an array' as unknown as number[])).toThrow('Coefficients must be an array of numbers.');
      expect(() => new Polynomial([1, 'not a number' as unknown as number])).toThrow('Coefficients must be an array of numbers.');
    });

    test('should throw an error if coefficients array is empty', () => {
      expect(() => new Polynomial([])).toThrow('Coefficients array cannot be empty.');
    });
  });
  
  describe('toString', () => {
    test('should return the correct string representation of the polynomial', () => {
      expect(polynomial.toString()).toBe('4x^3 - 7x + 5');
    });

    test('should return the correct string representation of the polynomial', () => {
      expect(polynomial2.toString()).toBe('0');
    });

    test('should return the correct string representation of the polynomial', () => {
      expect(polynomial3.toString()).toBe('- 3x^3 + 2x');
    });
  });

  describe('evaluate', () => {
    const value = 2;
    test('should evaluate the polynomial at a given value', () => {
      const expectedValue = 5 - 7 * value + 0 * Math.pow(value, 2) + 4 * Math.pow(value, 3);
      expect(polynomial.evaluate(value)).toBe(expectedValue);
    });

    test('should evaluate the polynomial at a given value', () => {
      expect(polynomial2.evaluate(value)).toBe(0);
    });

    test('should evaluate the polynomial at a given value', () => {
      const expectedValue = -3 * Math.pow(value, 3) + 2 * value;
      expect(polynomial3.evaluate(value)).toBe(expectedValue);
    });
  });

  describe('sum', () => {
    test('should return a new polynomial that is the sum of two polynomials', () => {
      const sumPolynomial = Polynomial.sum(polynomial, polynomial3);
      expect(sumPolynomial.toString()).toBe('1x^3 - 5x + 5');
    });

    test('should return a new polynomial that is the sum of two polynomials', () => {
      const sumPolynomial = Polynomial.sum(polynomial2, polynomial3);
      expect(sumPolynomial.toString()).toBe('- 3x^3 + 2x');
    });
  });

  describe('multiply', () => {
    test('should return a new polynomial that is the product of two polynomials', () => {
      const productPolynomial = Polynomial.multiply(polynomial, polynomial3);
      expect(productPolynomial.toString()).toBe('- 12x^6 + 29x^4 - 15x^3 - 14x^2 + 10x');
    });

    test('should return a new polynomial that is the product of two polynomials', () => {
      const productPolynomial = Polynomial.multiply(polynomial2, polynomial3);
      expect(productPolynomial.toString()).toBe('0');
    });
  });

  describe('opposite', () => {
    test('should return a new polynomial that is the opposite of the current polynomial', () => {
      const oppositePolynomial = polynomial.opposite();
      expect(oppositePolynomial.toString()).toBe('- 4x^3 + 7x - 5');
    });

    test('should return a new polynomial that is the opposite of the current polynomial', () => {
      const oppositePolynomial = polynomial2.opposite();
      expect(oppositePolynomial.toString()).toBe('0');
    });

    test('should return a new polynomial that is the opposite of the current polynomial', () => {
      const oppositePolynomial = polynomial3.opposite();
      expect(oppositePolynomial.toString()).toBe('3x^3 - 2x');
    });
  });

  describe('scalarMultiplication', () => {
    const scalarValue = 3;
    test('should return a new polynomial that is the result of multiplying the polynomial by a scalar', () => {
      const scalarMultiplicationPolynomial = polynomial.scalarMultiplication(scalarValue);
      expect(scalarMultiplicationPolynomial.toString()).toBe('12x^3 - 21x + 15');
    });

    test('should return a new polynomial that is the result of multiplying the polynomial by a scalar', () => {
      const scalarMultiplicationPolynomial = polynomial2.scalarMultiplication(scalarValue);
      expect(scalarMultiplicationPolynomial.toString()).toBe('0');
    });

    test('should return a new polynomial that is the result of multiplying the polynomial by a scalar', () => {
      const scalarValue2 = -2;
      const scalarMultiplicationPolynomial = polynomial3.scalarMultiplication(scalarValue2);
      expect(scalarMultiplicationPolynomial.toString()).toBe('6x^3 - 4x');
    });
  });
});