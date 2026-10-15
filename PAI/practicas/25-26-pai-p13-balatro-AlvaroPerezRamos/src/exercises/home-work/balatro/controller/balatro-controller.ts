/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file balatro-controller.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Controlador del juego Balatro. Conecta el modelo y la vista
 *   sin contener lógica de juego ni lógica de presentación.
 *
 *   Tras la refactorización de la vista, el acceso se hace a través de las
 *   dos superficies que expone {@link BalatroView}:
 *   - `view.inputs`   → suscripción a eventos del jugador.
 *   - `view.renderer` → actualización del DOM en respuesta al modelo.
 *
 *   Flujo de comunicación:
 *     Vista → inputs → Controlador → Modelo → eventos → Controlador → renderer
 */

import {BalatroModel} from '../model/game/balatro-model';
import {BalatroView} from '../view/balatro-view';

/**
 * Controlador del Small Blind de Balatro.
 *   Se instancia con un modelo y una vista ya construidos. {@link run}
 *   realiza todo el cableado y arranca la primera partida.
 */
export class BalatroController {
  /**
   * @param model Instancia del modelo del juego.
   * @param view  Instancia de la fachada de la vista.
   */
  constructor(
    private readonly model: BalatroModel,
    private readonly view: BalatroView,
  ) { }

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
   * Suscribe los eventos del modelo a los métodos de rendering.
   * Todos los updates del DOM pasan por `view.renderer`.
   */
  private wireModelToView(): void {
    this.model.onGameStarted((data) => {
      this.view.getViewRenderer().onGameStarted(data);
    });

    this.model.onCardToggled((data) => {
      this.view.getViewRenderer().onCardToggled(
          data,
          this.model.getHandsRemaining(),
          this.model.getDiscardsRemaining(),
          this.model.getSelectedCardIndices().size);
    });

    this.model.onHandPlayed((data) => {
      this.view.getViewRenderer().onHandPlayed(data);
    });

    this.model.onCardsDiscarded((data) => {
      this.view.getViewRenderer().onCardsDiscarded(data);
    });

    this.model.onScorePreview((data) => {
      this.view.getViewRenderer().onScorePreview(data);
    });

    this.model.onGameEnded((data) => {
      this.view.getViewRenderer().onGameEnded(data);
    });
  }

  /**
   * Suscribe los eventos de input del jugador a las acciones del modelo.
   * Todos los inputs del jugador pasan por `view.inputs`.
   */
  private wireViewToModel(): void {
    this.view.getInputRouter().onCardClicked((cardIndex) => {
      this.model.toggleCard(cardIndex);
    });

    this.view.getInputRouter().onPlayHand(() => {
      this.model.playHand();
    });

    this.view.getInputRouter().onDiscard(() => {
      this.model.discard();
    });

    this.view.getInputRouter().onNewGame(() => {
      this.model.startGame();
    });

    this.view.getInputRouter().onSortHand((criterion) => {
      this.model.sortHand(criterion);
      this.view.getViewRenderer().onHandSorted(
          this.model.getHand(),
          this.model.getSelectedCardIndices(),
          this.model.getHandsRemaining(),
          this.model.getDiscardsRemaining(),
      );
    });

    this.view.getInputRouter().onHandInfo(() => {
      this.view.getHandInfoView().open();
    });
  }
}
