/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trajectory-color-strategy.ts
 * @description
 *   Estrategia de asignación de colores a trayectorias (patrón Strategy).
 *
 *   Cada lanzamiento recibe un color distinto para que las trayectorias
 *   superpuestas sean distinguibles. La estrategia puede cambiarse sin
 *   modificar el controlador (OCP).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @interface IColorStrategy
 * @description Contrato del patrón Strategy para asignación de colores.
 */
export interface IColorStrategy {
  /**
   * Devuelve el color CSS para el siguiente lanzamiento.
   * @returns Color CSS válido, ej: `"steelblue"`, `"#e63946"`.
   */
  nextColor(): string;
}

/**
 * @class CyclicColorStrategy
 * @classdesc
 *   Implementación de {@link IColorStrategy} que cicla por una paleta
 *   de colores predefinida.
 *
 *   Solo usa nombres de color HTML, conforme a la guía de estilo
 *   de PAI (sin valores hexadecimales).
 */
export class CyclicColorStrategy implements IColorStrategy {
  /** Paleta de colores para las trayectorias. */
  private static readonly COLOR_PALETTE: readonly string[] = [
    'steelblue',
    'crimson',
    'forestgreen',
    'darkorange',
    'mediumpurple',
    'teal',
    'goldenrod',
    'indianred',
    'dodgerblue',
    'darkolivegreen',
  ];

  /** Índice del siguiente color en la paleta. */
  private currentIndex = 0;

  /**
   * @method nextColor
   * @description Devuelve el siguiente color de la paleta de forma cíclica.
   * @returns Color CSS con nombre HTML.
   */
  nextColor(): string {
    const color =
      CyclicColorStrategy.COLOR_PALETTE[
      this.currentIndex % CyclicColorStrategy.COLOR_PALETTE.length
      ];
    this.currentIndex++;
    return color;
  }
}
