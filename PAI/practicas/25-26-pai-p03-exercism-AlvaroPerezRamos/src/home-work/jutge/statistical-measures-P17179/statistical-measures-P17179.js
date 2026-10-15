/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Statistical measures
 *   Write a program that reads non-empty sequences of real numbers and, 
 *   for each sequence, prints its minimum, its maximum and its average.
 * @see {@link https://jutge.org/problems/P17179_en}
 */
'use strict';

let input = '';

/**
 * Calculates the minimum, maximum and average of a sequence of numbers.
 * @param {number[]} sequence - The sequence of numbers.
 * @returns {Object} An object containing the minimum, maximum and average of the sequence.
 */
const calculateStatistics = (sequence) => {
  const min = Math.min(...sequence);
  const max = Math.max(...sequence);
  const avg = sequence.reduce((sum, num) => sum + num, 0) / sequence.length;
  return { min, max, avg };
};

/**
 * Main program that reads input and calculates statistics for each sequence.
 */
const main = () => {
  const values = input.trim().split(/\s+/).map(Number);
  let index = 0;

  const sequencesCount = values[index];
  index++;

  for (let i = 0; i < sequencesCount; i++) {
    const count = values[index];
    index++;

    const sequence = values.slice(index, index + count);
    index += count;

    const { min, max, avg } = calculateStatistics(sequence);
    console.log(
      `${min.toFixed(4)} ${max.toFixed(4)} ${avg.toFixed(4)}`
    );
  }
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);