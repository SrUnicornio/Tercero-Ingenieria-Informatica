/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file main.ts
 * @description
 *   Punto de entrada de la aplicación.
 *   El cliente solo conoce App y su configuración mínima.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  March 2026
 */

import { App } from './app.js';

/**
 * @function main
 * @description Crea la aplicación y la arranca.
 */
function main(): void {
  const app = new App({
    canvasId: 'functionCanvas',
    inputId: 'functionInput',
    buttonId: 'renderButton',
    defaultExpression: 'sin(x)',
  });

  app.start();
}

main();