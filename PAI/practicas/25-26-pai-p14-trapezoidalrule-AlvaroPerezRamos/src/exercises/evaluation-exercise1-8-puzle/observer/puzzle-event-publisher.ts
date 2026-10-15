/**
 * Universidad de La Laguna — PAI P14
 * @file event.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since May 2026
 * @description Canal de eventos genérico (patrón Observer).
 */

/** Función listener que recibe el payload del evento. */
type Listener<Payload> = (payload: Payload) => void;

/**
 * Canal de eventos tipado. Un emisor puede tener múltiples
 * suscriptores; todos reciben el mismo payload al dispararse.
 */
export class PuzzleEvent<Payload> {
  private readonly listeners: Listener<Payload>[] = [];

  /** Suscribe un listener al canal. */
  addListener(listener: Listener<Payload>): void {
    this.listeners.push(listener);
  }

  /** Elimina todos los listeners del canal. */
  removeAllListeners(): void {
    this.listeners.length = 0;
  }

  /** Notifica a todos los listeners con el payload dado. */
  trigger(payload: Payload): void {
    for (const listener of this.listeners) {
      listener(payload);
    }
  }
}
