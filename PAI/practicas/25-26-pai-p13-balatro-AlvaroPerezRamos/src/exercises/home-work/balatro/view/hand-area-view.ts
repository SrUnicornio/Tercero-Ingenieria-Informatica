/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-area-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Vista de la mano del jugador (Bloque 4). Renderiza las cartas
 *   en el DOM, gestiona el estado visual de selección (elevación + borde dorado)
 *   y emite un evento cuando el jugador pulsa una carta.
 */

import {Card} from '../model/game/card';
import {Event} from '../observer/event';

/** Clase CSS aplicada a los contenedores de cartas seleccionadas. */
const SELECTED_CLASS = 'card-slot--selected';

/**
 * Vista del área de la mano del jugador. Renderiza las cartas en el
 * DOM, gestiona el estado visual de selección y emite eventos de interacción.
 */
export class HandAreaView {
  // Evento privado que se dispara al pulsar una carta, con el índice de la carta.
  private readonly cardClickedEvent = new Event<number>();
  private cardSlots: HTMLDivElement[] = [];

  /**
   * @param container - Elemento del DOM con id="hand-area".
   */
  constructor(private readonly container: HTMLElement) {}

  /**
   * Registra un listener para el clic en una carta de la mano.
   * @param listener - Función llamada con el índice (0-based) de la carta pulsada.
   */
  onCardClicked(listener: (cardIndex: number) => void): void {
    this.cardClickedEvent.addListener(listener);
  }

  /**
   * Renderiza la mano completa vaciando el contenedor y reconstruyéndolo.
   * @param cards - Cartas a mostrar (normalmente 8 al inicio del nivel).
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
   * Reemplaza las cartas en las posiciones indicadas por las nuevas.
   * @param replacedIndices - Posiciones que fueron descartadas o jugadas.
   * @param replacementCards - Nuevas cartas que ocupan esas posiciones.
   */
  replaceCards(
      replacedIndices: readonly number[],
      replacementCards: readonly Card[],
  ): void {
    replacedIndices.forEach((slotIndex, i) => {
      const slot = this.cardSlots[slotIndex];
      if (!slot) return;
      const image = slot.querySelector('img');
      if (!image) return;
      image.src = replacementCards[i].getImagePath();
      image.alt = replacementCards[i].toString();
      slot.classList.remove(SELECTED_CLASS);
    });
  }

  /**
   * Marca o desmarca visualmente una carta como seleccionada.
   * @param cardIndex - Índice de la carta en la mano (0-based).
   * @param isSelected - `true` para seleccionar, `false` para deseleccionar.
   */
  setCardSelected(cardIndex: number, isSelected: boolean): void {
    const slot = this.cardSlots[cardIndex];
    if (!slot) return;
    slot.classList.toggle(SELECTED_CLASS, isSelected);
  }

  /**
   * Construye el contenedor DOM de una carta con su imagen y listener de clic.
   * El div tiene clase "card-slot" y el atributo `data-card-index` para debug.
   * @param card - Carta a representar visualmente.
   * @param index - Índice de la carta en la mano (0-based).
   * @returns `div` listo para insertar en el contenedor de la mano.
   */
  private buildCardSlot(card: Card, index: number): HTMLDivElement {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    slot.setAttribute('data-card-index', String(index));

    const image = document.createElement('img');
    image.src = card.getImagePath();
    image.alt = card.toString();
    image.draggable = false;

    slot.appendChild(image);
    slot.addEventListener('click', () => this.cardClickedEvent.trigger(index));
    return slot;
  }
}
