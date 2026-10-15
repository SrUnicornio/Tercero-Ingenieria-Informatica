/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Implement a Triangle class that takes three sides as input and provides methods to determine if the triangle is equilateral, isosceles, or scalene. 
 * The class should also validate that the sides can form a valid triangle using the triangle inequality theorem.
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 */

/**
 * The Triangle class represents a triangle defined by its three sides. 
 * It provides methods to determine if the triangle is equilateral, isosceles, or scalene, and validates the triangle using the triangle inequality theorem.
 */
export class Triangle {
  private readonly sides: number[]
  constructor(...sides: number[]) {
    this.sides = sides
  }

  /**
   * Checks if the triangle is equilateral, meaning all sides are of equal length.
   */
  get isEquilateral() {
    if (!this.isValid()) {
      return false
    }

    const [side1, side2, side3] = this.sides
    return side1 === side2 && side2 === side3
  }
  
  /**
   * Checks if the triangle is isosceles, meaning at least two sides are of equal length.
   */
  get isIsosceles() {
    if (!this.isValid()) {
      return false
    }

    const [side1, side2, side3] = this.sides
    return side1 === side2 || side1 === side3 || side2 === side3
  }

  /**
   * Checks if the triangle is scalene, meaning all sides are of different lengths.
   */
  get isScalene() {
    if (!this.isValid()) {
      return false
    }

    const [side1, side2, side3] = this.sides
    return side1 !== side2 && side1 !== side3 && side2 !== side3
  }

  /**
   * Checks if the triangle is valid using the triangle inequality theorem.
   * @returns true if the triangle is valid, false otherwise
   */
  private isValid() {
    if (this.sides.some(side => side <= 0)) {
      return false
    }
    const [side1, side2, side3] = this.sides
    return side1 + side2 >= side3 &&
      side1 + side3 >= side2 &&
      side2 + side3 >= side1
  }
}
