/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación en Aplicaciones Interactivas (PAI)
 * 
 * @file P11916-Approximation-of-e.js
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @since Feb 05 2026
 * @description Is it a palindrome?
 *   Write a program that, say yes if the chain is a palindrome and no otherwise. A chain is a palindrome if it reads the same from left to right and from right to left.
 * @see {@link https://jutge.org/problems/P50497_en}
 */
'use strict';

let input = '';

/**
 * Checks if a given string is a palindrome.
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is a palindrome, false otherwise.
 */
const isPalindrome = (str) => {
  const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversedStr = cleanedStr.split('').reverse().join('');
  return cleanedStr === reversedStr;
};

/**
 * Main program that reads input and checks if each line is a palindrome.
 */
const main = () => {
  const lines = input.trim().split('\n');
  for (const line of lines) {
    const result = isPalindrome(line) ? 'yes' : 'no';
    console.log(result);
  }
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
