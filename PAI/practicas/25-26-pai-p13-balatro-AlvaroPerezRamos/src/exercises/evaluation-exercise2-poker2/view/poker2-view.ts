/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Fachada de la vista de Póker-2 (patrón Facade).
 *   Construye las sub-vistas a partir del DOM y expone al controlador
 *   las dos superficies: inputs y renderer.
 */

import {Poker2HandView} from './poker2-hand-view';
import {Poker2ControlsView} from './poker2-controls-view';
import {Poker2ResultView} from './poker2-result-view';
import {Poker2ViewInputRouter} from './poker2-view-input-router';
import {Poker2ViewRenderer} from './poker2-view-renderer';

/** ID del contenedor de cartas del primer jugador. */
const FIRST_HAND_CONTAINER_ID = 'poker2-first-hand';
/** ID del contenedor de cartas del segundo jugador. */
const SECOND_HAND_CONTAINER_ID = 'poker2-second-hand';

/**
 * Fachada de la vista de Póker-2.
 *   Instancia las sub-vistas y las compone en un router de inputs
 *   y un renderer. El controlador solo conoce esta fachada.
 */
export class Poker2View {
  private readonly inputRouter: Poker2ViewInputRouter;
  private readonly renderer: Poker2ViewRenderer;

  constructor() {
    const firstHandContainer =
      this.getElement(FIRST_HAND_CONTAINER_ID);
    const secondHandContainer =
      this.getElement(SECOND_HAND_CONTAINER_ID);

    const firstHandView = new Poker2HandView(firstHandContainer);
    const secondHandView = new Poker2HandView(secondHandContainer);
    const controlsView = new Poker2ControlsView();
    const resultView = new Poker2ResultView();

    this.inputRouter = new Poker2ViewInputRouter(controlsView);
    this.renderer = new Poker2ViewRenderer(
        firstHandView,
        secondHandView,
        controlsView,
        resultView,
    );
  }

  /**
   * Expone la superficie de inputs al controlador.
   * @returns Enrutador de eventos de usuario.
   */
  getInputRouter(): Poker2ViewInputRouter {
    return this.inputRouter;
  }

  /**
   * Expone la superficie de rendering al controlador.
   * @returns Renderizador de la vista.
   */
  getViewRenderer(): Poker2ViewRenderer {
    return this.renderer;
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Obtiene un elemento del DOM por su ID con tipo seguro.
   * @param id ID del elemento a obtener.
   * @returns El elemento tipado como HTMLElement.
   * @throws {Error} Si el elemento no está en el DOM.
   */
  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Elemento DOM no encontrado: #${id}`);
    return element;
  }
}
