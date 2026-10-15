/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description point in rectangle - X53379
 *   The input consists of several rectangles (four non-negative integer numbers: the width, the height, and the coordinates of the lower-left corner), each followed by a point (two non-negative integer numbers).
 * 
 * @author Álvaro Pérez Ramos
 * @since 24 FEB 2026
 * @see {@link https://jutge.org/problems/x53379_en }
 */

import * as fichero from 'fs';


/**
 * Clase que representa un punto en un plano cartesiano.
 */
export class Point {
  constructor(private readonly xCoordinate: number, private readonly yCoordinate: number) { }

  // Getters para las coordenadas del punto
  getXCoordinate(): number {
    return this.xCoordinate;
  }

  getYCoordinate(): number {
    return this.yCoordinate;
  }
}

/**
 * Clase que representa un rectángulo en un plano cartesiano.
 */
export class Rectangle {
  constructor(private readonly width: number, private readonly height: number, private readonly lowerLeftCorner: Point) { }

  /**
   * Establece la esquina inferior izquierda del rectángulo.
   * @param point Comprueba si el punto dado está dentro del rectángulo, incluyendo los bordes.
   * @returns true si el punto está dentro del rectángulo, false en caso contrario.
   */
  rectangleContainsPoint(point: Point): boolean {
    const xMin = this.lowerLeftCorner.getXCoordinate();
    const xMax = xMin + this.width;
    const yMin = this.lowerLeftCorner.getYCoordinate();
    const yMax = yMin + this.height;

    return (
      point.getXCoordinate() > xMin &&
      point.getXCoordinate() < xMax &&
      point.getYCoordinate() > yMin &&
      point.getYCoordinate() < yMax
    );
  }

  /**
   * Point is on the border of the rectangle.
   * @param point Comprueba si el punto dado está en el borde del rectángulo.
   * @return true si el punto está en el borde del rectángulo, false en caso contrario.
   */
  pointIsOnBorder(point: Point): boolean {
    const xMin = this.lowerLeftCorner.getXCoordinate();
    const xMax = xMin + this.width;
    const yMin = this.lowerLeftCorner.getYCoordinate();
    const yMax = yMin + this.height;

    return (
      (point.getXCoordinate() === xMin || point.getXCoordinate() === xMax) &&
      point.getYCoordinate() >= yMin &&
      point.getYCoordinate() <= yMax
    ) || (
      (point.getYCoordinate() === yMin || point.getYCoordinate() === yMax) &&
      point.getXCoordinate() >= xMin &&
      point.getXCoordinate() <= xMax
    );
  }
}

/**
 * Función para verificar que los numeros de entrada son no negativos.
 * @param numbers Un array de números a verificar.
 */
export function checkNonNegativeNumbers(numbers: number[]): void {
  for (const number of numbers) {
    if (number < 0) {
      throw new Error(`Todos los números deben ser no negativos. Se recibieron: ${numbers.join(', ')}`);
    }
  }
}

/**
 * Función principal que lee la entrada, procesa cada caso y muestra el resultado.
 */
function main(): void {
  const input = fichero.readFileSync(0, 'utf-8').trim();
  const lines = input.split('\n');

  for (const line of lines) {
    const values = line.split(' ').map(Number);
    checkNonNegativeNumbers(values);

    const [width, height, xCorner, yCorner, xPoint, yPoint] = values;
    const rectangle = new Rectangle(width, height, new Point(xCorner, yCorner));
    const point = new Point(xPoint, yPoint);

     switch (true) {
      case rectangle.rectangleContainsPoint(point):
        console.log('inside');
        break;
      case rectangle.pointIsOnBorder(point):
        console.log('border');
        break;
      default:
        console.log('outside');
     }
  }
}

if (require.main === module) {
  main();
}