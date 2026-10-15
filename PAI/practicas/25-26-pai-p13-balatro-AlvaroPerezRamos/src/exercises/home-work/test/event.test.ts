/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file event.test.ts
 * @description Tests unitarios de la clase genérica Event<T>.
 *   Cubre registro de listeners, disparo de eventos, orden de
 *   notificación y comportamiento con múltiples suscriptores.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {Event} from '../balatro/observer/event';
import {describe, it, expect, vitest} from 'vitest';

describe('Event<T>', () => {
  describe('addListener', () => {
    it('debe registrar un listener que se invoca al hacer trigger', () => {
      const event = new Event<number>();
      const listener = vitest.fn();

      event.addListener(listener);
      event.trigger(42);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(42);
    });

    it('debe registrar múltiples listeners independientes', () => {
      const event = new Event<string>();
      const firstListener = vitest.fn();
      const secondListener = vitest.fn();

      event.addListener(firstListener);
      event.addListener(secondListener);
      event.trigger('balatro');

      expect(firstListener).toHaveBeenCalledWith('balatro');
      expect(secondListener).toHaveBeenCalledWith('balatro');
    });

    it('debe permitir registrar el mismo listener más de una vez', () => {
      const event = new Event<void>();
      const listener = vitest.fn();

      event.addListener(listener);
      event.addListener(listener);
      event.trigger(undefined as unknown as void);

      // Registrado dos veces → se invoca dos veces
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe('removeAllListeners', () => {
    it('debe eliminar todos los listeners registrados', () => {
      const event = new Event<number>();
      const listener1 = vitest.fn();
      const listener2 = vitest.fn();

      event.addListener(listener1);
      event.addListener(listener2);
      event.removeAllListeners();
      event.trigger(100);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('debe permitir registrar nuevos listeners después de eliminar', () => {
      const event = new Event<string>();
      const oldListener = vitest.fn();
      const newListener = vitest.fn();

      event.addListener(oldListener);
      event.removeAllListeners();
      event.addListener(newListener);
      event.trigger('nuevo evento');

      expect(oldListener).not.toHaveBeenCalled();
      expect(newListener).toHaveBeenCalledWith('nuevo evento');
    });
  });

  // ── trigger ────────────────────────────────────────────────────────────

  describe('trigger', () => {
    it('no debe lanzar error si no hay listeners registrados', () => {
      const event = new Event<number>();
      expect(() => event.trigger(1)).not.toThrow();
    });

    it('debe pasar el dato exacto al listener', () => {
      const event = new Event<{handName: string; chips: number}>();
      const listener = vitest.fn();

      event.addListener(listener);
      event.trigger({handName: 'Flush', chips: 35});

      expect(listener).toHaveBeenCalledWith({handName: 'Flush', chips: 35});
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

  // ── tipado genérico ────────────────────────────────────────────────────

  describe('tipado genérico', () => {
    it('debe funcionar con tipo booleano', () => {
      const event = new Event<boolean>();
      const listener = vitest.fn();

      event.addListener(listener);
      event.trigger(true);

      expect(listener).toHaveBeenCalledWith(true);
    });

    it('debe funcionar con un payload de tipo HandPlayedData', () => {
      interface HandPlayedPayload {
        readonly handName: string;
        readonly roundScore: number;
        readonly playerWon: boolean;
      }

      const event = new Event<HandPlayedPayload>();
      const listener = vitest.fn();

      event.addListener(listener);
      event.trigger({handName: 'Pair', roundScore: 24, playerWon: false});

      expect(listener).toHaveBeenCalledWith({
        handName: 'Pair',
        roundScore: 24,
        playerWon: false,
      });
    });
  });
});
