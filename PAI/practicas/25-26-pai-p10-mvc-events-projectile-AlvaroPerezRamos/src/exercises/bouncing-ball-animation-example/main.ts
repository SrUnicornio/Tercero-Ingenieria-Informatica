/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Apli./ViewAnimation.jscaciones Interactivas
 *
 * @author F. de Sande
 * @since March 27, 2026
 * @description Client for the CircleAnimator class
 *              Compile the application with
 *                tsc
 *              tsc will use the information in tsconfig.json
 */

import { ViewAnimation } from './view-animation.js';

function main() {
  const animator = new ViewAnimation();
  animator.start();
}

main();
