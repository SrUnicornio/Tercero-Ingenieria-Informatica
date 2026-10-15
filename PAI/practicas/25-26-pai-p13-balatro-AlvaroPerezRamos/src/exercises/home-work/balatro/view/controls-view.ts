/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file controls-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Vista del bloque de controles (Bloque 6). Gestiona los botones
 *   de acción (Play Hand, Discard, New Game, Hand Info, Sort Hand), los
 *   contadores de manos y descartes restantes, y el dialog de resultado
 *   de partida (victoria / derrota).
 */

import {Event} from '../observer/event';

/** ID del dialog de resultado de partida en el DOM. */
const GAME_RESULT_MODAL_ID = 'game-result-modal';
/** ID del elemento de mensaje dentro del dialog de resultado. */
const GAME_RESULT_MESSAGE_ID = 'game-result-message';
/** ID del botón de cierre del dialog de resultado. */
const GAME_RESULT_CLOSE_ID = 'game-result-close';

/**
 * Vista del bloque de controles del juego.
 *   Gestiona botones, contadores y el dialog de fin de partida.
 */
export class ControlsView {
  private readonly playHandEvent = new Event<void>();
  private readonly discardEvent = new Event<void>();
  private readonly newGameEvent = new Event<void>();
  private readonly infoButtonEvent = new Event<void>();
  private readonly sortHandEvent = new Event<'rank' | 'suit'>();
  private currentSortCriterion: 'rank' | 'suit' = 'rank';

  /** Dialog nativo HTML para mostrar el resultado de la partida. */
  private readonly gameResultModal: HTMLDialogElement;
  /** Elemento de texto dentro del dialog de resultado. */
  private readonly gameResultMessage: HTMLElement;

  constructor(
    private readonly playHandButton: HTMLButtonElement,
    private readonly discardButton: HTMLButtonElement,
    private readonly newGameButton: HTMLButtonElement,
    private readonly infoButton: HTMLButtonElement,
    private readonly handsLeftDisplay: HTMLElement,
    private readonly discardsLeftDisplay: HTMLElement,
    private readonly sortHandButton: HTMLButtonElement,
  ) {
    this.gameResultModal = this.getDialogElement(GAME_RESULT_MODAL_ID);
    this.gameResultMessage = this.getElement(GAME_RESULT_MESSAGE_ID);

    this.playHandButton.addEventListener(
        'click', () => this.playHandEvent.trigger(undefined as void),
    );
    this.discardButton.addEventListener(
        'click', () => this.discardEvent.trigger(undefined as void),
    );
    this.newGameButton.addEventListener(
        'click', () => this.newGameEvent.trigger(undefined as void),
    );
    this.infoButton.addEventListener(
        'click', () => this.infoButtonEvent.trigger(undefined as void),
    );
    this.updateSortButtonLabel();
    this.sortHandButton.addEventListener('click', () => {
      this.sortHandEvent.trigger(this.currentSortCriterion);
      this.currentSortCriterion =
        this.currentSortCriterion === 'rank' ? 'suit' : 'rank';
      this.updateSortButtonLabel();
    });

    // El botón "New Game" dentro del dialog de resultado cierra el modal
    // y dispara el mismo evento que el botón New Game del bloque 6.
    const closeButton = document.getElementById(GAME_RESULT_CLOSE_ID);
    closeButton?.addEventListener('click', () => {
      this.gameResultModal.close();
      this.newGameEvent.trigger(undefined as void);
    });
  }

  /**
   * Registra un listener para el clic en "Hand Info".
   * @param listener Función invocada cuando el jugador pulsa el botón.
   */
  onHandInfo(listener: () => void): void {
    this.infoButtonEvent.addListener(listener);
  }

  /** Registra un listener para el clic en "Play Hand". */
  onPlayHand(listener: () => void): void {
    this.playHandEvent.addListener(listener);
  }

  /** Registra un listener para el clic en "Discard". */
  onDiscard(listener: () => void): void {
    this.discardEvent.addListener(listener);
  }

