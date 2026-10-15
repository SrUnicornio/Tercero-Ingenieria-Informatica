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
 */

import { Polynomial } from './polinomial.js';

function main() {
  console.log('Polynomial 1:'); 
  const polynomial1 = new Polynomial([5, -7, 0, 4]);
  console.log(polynomial1.toString());
  console.log('Evaluate polynomial 1 at point 0:', polynomial1.evaluate(1));

  console.log('Polynomial 2:');
  const polynomial2 = new Polynomial([1, 3, 0, 0, 0, 2]);
  console.log(polynomial2.toString());
  console.log('Evaluate polynomial 2 at point 0:', polynomial2.evaluate(0));

  console.log('Sum of both polynomials:');
  const sum = Polynomial.sum(polynomial1, polynomial2);
  console.log(sum.toString());

  console.log('Multiplication of both polynomials:');
  const multiplication = Polynomial.multiply(polynomial1, polynomial2);
  console.log(multiplication.toString());
  
  console.log('Opposite of polynomial 1:');
  const opposite = polynomial1.opposite();
  console.log(opposite.toString());

  console.log('Opposite of polynomial 2:');
  const opposite2 = polynomial2.opposite();
  console.log(opposite2.toString());

  console.log('Scalar multiplication of polynomial 1 by 3:');
  const scalarMultiplication1 = polynomial1.scalarMultiplication(3);
  console.log(scalarMultiplication1.toString());

  console.log('Scalar multiplication of polynomial 1 by 0:');
  const scalarMultiplication01 = polynomial1.scalarMultiplication(0);
  console.log(scalarMultiplication01.toString());

  console.log('Scalar multiplication of polynomial 2 by -2:');
  const scalarMultiplication2 = polynomial2.scalarMultiplication(-2);
  console.log(scalarMultiplication2.toString());

  console.log('Scalar multiplication of polynomial 2 by 0:');
  const scalarMultiplication02 = polynomial2.scalarMultiplication(0);
  console.log(scalarMultiplication02.toString());

}

main();