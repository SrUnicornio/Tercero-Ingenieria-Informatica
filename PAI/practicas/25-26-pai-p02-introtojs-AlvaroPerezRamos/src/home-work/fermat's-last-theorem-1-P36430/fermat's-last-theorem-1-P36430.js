/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Fermat's Last Theorem. 1
 *  Escribe un programa tal que, dada una secuencia de líneas, cada uno con cuatro números naturales a, b, c, d con a≤ b y c≤ d, 
 *  imprime la primera solución natural a la ecuación
 *                      x^2 + y^2 = z^2
 * 
 *  eso cumple con las restricciones de una línea: a≤ x≤ b y c≤ y≤ d.
 *
 * @link https://jutge.org/problems/P36430_en
 */
'use strict';

let input = '';

/**
 * Finds the first Pythagorean solution to x^2 + y^2 = z^2
 * within the given ranges.
 * @param {string[]} line - A line containing four natural numbers a, b, c, d
 * @returns {string} - The first solution found or 'No solution!'
 */
const findFirstPythagoreanSolution = (line) => {
  const [xMin, xMax, yMin, yMax] = line.trim().split(/\s+/).map(Number);
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      const zSquared = x * x + y * y;
      const z = Math.sqrt(zSquared);

      if (Number.isInteger(z)) {
        return `${x}^2 + ${y}^2 = ${z}^2`;
      }
    }
  }
  return 'No solution!';
};

const main = () => {
  const line = input.trim();
  const result = findFirstPythagoreanSolution(line);
  console.log(result);
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
