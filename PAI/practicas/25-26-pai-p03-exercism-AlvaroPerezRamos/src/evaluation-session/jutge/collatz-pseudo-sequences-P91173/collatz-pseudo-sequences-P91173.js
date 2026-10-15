/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Collatz pseudo-sequences. Jutge P91173
 *  
 * @see {@link https://jutge.org/problems/P91173_en}
 */

'use strict';

/**
 * Compute the the Collatz sequence until a term is repeated.
 * @param {number} sumationEven - The sum of the even terms in the sequence.
 * @param {number} sumationOdd - The sum of the odd terms in the sequence.
 * @param {number} numberComputed - The number of terms computed so far.
 * @returns {Set, number} The Collatz sequence and the number of terms in the cycle.
 */
const computeCollatzSequence = (sumationEven, sumationOdd, numberComputed) => {
  let currentTerm = numberComputed;
  const seenTerms = new Set();
  while (!seenTerms.has(currentTerm)) {
    seenTerms.add(currentTerm);
    if (currentTerm % 2 === 0) {
      currentTerm = currentTerm / 2 + sumationEven;
    } else {
      currentTerm = 3 * currentTerm + sumationOdd;
    }
  }
  return [seenTerms, currentTerm];
}

/**
 * Says the result of the Collatz sequence length computation.
 * @param {Set} sequence - The Collatz sequence length.
 * @param {number} cycleNumber - The number of terms in the cycle.
 * @return {number} The result of the Collatz sequence length computation.
 */
const cycleLength = (sequence, cycleNumber) => {
  let cycleLength = 0;
  const maxTerm = 10 ** 6;
  if (sequence.size === 0) {
    return cycleNumber;
  }
  for (const term of sequence) {
    if (term > maxTerm) {
      return term;
    }
    if (term === cycleNumber) {
      cycleLength = 0;
    }
    if (cycleLength >= 0) {
      cycleLength++;
    }
  }
  return cycleLength;
}

/**
 * Main function to read input and compute the Collatz sequence length.
 */
const main = () => {
  const inputs = require('fs').readFileSync('/dev/stdin', 'utf-8').trim().split('\n');
  for (const input of inputs) {
    if (input === '0 0 0') {
      break;
    }
    let inputValues = input.split(' ');
    const sumationEven = parseInt(inputValues[0]);
    const sumationOdd = parseInt(inputValues[1]);
    const numberComputed = parseInt(inputValues[2]);
  
    const [sequence, cycleNumber] = computeCollatzSequence(sumationEven, sumationOdd, numberComputed);
    const result = cycleLength(sequence, cycleNumber);
    console.log(result);
  }
}

main();