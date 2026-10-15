/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc First Palindromic Numbers.
 *  The program finds the first prime palindromic numbers.
 * 
 * @link https://jutge.org/problems/P80660_en
 */
'use strict';

let input = '';

/**
 * Checks if a number is prime.
 * @param {number} number - The number to check
 * @returns {boolean} - True if the number is prime, false otherwise
 */
const isPrime = (number) => {
  if (number < 2) return false;
  if (number % 2 === 0) return number === 2;
  for (let i = 3; i * i <= number; i += 2) {
    if (number % i === 0) return false;
  }
  return true;
};

/**
 * Generates the first `limit` palindromic prime numbers.
 * @param {number} limit - The number of palindromic primes to generate
 * @returns {number[]} - An array of the first `limit` palindromic prime numbers
 */
const generatePalindromes = (limit) => {
  const palindromes = [];
  let i = 1;

  while (palindromes.length < limit * 2) {
    const leftHalf = i.toString();
    const reversed = leftHalf.split('').reverse().join('');

    const odd = Number(leftHalf + reversed.slice(1));
    if (isPrime(odd)) palindromes.push(odd);

    const even = Number(leftHalf + reversed);
    if (isPrime(even)) palindromes.push(even);

    i++;
  }

  palindromes.sort((a, b) => a - b);
  palindromes.length = limit;
  return palindromes;
};

/** 
 * Main program.
 * @returns {void}
 */
const main = () => {
  const queries = input.trim().split(/\s+/).map(Number);

  let maxQuery = 0;
  for (const q of queries) {
    if (q > maxQuery) maxQuery = q;
  }

  const palindromePrimes = generatePalindromes(maxQuery);

  let output = '';
  for (const querie of queries) {
    output += palindromePrimes[querie - 1] + '\n';
  }
  output = output.trimEnd();
  console.log(output);
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);

