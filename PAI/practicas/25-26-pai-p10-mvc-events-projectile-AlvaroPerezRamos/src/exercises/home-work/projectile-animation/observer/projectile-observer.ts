/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file projectile-observer.ts
 * @description
 *   Contrato del patrón Observer para los suscriptores del modelo.
 *
 *   Separa la interfaz del observador del modelo (ISP, DIP),
 *   evitando que ProjectileModel conozca a ProjectileController.
 *
 *   El controlador implementa esta interfaz para recibir notificaciones
 *   cuando el proyectil aterriza.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { ProjectileState } from '../model/projectile-model.js';

/**
 * @interface ProjectileObserver
 * @description
 *   Contrato del patrón Observer.
 *   Implementado por cualquier clase que necesite reaccionar
 *   al aterrizaje del proyectil.
 */
export interface ProjectileObserver {
  /**
   * El modelo llama a este método cuando la simulación termina.
   * @param finalState - Estado final del proyectil al aterrizar.
   */
  onProjectileLanded(finalState: ProjectileState): void;
}
