/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file president.ts
 * @description
 *   Implementación del patrón Singleton para la clase President.
 *   En un sistema presidencial la presidenta/presidente es única/único.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @class President
 * @classdesc
 *   Representa la presidenta/presidente única/único de la UE.
 *   Implementa el patrón Singleton: solo puede existir una instancia.
 *   No se puede instanciar directamente con `new`; se debe usar `getPresident()`.
 *
 * @example
 * ```typescript
 * const president = President.getPresident();
 * console.log(president.getName()); // Von der Leyen
 * ```
 */
export class President {
  /** Única instancia de la clase (patrón Singleton). */
  private static instance: President | null = null;

  /**
   * @constructor
   * @description Constructor privado: impide la creación directa con `new`.
   * @param name - Nombre de la presidenta/presidente.
   */
  private constructor(private readonly name: string) { }

  /**
   * @method getPresident
   * @description
   *   Devuelve la única instancia de President (patrón Singleton).
   *   Si no existe aún, la crea con el nombre por defecto.
   *   Llamadas sucesivas devuelven siempre el mismo objeto.
   *
   * @returns La instancia única de President.
   */
  static getPresident(): President {
    if (President.instance === null) {
      President.instance = new President('Von der Leyen');
    }
    return President.instance;
  }

  /**
   * @method getName
   * @description Devuelve el nombre de la presidenta/presidente.
   * @returns El nombre de la presidenta/presidente.
   */
  getName(): string {
    return this.name;
  }
}
