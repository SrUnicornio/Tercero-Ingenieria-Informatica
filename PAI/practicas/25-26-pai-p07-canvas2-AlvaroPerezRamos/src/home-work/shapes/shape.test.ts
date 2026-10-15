/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Unit tests for the shapes figures.
 *   Rectangle
 *   Square
 *   Circle
 *   Triangle
 *   Pentagon
 *  
 * @file shape.test.ts
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 10 MAR 2026
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  Shape,
  Coordinates,
  Circle,
  Rectangle,
  Square,
  Triangle,
  Polygon,
  Star,
  Cross,
  Oval,
  Diamond,
  Heart,
  Trapezoid,
  Arrow
} from './shape';

describe('Shape', () => {

  const coordinates: Coordinates = { x: 10, y: 20 };
  const color = 'red';
  const rotation = 45;

  describe('Rectangle', () => {
    let rectangle: Rectangle;
    beforeEach(() => {
      rectangle = new Rectangle(coordinates, color, rotation, 30, 40);
    });

    test('should instantiate correctly', () => {
      expect(rectangle).toBeInstanceOf(Rectangle);
      expect(rectangle).toBeInstanceOf(Shape);
    });

    test('should return correct properties', () => {
      expect(rectangle.getCoordinates()).toEqual(coordinates);
      expect(rectangle.getColor()).toBe(color);
      expect(rectangle.getRotation()).toBe(rotation);
    });

    test('should compute correct area', () => {
      expect(rectangle.computeArea()).toBe(1200);
    });
  });

  describe('Square', () => {
    let square: Square;
    beforeEach(() => {
      square = new Square(coordinates, color, rotation, 50);
    });

    test('should instantiate correctly', () => {
      expect(square).toBeInstanceOf(Square);
      expect(square).toBeInstanceOf(Rectangle);
    });

    test('should compute correct area', () => {
      expect(square.computeArea()).toBe(2500);
    });
  });

  describe('Circle', () => {
    let circle: Circle;
    beforeEach(() => {
      circle = new Circle(coordinates, color, rotation, 15);
    });

    test('should instantiate correctly', () => {
      expect(circle).toBeInstanceOf(Circle);
      expect(circle).toBeInstanceOf(Shape);
    });

    test('should compute correct area', () => {
      expect(circle.computeArea()).toBeCloseTo(Math.PI * 225);
    });
  });

  describe('Triangle', () => {
    let triangle: Triangle;
    beforeEach(() => {
      triangle = new Triangle(coordinates, color, rotation, 30, 40);
    });

    test('should instantiate correctly', () => {
      expect(triangle).toBeInstanceOf(Triangle);
    });

    test('should compute correct area', () => {
      expect(triangle.computeArea()).toBe(600);
    });
  });

  describe('Polygon', () => {
    let polygon: Polygon;
    beforeEach(() => {
      polygon = new Polygon(coordinates, color, rotation, 6, 10);
    });

    test('should instantiate correctly', () => {
      expect(polygon).toBeInstanceOf(Polygon);
    });

    test('should compute area greater than zero', () => {
      expect(polygon.computeArea()).toBeGreaterThan(0);
    });

    test('should return correct polygon name', () => {
      expect(polygon.getType()).toBe('hexagon');
    });
  });

  describe('Star', () => {
    let star: Star;
    beforeEach(() => {
      star = new Star(coordinates, color, rotation, 5, 20, 10);
    });

    test('should instantiate correctly', () => {
      expect(star).toBeInstanceOf(Star);
    });

    test('should compute area greater than zero', () => {
      expect(star.computeArea()).toBeGreaterThan(0);
    });

    test('should return correct type', () => {
      expect(star.getType()).toBe('pentagram');
    });
  });

  describe('Cross', () => {
    let cross: Cross;
    beforeEach(() => {
      cross = new Cross(coordinates, color, rotation, 30);
    });

    test('should instantiate correctly', () => {
      expect(cross).toBeInstanceOf(Cross);
    });

    test('should compute correct area', () => {
      expect(cross.computeArea()).toBe(900);
    });
  });

  describe('Oval', () => {
    let oval: Oval;
    beforeEach(() => {
      oval = new Oval(coordinates, color, rotation, 10, 20);
    });

    test('should instantiate correctly', () => {
      expect(oval).toBeInstanceOf(Oval);
    });

    test('should compute correct area', () => {
      expect(oval.computeArea()).toBeCloseTo(Math.PI * 200);
    });
  });

  describe('Diamond', () => {
    let diamond: Diamond;
    beforeEach(() => {
      diamond = new Diamond(coordinates, color, rotation, 30, 40);
    });

    test('should instantiate correctly', () => {
      expect(diamond).toBeInstanceOf(Diamond);
      expect(diamond).toBeInstanceOf(Rectangle);
    });
  });

  describe('Heart', () => {
    let heart: Heart;
    beforeEach(() => {
      heart = new Heart(coordinates, color, rotation, 20);
    });

    test('should instantiate correctly', () => {
      expect(heart).toBeInstanceOf(Heart);
    });

    test('should compute area greater than zero', () => {
      expect(heart.computeArea()).toBeGreaterThan(0);
    });
  });

  describe('Trapezoid', () => {
    let trapezoid: Trapezoid;
    beforeEach(() => {
      trapezoid = new Trapezoid(coordinates, color, rotation, 20, 40, 30);
    });

    test('should instantiate correctly', () => {
      expect(trapezoid).toBeInstanceOf(Trapezoid);
    });

    test('should compute correct area', () => {
      expect(trapezoid.computeArea()).toBe(900);
    });
  });

  describe('Arrow', () => {
    let arrow: Arrow;
    beforeEach(() => {
      arrow = new Arrow(coordinates, color, rotation, 50, 10);
    });

    test('should instantiate correctly', () => {
      expect(arrow).toBeInstanceOf(Arrow);
    });

    test('should compute correct area', () => {
      expect(arrow.computeArea()).toBe(500);
    });
  });
});
