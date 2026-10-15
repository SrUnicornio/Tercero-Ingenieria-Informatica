/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file event.test.ts
 * @description Tests unitarios de la clase genérica Event<T>.
 *   Cubre registro de listeners, disparo de eventos, orden de notificación
 *   y comportamiento con múltiples suscriptores.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {Event} from '../hangman/observer/event';
import {describe, it, expect, jest} from '@jest/globals';

describe('Event<T>', () => {
  // ── Registro de listeners ──────────────────────────────────────────────

  describe('addListener', () => {
    it('debe registrar un listener que se invoca al hacer trigger', () => {
      const event = new Event<number>();
      const listener = jest.fn();

      event.addListener(listener);
      event.trigger(42);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(42);
    });

    it('debe registrar múltiples listeners independientes', () => {
      const event = new Event<string>();
      const firstListener = jest.fn();
      const secondListener = jest.fn();

      event.addListener(firstListener);
      event.addListener(secondListener);
      event.trigger('hola');

      expect(firstListener).toHaveBeenCalledWith('hola');
      expect(secondListener).toHaveBeenCalledWith('hola');
    });

    it('debe permitir registrar el mismo listener más de una vez', () => {
      const event = new Event<void>();
      const listener = jest.fn();

      event.addListener(listener);
      event.addListener(listener);
      event.trigger(undefined as unknown as void);

      // Registrado dos veces → se invoca dos veces
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  // ── Disparo de eventos ─────────────────────────────────────────────────

  describe('trigger', () => {
    it('no debe lanzar error si no hay listeners registrados', () => {
      const event = new Event<number>();
      expect(() => event.trigger(1)).not.toThrow();
    });

    it('debe pasar el dato exacto al listener', () => {
      const event = new Event<{ letter: string; count: number }>();
      const listener = jest.fn();

      event.addListener(listener);
      event.trigger({letter: 'a', count: 3});

      expect(listener).toHaveBeenCalledWith({letter: 'a', count: 3});
    });

    it('debe invocar los listeners en el orden en que fueron registrados', () => {
      const event = new Event<number>();
      const callOrder: number[] = [];

      event.addListener(() => callOrder.push(1));
      event.addListener(() => callOrder.push(2));
      event.addListener(() => callOrder.push(3));
      event.trigger(0);

      expect(callOrder).toEqual([1, 2, 3]);
    });

    it('debe disparar correctamente en múltiples llamadas sucesivas', () => {
      const event = new Event<number>();
      const receivedValues: number[] = [];

      event.addListener((value: number) => receivedValues.push(value));
      event.trigger(10);
      event.trigger(20);
      event.trigger(30);

      expect(receivedValues).toEqual([10, 20, 30]);
    });
  });

  // ── Tipado genérico ────────────────────────────────────────────────────

  describe('tipado genérico', () => {
    it('debe funcionar con tipo booleano', () => {
      const event = new Event<boolean>();
      const listener = jest.fn();

      event.addListener(listener);
      event.trigger(true);

      expect(listener).toHaveBeenCalledWith(true);
    });

    it('debe funcionar con tipo objeto complejo', () => {
      interface Payload {
        readonly playerWon: boolean;
        readonly secretWord: string;
      }

      const event = new Event<Payload>();
      const listener = jest.fn();

      event.addListener(listener);
      event.trigger({playerWon: false, secretWord: 'tigre'});

      expect(listener).toHaveBeenCalledWith({
        playerWon: false,
        secretWord: 'tigre',
      });
    });
  });
});
