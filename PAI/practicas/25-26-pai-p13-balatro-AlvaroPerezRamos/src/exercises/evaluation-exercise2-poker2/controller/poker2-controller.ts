/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker2-controller.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Controlador de Póker-2.
 *   Cablea el modelo y la vista sin contener lógica de juego
 *   ni lógica de presentación.
 *
 *   Flujo:
 *     Vista → inputs → Controlador → Modelo → eventos → renderer
 */

import {Poker2Model} from '../model/poker2-model';
import {Poker2View} from '../view/poker2-view';

/**
 * Controlador de Póker-2.
 *   Recibe modelo y vista por constructor (DIP).
 *   {@link run} realiza todo el cableado y arranca la partida.
 */
export class Poker2Controller {
  /**
   * @param model Instancia del modelo del juego.
   * @param view  Instancia de la fachada de la vista.
   */
  constructor(
    private readonly model: Poker2Model,
    private readonly view: Poker2View,
  ) {}

  /**
   * Conecta todos los eventos modelo ↔ vista y arranca el juego.
   * Debe llamarse una única vez tras construir el controlador.
   */
  run(): void {
    this.wireModelToView();
    this.wireViewToModel();
    this.model.startGame();
  }

  /**
   * Suscribe los eventos del modelo a los métodos del renderer.
   */
  private wireModelToView(): void {
    const renderer = this.view.getViewRenderer();

    this.model.onGameStarted((data) => {
      renderer.onGameStarted(data);
    });

    this.model.onNewHand((data) => {
      renderer.onNewHand(data);
    });

    this.model.onDeckInsufficient(() => {
      renderer.onDeckInsufficient();
    });
  }

  /**
   * Suscribe los inputs del jugador a las acciones del modelo.
   */
  private wireViewToModel(): void {
    this.view.getInputRouter().onNewHand((playerIndex) => {
      this.model.dealNewHand(playerIndex);
    });
  }
}
