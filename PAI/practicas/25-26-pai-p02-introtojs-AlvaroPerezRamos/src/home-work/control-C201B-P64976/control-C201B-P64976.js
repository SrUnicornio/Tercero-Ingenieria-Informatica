/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Control C201B
 *  Write a program that reads a natural number n and prints the n first lines of its multiplication table.
 * @link https://jutge.org/problems/P64976_en
 */
'use strict';

let input = '';

/**
 * Generates the multiplication table for a given natural number up to n lines.
 * @param {number} limitMultiplier - A natural number n
 * @returns {string[]} - An array containing the multiplication table lines
 */
const generateMultiplicationTable = (limitMultiplier) => {
  const tableLines = [];
  for (let i = 1; i <= limitMultiplier; i++) {
    tableLines.push(`${limitMultiplier} x ${i} = ${i * limitMultiplier}`);
  }
  return tableLines;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const number = parseInt(input.trim(), 10);
  if (isNaN(number) || number <= 0) return;
  const result = generateMultiplicationTable(number);
  console.log(result.join('\n'));
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);