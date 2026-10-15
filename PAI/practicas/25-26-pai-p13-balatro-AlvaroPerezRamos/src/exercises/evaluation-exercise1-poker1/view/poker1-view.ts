/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Fachada de la vista de Póker-1 (patrón Facade).
 *   Construye las sub-vistas a partir del DOM y expone al controlador
 *   las dos superficies: inputs y renderer.
 */

import {Poker1HandView} from './poker1-hand-view';
import {Poker1ControlsView} from './poker1-controls-view';
import {Poker1ViewInputRouter} from './poker1-view-input-router';
import {Poker1ViewRenderer} from './poker1-view-renderer';

/** ID del contenedor de cartas en el DOM. */
const HAND_CONTAINER_ID = 'poker1-hand-area';

/**
 * Fachada de la vista de Póker-1.
 *   Instancia las sub-vistas y las compone en un router de inputs
 *   y un renderer. El controlador solo conoce esta fachada.
 */
export class Poker1View {
  private readonly inputRouter: Poker1ViewInputRouter;
  private readonly renderer: Poker1ViewRenderer;

  constructor() {
    const handContainer = this.getElement(HAND_CONTAINER_ID);
    const handView = new Poker1HandView(handContainer);
    const controlsView = new Poker1ControlsView();

    this.inputRouter = new Poker1ViewInputRouter(handView, controlsView);
    this.renderer = new Poker1ViewRenderer(handView, controlsView);
  }

  /**
   * Expone la superficie de inputs al controlador.
   * @returns Enrutador de eventos de usuario.
   */
  getInputRouter(): Poker1ViewInputRouter {
    return this.inputRouter;
  }

  /**
   * Expone la superficie de rendering al controlador.
   * @returns Renderizador de la vista.
   */
  getViewRenderer(): Poker1ViewRenderer {
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
