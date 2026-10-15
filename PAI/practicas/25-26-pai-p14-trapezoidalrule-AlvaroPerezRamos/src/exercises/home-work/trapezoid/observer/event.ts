/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file event.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Canal de comunicación genérico basado en el patrón Observer.
 *   El modelo emite eventos con `trigger()`; el controlador suscribe
 *   listeners con `addListener()`; la vista reacciona en los listeners.
 *   El tipo genérico `PayloadType` garantiza coherencia estática entre
 *   lo que se emite y lo que se recibe.
 */

/** Tipo de función que recibe un dato de tipo `PayloadType`. */
export type Listener<PayloadType> = (data: PayloadType) => void;

/** Tipo del callback de evaluación de la función. */
export type EvaluateAt = (x: number) => number;

/**
 * Canal de eventos genérico para comunicación entre componentes.
 */
export class Event<PayloadType> {
  /** Lista de funciones suscritas a este canal. */
  private readonly listeners: Listener<PayloadType>[] = [];

  /**
   * Registra un nuevo listener para este canal de eventos.
   * El mismo listener puede añadirse varias veces; se llamará tantas
   * veces como haya sido registrado por cada disparo.
   * @param listener Función a llamar cuando se dispare el evento.
   */
  addListener(listener: Listener<PayloadType>): void {
    this.listeners.push(listener);
  }

  /**
   * Elimina todos los suscriptores registrados en este canal.
   * el canal es sustituido por una nueva instancia.
   */
  removeAllListeners(): void {
    this.listeners.length = 0;
  }

  /**
   * Notifica sincrónicamente a todos los suscriptores con el dato dado.
   * Los listeners se invocan en orden de registro.
   * @param data Dato a transportar a cada suscriptor.
   */
  trigger(data: PayloadType): void {
    for (const listener of this.listeners) {
      listener(data);
    }
  }
}
