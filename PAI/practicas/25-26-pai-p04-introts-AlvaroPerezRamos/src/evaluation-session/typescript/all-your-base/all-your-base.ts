/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * all-your-base.ts - All Your Base
 * 
 * @description
 * This module provides a function to convert a number represented as an array of digits from one base to another.
 * The function checks the validity of the input parameters and performs the conversion by first converting the input number to base 10 and then converting it to the output base.
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 * @see https://exercism.org/tracks/typescript/exercises/all-your-base
 */

/**
 * Converts a number represented as an array of digits from one base to another.
 * @param digits - An array of digits representing the number in the input base.
 * @param inputBase - The base of the input number. Must be at least 2.
 * @param outputBase - The base to convert the number to. Must be at least 2.
 */
export function convert(digits: number[], inputBase: number, outputBase: number): number[] {
  checkInput(digits, inputBase, outputBase);
  let baseTenValue = fromBase(digits, inputBase);
  if (baseTenValue === 0) {
    return [0];
  }
  return toBase(baseTenValue, outputBase);
}

/**
 * Checks the validity of the input parameters for the convert function.
 * @param digits - An array of digits representing the number in the input base.
 * @param inputBase - The base of the input number. Must be at least 2.
 * @param outputBase - The base to convert the number to. Must be at least 2.
 */
function checkInput(digits: number[], inputBase: number, outputBase: number): void {
  switch (true) {
    case inputBase <= 1: 
      throw Error('Wrong input base');
    case outputBase <= 1:
    case outputBase !== Math.floor(outputBase): 
      throw Error('Wrong output base');
    case digits.length === 0:
    case digits.length > 1 && digits[0] === 0:
    case digits.some(digit => digit < 0):
    case digits.some(digit => digit >= inputBase): 
      throw Error('Input has wrong format');
  }
}

/**
 * Converts a number represented as an array of digits from the input base to base 10.
 * @param digits - An array of digits representing the number in the input base.
 * @param inputBase - The base of the input number. Must be at least 2.
 * @returns The number represented in base 10.
 */
function fromBase(digits: number[], inputBase: number): number {
  return digits.reverse()
    .reduce((sumaDigitos, digit, power) => 
        sumaDigitos + digit * Math.pow(inputBase, power), 0)
}

/**
 * Converts a number represented in base 10 to the output base.
 * @param value - The number represented in base 10.
 * @param outputBase - The base to convert the number to. Must be at least 2.
 * @returns An array of digits representing the number in the output base.
 */
function toBase(value: number, outputBase: number): number[] {
  if (value === 0) {
    return [0];
  }

  let output = [];
  while (value > 0) {
    output.push(value % outputBase);
    value = Math.floor(value / outputBase);
  }

  return output.reverse();
}