  /** Registra un listener para el clic en "New Game". */
  onNewGame(listener: () => void): void {
    this.newGameEvent.addListener(listener);
  }

  /**
   * Registra un listener para el clic en "Sort Hand".
   * @param listener Función invocada con el criterio 'rank' | 'suit'.
   */
  onSortHand(listener: (criterion: 'rank' | 'suit') => void): void {
    this.sortHandEvent.addListener(listener);
  }

  /**
   * Habilita o deshabilita los botones según el estado del juego.
   * @param hasSelection - Si hay cartas seleccionadas.
   * @param handsLeft - Manos restantes.
   * @param discardsLeft - Descartes restantes.
   * @param isGameOver - Si la partida ha terminado.
   */
  updateButtonStates(
      hasSelection: boolean,
      handsLeft: number,
      discardsLeft: number,
      isGameOver: boolean,
  ): void {
    this.playHandButton.disabled =
      !hasSelection || handsLeft <= 0 || isGameOver;
    this.discardButton.disabled =
      !hasSelection || discardsLeft <= 0 || isGameOver;
  }

  /**
   * Actualiza los contadores de manos y descartes restantes.
   * @param handsLeft - Manos restantes (null para no actualizar).
   * @param discardsLeft - Descartes restantes (null para no actualizar).
   */
  updateCounters(handsLeft: number | null, discardsLeft: number | null): void {
    if (handsLeft !== null && handsLeft >= 0) {
      this.handsLeftDisplay.textContent = String(handsLeft);
    }
    if (discardsLeft !== null && discardsLeft >= 0) {
      this.discardsLeftDisplay.textContent = String(discardsLeft);
    }
  }

  /**
   * Muestra el dialog de fin de partida con el resultado.
   *   Usa `showModal()` del elemento `<dialog>` nativo para garantizar
   *   que queda sobre cualquier otro contenido de la página.
   * @param playerWon - Si el jugador ha ganado.
   * @param finalScore - Puntuación final acumulada.
   */
  showGameResult(playerWon: boolean, finalScore: number): void {
    this.gameResultModal.classList.remove(
        'game-result-modal--win',
        'game-result-modal--loss',
    );
    if (playerWon) {
      this.gameResultMessage.textContent = `¡Nivel superado! ${finalScore} chips`;
      this.gameResultModal.classList.add('game-result-modal--win');
    } else {
      this.gameResultMessage.textContent =
        `Partida terminada. ${finalScore} chips`;
      this.gameResultModal.classList.add('game-result-modal--loss');
    }
    this.gameResultModal.showModal();
  }

  /**
   * Prepara la vista para una nueva partida.
   *   Cierra el dialog de resultado si estuviera abierto y resetea contadores.
   */
  resetForNewGame(): void {
    this.updateCounters(0, 0);
    this.updateButtonStates(false, 0, 0, false);
    if (this.gameResultModal.open) {
      this.gameResultModal.close();
    }
  }

  // ── Métodos privados ──────────────────────────────────────────────────────

  /**
   * Obtiene un elemento del DOM por su ID con tipo seguro.
   * @throws {Error} Si el elemento no existe.
   */
  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Elemento DOM no encontrado: #${id}`);
    return element;
  }

  /**
   * Obtiene un `<dialog>` del DOM por su ID.
   * @throws {Error} Si el elemento no existe o no es un dialog.
   */
  private getDialogElement(id: string): HTMLDialogElement {
    const element = document.getElementById(id) as HTMLDialogElement | null;
    if (!element) throw new Error(`Dialog DOM no encontrado: #${id}`);
    return element;
  }

  /**
   * Actualiza el texto del botón Sort para reflejar el criterio activo.
   */
  private updateSortButtonLabel(): void {
    const currentLabel = this.currentSortCriterion === 'rank' ? 'Rank' : 'Suit';
    this.sortHandButton.textContent = `Sort: ${currentLabel}`;
  }
}
