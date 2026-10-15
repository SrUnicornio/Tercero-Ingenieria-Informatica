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

import { describe, expect, test, beforeEach } from '@jest/globals';
import { Point, Rectangle, checkNonNegativeNumbers } from './point-in-rectangle-X53379';

describe('Point in Rectangle - X53379', () => {
  let point: Point;
  let rectangle: Rectangle;

  beforeEach(() => {
    point = new Point(3, 4);
    rectangle = new Rectangle(5, 6, new Point(0, 0));
  });

  test('Creación correcta de la clase Point', () => {
    expect(point).toBeInstanceOf(Point);
    expect(point.getXCoordinate()).toBe(3);
    expect(point.getYCoordinate()).toBe(4);
  });

  test('Creación correcta de la clase Rectangle', () => {
    expect(rectangle).toBeInstanceOf(Rectangle);
  });

  test('checkNonNegativeNumbers lanza error si se reciben números negativos', () => {
    const fristNegativeNumber = [-1, 5, 0, 0];
    const secondNegativeNumber = [5, -1, 0, 0];
    const thirdNegativeNumber = [5, 5, -1, 0];
    const fourthNegativeNumber = [5, 5, 0, -1];
    expect(() => checkNonNegativeNumbers(fristNegativeNumber)).toThrow('Todos los números deben ser no negativos. Se recibieron: -1, 5, 0, 0');
    expect(() => checkNonNegativeNumbers(secondNegativeNumber)).toThrow('Todos los números deben ser no negativos. Se recibieron: 5, -1, 0, 0');
    expect(() => checkNonNegativeNumbers(thirdNegativeNumber)).toThrow('Todos los números deben ser no negativos. Se recibieron: 5, 5, -1, 0');
    expect(() => checkNonNegativeNumbers(fourthNegativeNumber)).toThrow('Todos los números deben ser no negativos. Se recibieron: 5, 5, 0, -1');
  });

  test('El punto está dentro del rectángulo', () => {
    expect(rectangle.rectangleContainsPoint(point)).toBe(true);
  });

  test('El punto está en el borde del rectángulo', () => {
    const borderPoint = new Point(5, 4);
    expect(rectangle.rectangleContainsPoint(borderPoint)).toBe(true);
  });

  test('El punto está fuera del rectángulo', () => {
    const outsidePoint = new Point(6, 7);
    expect(rectangle.rectangleContainsPoint(outsidePoint)).toBe(false);
  });
});