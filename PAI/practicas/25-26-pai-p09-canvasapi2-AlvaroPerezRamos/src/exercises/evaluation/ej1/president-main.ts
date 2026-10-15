/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file president-main.ts
 * @description
 *   Punto de entrada para la demostración del patrón Singleton con President.
 *   Reproduce exactamente el programa del enunciado.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { President } from './president.js';

const main = function (): void {
  const president: President = President.getPresident();
  console.log(president.getName());

  const anotherPresident: President = President.getPresident();
  console.log(anotherPresident.getName());

  // You can't do this:
  // const oneMorePresident = new President('Trump');
};

main();
