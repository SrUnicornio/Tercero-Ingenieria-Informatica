/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Fermat's Last Theorem.2
 *  Escribe un programa tal que, dada una secuencia de líneas, cada uno con cuatro números naturales a, b, c, d con a≤ b y c≤ d, 
 *  imprime la primera solución natural a la ecuación
 *                      x^3 + y^3 = z^3
 * 
 *  eso cumple con las restricciones de una línea: a≤ x≤ b y c≤ y≤ d.
 * @link https://jutge.org/problems/P18203_en
 */
'use strict';

let input = '';

/**
 * Finds the first trivial solution to x^3 + y^3 = z^3
 * across multiple input lines.
 * @param {string[]} lines
 * @returns {string}
 */
const findFirstTrivialCubicSolution = (lines) => {
  let solutionFound = false;
  let solutionX = 0;
  let solutionY = 0;
  let solutionZ = 0;

  for (const line of lines) {
    const [xMin, xMax, yMin, yMax] = line.trim().split(/\s+/).map(Number);

    if (xMin <= xMax && yMin <= yMax) {
      if ((xMin === 0 || yMin === 0) && !solutionFound) {
        solutionFound = true;
        solutionX = xMin;
        solutionY = yMin;
        solutionZ = xMin + yMin;
      }
    }
  }

  if (solutionFound) {
    return `${solutionX}^3 + ${solutionY}^3 = ${solutionZ}^3`;
  }

  return 'No solution!';
};

const main = () => {
  const lines = input.trim().split('\n');
  const result = findFirstTrivialCubicSolution(lines);
  console.log(result);
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);


