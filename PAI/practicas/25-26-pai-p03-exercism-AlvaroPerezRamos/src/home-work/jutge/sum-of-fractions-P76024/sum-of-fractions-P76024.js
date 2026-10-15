/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Sum of fractions
 *    
 * @see {@link https://jutge.org/problems/P76024_en}
 */
'use strict';

let input = '';

/**
 * @description Function that calculates the sum of fractions from the first number to the limit, adding the number to sum in each iteration.
 * @param {number} primerNumero - El primer número de la secuencia de fracciones.
 * @param {number} limite - El límite hasta el cual se sumarán las fracciones.
 * @param {number} numeroASumar - El número que se sumará al primer número en cada iteración para obtener el siguiente número de la secuencia de fracciones.
 * @returns {number} - La suma de las fracciones desde el primer número hasta el límite, sumando el número a sumar en cada iteración.
 */
const sumOfFractions = (primerNumero, limite, numeroASumar) => {
  let suma = 0.0;
  let contador = 0;
  while (primerNumero + contador * numeroASumar <= limite) {
    suma += 1 / (primerNumero + contador * numeroASumar);
    contador++;
  }
  return suma;
};

/**
 * @description Main function that reads the input and prints the sum of fractions for each line.
 * @returns {void}
 */
const main = () => {
  const lines = input.trim().split('\n');
  for (const line of lines) {
    const [primerNumero, limite, numeroASumar] = line.trim().split(/\s+/).map(Number);
    const result = sumOfFractions(primerNumero, limite, numeroASumar);
    console.log(result.toFixed(4));
  }
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);