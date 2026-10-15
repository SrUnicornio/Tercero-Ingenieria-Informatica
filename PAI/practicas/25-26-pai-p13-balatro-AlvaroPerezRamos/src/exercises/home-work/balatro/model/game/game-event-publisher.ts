/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file game-event-publisher.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Publicador de eventos del modelo Balatro.
 *   Agrupa los seis canales {@link Event} y los métodos `onXxx(listener)`
 *   que permiten al controlador suscribirse a los cambios de estado del juego.
 *
 *   Responsabilidad única: gestionar la comunicación saliente del modelo.
 *   No contiene lógica de juego ni conoce la vista.
 *
 *   Separado de {@link GameActions} para que cada clase tenga una sola
 *   razón de cambio (SRP):
 *   - Si cambia el protocolo de eventos → solo cambia este fichero.
 *   - Si cambia la lógica del juego     → solo cambia GameActions.
 */

import {Event} from '../../observer/event';
import {
  type GameStartedData,
  type CardToggledData,
  type HandPlayedData,
  type CardsDiscardedData,
  type ScorePreviewData,
  type GameEndedData,
} from '../../types/event-payloads';

/**
 * Publicador de los seis eventos de estado del juego Balatro.
 *   Instanciado por BalatroModel y pasado a GameActions
 *   para que pueda emitir cuando la lógica lo requiera.
 *
 *   Los canales son `readonly` internamente pero se exponen a GameActions
 *   mediante el método `channels` para que solo este fichero controle la API
 *   de suscripción pública (`onXxx`).
 */
export class GameEventPublisher {
  // ── Canales internos ──────────────────────────────────────────────────────
  private readonly gameStartedChannel = new Event<GameStartedData>();
  private readonly cardToggledChannel = new Event<CardToggledData>();
  private readonly handPlayedChannel = new Event<HandPlayedData>();
  private readonly cardsDiscardedChannel = new Event<CardsDiscardedData>();
  private readonly scorePreviewChannel = new Event<ScorePreviewData>();
  private readonly gameEndedChannel = new Event<GameEndedData>();

  // ── API de suscripción (pública hacia el controlador) ─────────────────────

  /**
   * Registra un listener para el inicio/reinicio de partida.
   * @param listener Función llamada con la mano inicial y el mazo restante.
   */
  onGameStarted(listener: (data: GameStartedData) => void): void {
    this.gameStartedChannel.addListener(listener);
  }

  /**
   * Registra un listener para el cambio de selección de carta.
   * @param listener Función llamada con índice y estado de selección.
   */
  onCardToggled(listener: (data: CardToggledData) => void): void {
    this.cardToggledChannel.addListener(listener);
  }

  /**
   * Registra un listener para la mano jugada.
   * @param listener Función llamada con resultado y nuevo estado de recursos.
   */
  onHandPlayed(listener: (data: HandPlayedData) => void): void {
    this.handPlayedChannel.addListener(listener);
  }

  /**
   * Registra un listener para el descarte de cartas.
   * @param listener Función llamada con cartas nuevas y estado actualizado.
   */
  onCardsDiscarded(listener: (data: CardsDiscardedData) => void): void {
    this.cardsDiscardedChannel.addListener(listener);
  }

  /**
   * Registra un listener para la previsualización de puntuación.
   * @param listener Función llamada con la jugada detectada en la selección.
   */
  onScorePreview(listener: (data: ScorePreviewData) => void): void {
    this.scorePreviewChannel.addListener(listener);
  }

  /**
   * Registra un listener para el fin de partida.
   * @param listener Función llamada con resultado y puntuación final.
   */
  onGameEnded(listener: (data: GameEndedData) => void): void {
    this.gameEndedChannel.addListener(listener);
  }

  // ── API de emisión (paquete interno, usada solo por GameActions) ──────────

  /**
   * Expone los canales de emisión a GameActions.
   *   Se devuelve un objeto con referencias a los `trigger` de cada canal
   *   para que GameActions pueda emitir sin acceder a los canales directamente.
   *   Mantiene el encapsulamiento: solo GameEventPublisher instancia los Event.
   * @returns Objeto con los métodos `trigger` de cada canal.
   */
  channels(): GameEventChannels {
    return {
      triggerGameStarted: (data) => this.gameStartedChannel.trigger(data),
      triggerCardToggled: (data) => this.cardToggledChannel.trigger(data),
      triggerHandPlayed: (data) => this.handPlayedChannel.trigger(data),
      triggerCardsDiscarded: (data) => this.cardsDiscardedChannel.trigger(data),
      triggerScorePreview: (data) => this.scorePreviewChannel.trigger(data),
      triggerGameEnded: (data) => this.gameEndedChannel.trigger(data),
    };
  }
}

/**
 * @interface GameEventChannels
 * Métodos de emisión que GameActions puede invocar.
 *   Cada método corresponde a uno de los seis eventos del juego.
 */
export interface GameEventChannels {
  readonly triggerGameStarted: (data: GameStartedData) => void;
  readonly triggerCardToggled: (data: CardToggledData) => void;
  readonly triggerHandPlayed: (data: HandPlayedData) => void;
  readonly triggerCardsDiscarded: (data: CardsDiscardedData) => void;
  readonly triggerScorePreview: (data: ScorePreviewData) => void;
  readonly triggerGameEnded: (data: GameEndedData) => void;
}
