/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file game-state.ts
 * @description Tipos de datos emitidos por los eventos del modelo,
 *   e interfaces compartidas entre capas.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

/**
 * Par palabra–categoría devuelto por un WordProvider.
 */
export interface WordEntry {
  readonly word: string;
  readonly category: string;
}

/**
 * Contrato que debe cumplir cualquier proveedor de palabras
 * inyectado en HangmanModel.
 */
export type WordProvider = () => WordEntry;

/**
 * Clase base abstracta para fuentes de palabras.
 * Cada categoría concreta extiende esta clase, define su etiqueta
 * y proporciona una palabra aleatoria de su diccionario interno.
 *
 * Las subclases deben encapsular su lista de palabras como miembro
 * privado de la clase, sin constantes globales.
 */
export abstract class WordCategory {
  /** Etiqueta de la categoría visible al jugador (ej: "Países", "Animales"). */
  abstract readonly label: string;

  /**
   * Devuelve una palabra aleatoria de esta categoría.
   * @returns Cadena con la palabra seleccionada.
   */
  abstract getWord(): string;
}

/**
 * Dato emitido cuando el jugador acierta una letra.
 */
export interface LetterHitData {
  readonly letter: string;
  readonly positions: readonly number[];
}

/**
 * Dato emitido cuando el jugador falla una letra.
 */
export interface LetterMissData {
  readonly letter: string;
  readonly failCount: number;
}

/**
 * Dato emitido al terminar la partida.
 */
export interface GameOverData {
  readonly playerWon: boolean;
  readonly secretWord: string;
}

/**
 * Dato emitido al iniciar una nueva partida.
 */
export interface NewGameData {
  readonly wordLength: number;
  readonly category: string;
  readonly word: string;
}
