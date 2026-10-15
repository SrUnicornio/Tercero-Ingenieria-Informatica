/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-hand-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Sub-vista del área de cartas de Póker-1.
 *   Renderiza las 5 cartas de la mano en el DOM y emite un evento
 *   cuando el jugador hace clic sobre una de ellas.
 */

import {Card} from
  '../../home-work/balatro/model/game/card';
import {Event} from
  '../../home-work/balatro/observer/event';

/**
 * Vista del área de cartas de Póker-1.
 *   Responsabilidad única: renderizar la mano y emitir clics de carta.
 */
export class Poker1HandView {
  private readonly cardClickedEvent = new Event<number>();
  private cardSlots: HTMLDivElement[] = [];

  /**
   * @param container Elemento del DOM que actúa como contenedor de cartas.
   */
  constructor(private readonly container: HTMLElement) {}

  /**
   * Registra un listener para el clic en una carta.
   * @param listener Función llamada con el índice (0-based) de la carta.
   */
  onCardClicked(listener: (slotIndex: number) => void): void {
    this.cardClickedEvent.addListener(listener);
  }

  /**
   * Renderiza la mano completa, reconstruyendo el DOM desde cero.
   * @param cards Cartas a mostrar.
   */
  renderHand(cards: readonly Card[]): void {
    this.container.innerHTML = '';
    this.cardSlots = [];
    cards.forEach((card, index) => {
      const slot = this.buildCardSlot(card, index);
      this.cardSlots.push(slot);
      this.container.appendChild(slot);
    });
  }

  /**
   * Sustituye la imagen de una carta en su slot sin re-renderizar toda
   *   la mano, evitando parpadeos innecesarios.
   * @param slotIndex Índice del slot a actualizar (0-based).
   * @param newCard   Nueva carta a mostrar en ese slot.
   */
  replaceCard(slotIndex: number, newCard: Card): void {
    const slot = this.cardSlots[slotIndex];
    if (!slot) return;
    const image = slot.querySelector('img');
    if (!image) return;
    image.src = newCard.getImagePath();
    image.alt = newCard.toString();
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Construye el nodo DOM de una carta con su imagen y listener de clic.
   * @param card  Carta a representar.
   * @param index Índice de la carta en la mano.
   * @returns `div` listo para insertar en el contenedor.
   */
  private buildCardSlot(card: Card, index: number): HTMLDivElement {
    const slot = document.createElement('div');
    slot.className = 'poker1-card-slot';

    const image = document.createElement('img');
    image.src = card.getImagePath();
    image.alt = card.toString();
    image.draggable = false;

    slot.appendChild(image);
    slot.addEventListener(
        'click',
        () => this.cardClickedEvent.trigger(index),
    );
    return slot;
  }
}
