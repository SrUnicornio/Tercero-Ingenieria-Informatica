/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Computation of areas.
 *   The program computes the areas of different geometric shapes.
 * @link https://jutge.org/problems/P39057_en
 */
'use strict';

let input = '';

const areaOfCircle = (radius) => Math.PI * radius * radius;
const areaOfRectangle = (width, height) => width * height;

const main = () => {
  const tokens = input.trim().split(/\s+/);
  let index = 0;

  const numberOfShapes = Number(tokens[index++]);

  for (let i = 0; i < numberOfShapes; i++) {
    const shapeType = tokens[index++];

    let area;
    if (shapeType === 'circle') {
      const radius = Number(tokens[index++]);
      area = areaOfCircle(radius);
    } else if (shapeType === 'rectangle') {
      const width = Number(tokens[index++]);
      const height = Number(tokens[index++]);
      area = areaOfRectangle(width, height);
    }

    process.stdout.write(area.toFixed(6) + '\n');
  }
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
