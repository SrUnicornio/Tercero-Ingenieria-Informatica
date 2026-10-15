/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file card-types.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Tipos primitivos de la baraja francesa compartidos por
 *   {@link Card}, {@link Deck} y el evaluador de manos.
 *   Se separan de los payloads de evento para que Card no dependa de
 *   game-types y el grafo de dependencias sea acíclico.
 */

/**
 * @typedef Suit
 * Los cuatro palos de la baraja francesa.
 */
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

/**
 * @typedef RankLabel
 * Etiquetas visibles de las cartas en orden de rango ascendente.
 */
export type RankLabel =
  '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A';
