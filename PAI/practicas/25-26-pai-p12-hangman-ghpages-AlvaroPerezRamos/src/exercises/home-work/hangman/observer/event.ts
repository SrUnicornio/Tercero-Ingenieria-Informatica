/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file event.ts
 * @description Clase genérica que modela un evento mediante el patrón Observer.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

type Listener<T> = (data: T) => void;

/**
 * Evento genérico con suscriptores. El modelo emite; la vista escucha.
 * @template T Tipo del dato emitido.
 */
export class Event<T> {
  private readonly listeners: Listener<T>[] = [];

  /** Registra un nuevo suscriptor. */
  addListener(listener: Listener<T>): void {
    this.listeners.push(listener);
  }

  /** Notifica a todos los suscriptores con el dato proporcionado. */
  trigger(data: T): void {
    for (const listener of this.listeners) {
      listener(data);
    }
  }
}
