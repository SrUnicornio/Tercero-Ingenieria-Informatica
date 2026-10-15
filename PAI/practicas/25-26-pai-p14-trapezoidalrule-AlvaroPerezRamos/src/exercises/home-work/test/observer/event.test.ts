/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file event.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Tests unitarios de Event<PayloadType>.
 *
 *   Se usa vi.fn() para espiar las llamadas a los listeners y
 *   verificar que se invocan con el payload correcto.
 */

import {describe, it, expect, vi} from 'vitest';
import {Event} from '../../trapezoid/observer/event.js';

describe('Event', () => {
  describe('addListener / trigger', () => {
    it('invoca el listener registrado con el payload correcto', () => {
      const event = new Event<number>();
      const listener = vi.fn();

      event.addListener(listener);
      event.trigger(42);

      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(42);
    });

    it('invoca todos los listeners registrados en orden de registro', () => {
      const event = new Event<string>();
      const callOrder: number[] = [];
      const firstListener = vi.fn(() => callOrder.push(1));
      const secondListener = vi.fn(() => callOrder.push(2));

      event.addListener(firstListener);
      event.addListener(secondListener);
      event.trigger('hello');

      expect(callOrder).toEqual([1, 2]);
    });

    it('invoca el mismo listener tantas veces como fue registrado', () => {
      const event = new Event<boolean>();
      const listener = vi.fn();

      event.addListener(listener);
      event.addListener(listener);
      event.trigger(true);

      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('no invoca ningún listener si no se han registrado', () => {
      const event = new Event<number>();
      expect(() => event.trigger(1)).not.toThrow();
    });

    it('transporta correctamente un payload de tipo objeto', () => {
      const event = new Event<{x: number; y: number}>();
      const listener = vi.fn();

      event.addListener(listener);
      event.trigger({x: 3, y: 7});

      expect(listener).toHaveBeenCalledWith({x: 3, y: 7});
    });
  });

  describe('removeAllListeners', () => {
    it('no invoca ningún listener tras eliminarlos', () => {
      const event = new Event<number>();
      const listener = vi.fn();

      event.addListener(listener);
      event.removeAllListeners();
      event.trigger(99);

      expect(listener).not.toHaveBeenCalled();
    });

    it('permite añadir listeners nuevos después de eliminar los anteriores', () => {
      const event = new Event<number>();
      const oldListener = vi.fn();
      const newListener = vi.fn();

      event.addListener(oldListener);
      event.removeAllListeners();
      event.addListener(newListener);
      event.trigger(1);

      expect(oldListener).not.toHaveBeenCalled();
      expect(newListener).toHaveBeenCalledOnce();
    });
  });

  describe('múltiples triggers', () => {
    it('invoca el listener cada vez que se llama a trigger', () => {
      const event = new Event<number>();
      const listener = vi.fn();

      event.addListener(listener);
      event.trigger(1);
      event.trigger(2);
      event.trigger(3);

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenNthCalledWith(1, 1);
      expect(listener).toHaveBeenNthCalledWith(2, 2);
      expect(listener).toHaveBeenNthCalledWith(3, 3);
    });
  });
});
