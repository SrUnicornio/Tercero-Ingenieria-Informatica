/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Reverse of sequences
 *   Write a program that, for every given natural number n. folowing with the n first terms of the sequence, prints the n first terms of the sequence in reverse order.
 * @see {@link https://jutge.org/problems/P67268_en}
 */
'use strict';

let input = '';

/**
 * Reverses a sequence of numbers.
 * @param {number[]} sequence - Sequence to reverse.
 * @returns {string} Reversed sequence as a string.
 */
const reverseSequence = (sequence) => {
  return sequence.reverse().join(' ');
};

/**
 * Main program.
 */
const main = () => {
  const lines = input.trim().split('\n');

  for (const line of lines) {
    const values = line.trim().split(/\s+/).map(Number);
    const count = values[0];

    if (count === 0) {
      console.log('');
      continue;
    }

    const sequence = values.slice(1, count + 1);
    const result = reverseSequence(sequence);
    console.log(result);
  }
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
