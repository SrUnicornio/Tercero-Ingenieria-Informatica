/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Top to Bottom.
 *   The program reads a sequence of integers and prints them from top to bottom.
 * 
 * @link https://jutge.org/problems/P59875_en
 */
'use strict';

let inputNumbers = [];

/**
 * Generates a sequence of integers from top to bottom.
 * @param {number} top
 * @param {number} bottom
 * @returns {number[]}
 */
const topToBottom = (top, bottom) => {
  const result = [];
  for (let i = top; i >= bottom; i--) {
    result.push(i);
  }
  return result;
};

const main = () => {
  let [top, bottom] = inputNumbers;

  if (bottom > top) {
    [top, bottom] = [bottom, top];
  }

  const result = topToBottom(top, bottom);
  console.log(result.join('\n'));
};

process.stdin.on('data', (data) => {
  inputNumbers = data.toString().trim().split(/\s+/).map(Number);
});

process.stdin.on('end', main);
