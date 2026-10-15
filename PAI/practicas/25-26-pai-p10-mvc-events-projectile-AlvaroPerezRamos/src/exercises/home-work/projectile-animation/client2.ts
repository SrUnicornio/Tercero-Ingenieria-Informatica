/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file client2.ts
 * @description
 *  Punto de entrada de la aplicación. Crea una instancia de {@link App2}
 * 
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { App2 } from './app2.js';

/**
 * @function main
 * @description Punto de entrada de la aplicación. Crea una instancia de {@link App2}
 * y la inicializa.
 */
function main(): void {
  const app = new App2();
  app.initialize();
}

main();