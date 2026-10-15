/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file elipse-main.ts
 * @description
 *   Ejercicio 2. Dibujo de elipse con Canvas API.
 *   El programa dibuja una elipse en un canvas utilizando la API de Canvas de HTML5.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { EllipseApp } from './ellipse-app.js';

function main(): void {
  new EllipseApp('app-root');
}

main();