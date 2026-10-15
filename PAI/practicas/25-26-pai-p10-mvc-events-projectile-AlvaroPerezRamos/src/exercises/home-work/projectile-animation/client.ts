/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file client.ts
 * @description
 *  Punto de entrada de la aplicación. Crea una instancia de {@link App}
 * 
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { App } from './app.js';

/**
 * @function main
 * @description Punto de entrada de la aplicación. Crea una instancia de {@link App}
 * y la inicializa.
 */
function main(): void {
  const app = new App();
  app.initialize();
}

main();