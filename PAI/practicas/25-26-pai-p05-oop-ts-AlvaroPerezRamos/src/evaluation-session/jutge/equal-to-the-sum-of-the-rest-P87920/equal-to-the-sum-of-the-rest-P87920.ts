/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Equal to the sum of the rest - P87920
 *   El programa, dada una secuencia de números enteros, indicará si hay algún número igual a la suma del resto.
 *   La entrada contiene varios casos. Cada caso comienza con un número number ≥ 1 seguido de number números enteros.
 *   Para cada caso, el programa indicará si hay algún número igual a la suma del resto.
 * 
 * @author Álvaro Pérez Ramos
 * @since 24 FEB 2026
 * @see {@link https://jutge.org/problems/P87920_en }
 */

import * as fichero from 'fs';

export class ComputeSecuence {
  private secuence: number[];

  constructor(secuence: number[]) {
    this.secuence = secuence;
  }

  getSequence(): number[] {
    return this.secuence;
  }

  /**
   * Comprueba si hay algún número en la secuencia que sea igual a la suma del resto de los números.
   * @returns 'YES' si existe tal número, 'NO' en caso contrario.
   */
  isEqualToSumOfRest(): string {
    const totalSum = this.secuence.reduce((acc, num) => acc + num, 0);
    for (const num of this.secuence) {
      if (num === totalSum - num) {
        return 'YES';
      }
    }
    return 'NO';
  }
}
/**
 * Función para verificar que el número de elementos en la secuencia es correcto.
 * @param size El número esperado de elementos.
 * @param secuence La secuencia de números a verificar.
 * @throws Error si el tamaño de la secuencia no coincide con el número esperado.
 */
export function checkSizeOfSecuence(size: number, secuence: number[]): void {
  if (size !== secuence.length) {
    throw new Error(`El tamaño de la secuencia (${secuence.length}) no coincide con el número esperado (${size}).`);
  }
}

/**
 * Función para verificar que el tamaño de la secuencia es un número positivo.
 * @param size El número de elementos en la secuencia.
 * @throws Error si el tamaño de la secuencia no es un número positivo.
 */
export function sizeMustBePositive(size: number): void {
  if (size < 1) {
    throw new Error(`El tamaño de la secuencia debe ser un número positivo. Se recibió: ${size}`);
  }
}

/**
 * Función principal que lee la entrada, procesa cada caso y muestra el resultado.
 */
function main(): void {
  const input = fichero.readFileSync(0, 'utf-8').trim();

  if (!input) return;

  const tokens = input.split(/\s+/).map(Number);
  let index = 0;

  while (index < tokens.length) {
    const size = tokens[index++];
    sizeMustBePositive(size);
    const secuence = tokens.slice(index, index + size);
    checkSizeOfSecuence(size, secuence);

    index += size;

    const compute = new ComputeSecuence(secuence);
    console.log(compute.isEqualToSumOfRest());
  }
}

if (require.main === module) {
  main();
}