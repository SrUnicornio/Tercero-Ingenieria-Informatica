/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-hand-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Sub-vista de una fila de cartas de Póker-2.
 *   Renderiza las 5 cartas de una mano en el contenedor indicado.
 *   Se instancia dos veces: una por cada jugador.
 *   No emite eventos — en este ejercicio no se clica en cartas.
 */

import {Card} from
  '../../home-work/balatro/model/game/card';

/**
 * Vista de una fila de cartas de Póker-2.
 *   Responsabilidad única: renderizar o actualizar las 5 cartas
 *   del contenedor asignado.
 */
export class Poker2HandView {
  /**
   * @param container Elemento del DOM que actúa como fila de cartas.
   */
  constructor(private readonly container: HTMLElement) {}

  /**
   * Renderiza la mano completa, reconstruyendo el DOM desde cero.
   * @param cards Cartas a mostrar.
   */
  renderHand(cards: readonly Card[]): void {
    this.container.innerHTML = '';
    cards.forEach((card) => {
      const slot = this.buildCardSlot(card);
      this.container.appendChild(slot);
    });
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Construye el nodo DOM de una carta con su imagen.
   * @param card Carta a representar.
   * @returns `div` listo para insertar en el contenedor.
   */
  private buildCardSlot(card: Card): HTMLDivElement {
    const slot = document.createElement('div');
    slot.className = 'poker2-card-slot';

    const image = document.createElement('img');
    image.src = card.getImagePath();
    image.alt = card.toString();
    image.draggable = false;

    slot.appendChild(image);
    return slot;
  }
}
