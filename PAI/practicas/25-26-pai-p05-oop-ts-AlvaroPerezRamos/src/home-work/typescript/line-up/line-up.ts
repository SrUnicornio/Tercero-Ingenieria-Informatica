/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Line Up
 *   Implementa la función format que, dado un nombre y un número, devuelve una cadena de texto con el formato:
 *   <nombre>, you are the <número>th customer we serve today. Thank you!
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 * @see {@link https://exercism.org/tracks/typescript/exercises/pangram}
 */

/**
 * Devuelve una cadena de texto con el formato:
 * 
 * @param name - El nombre del cliente
 * @param number - El número del cliente
 * @returns Una cadena de texto con el formato:
 * <nombre>, you are the <número>th customer we serve today. Thank you!
 */
export function format(name: string, number: number): string {
  let suffix = getSuffix(number)
  return `${name}, you are the ${number}${suffix} customer we serve today. Thank you!`
}

function getSuffix(number: number): string {
  if (number % 100 >= 11 && number % 100 <= 13) {
    return 'th'
  }
  
  switch (number % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}