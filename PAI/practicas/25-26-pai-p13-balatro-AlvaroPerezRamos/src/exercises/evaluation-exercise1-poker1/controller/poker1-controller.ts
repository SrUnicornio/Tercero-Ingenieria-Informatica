/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file poker1-controller.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Controlador de Póker-1.
 *   Cablea el modelo y la vista sin contener lógica de juego
 *   ni lógica de presentación.
 *
 *   Flujo:
 *     Vista → inputs → Controlador → Modelo → eventos → renderer
 */

import {Poker1Model} from '../model/poker1-model';
import {Poker1View} from '../view/poker1-view';

/**
 * Controlador de Póker-1.
 *   Recibe modelo y vista por constructor (DIP).
 *   {@link run} realiza todo el cableado y arranca la partida.
 */
export class Poker1Controller {
  /**
   * @param model Instancia del modelo del juego.
   * @param view  Instancia de la fachada de la vista.
   */
  constructor(
    private readonly model: Poker1Model,
    private readonly view: Poker1View,
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

    this.model.onCardReplaced((data) => {
      renderer.onCardReplaced(data);
    });

    this.model.onNoSuitableCard(() => {
      renderer.onNoSuitableCard();
    });

    this.model.onDeckEmpty(() => {
      renderer.onDeckEmpty();
    });
  }

  /**
   * Suscribe los inputs del jugador a las acciones del modelo.
   * El modo actual (mayor/menor) se consulta en el momento del clic,
   * no al suscribirse, para reflejar siempre el estado del checkbox.
   */
  private wireViewToModel(): void {
    const inputs = this.view.getInputRouter();

    inputs.onCardClicked((slotIndex) => {
      const wantHigher = inputs.isHigherModeActive();
      this.model.replaceCard(slotIndex, wantHigher);
    });
  }
}
