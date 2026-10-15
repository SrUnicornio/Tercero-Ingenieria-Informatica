/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Add one second Tests.
 *   Tests for the addOneSecond function, which adds one second to a given time and returns the new time.
 *   Also includes tests for the validateTime function, which validates that a given time is within the correct ranges,
 *   and the formatTime function, which formats a Time object into a string representation.
 * 
 * @see {@link https://jutge.org/problems/P91173_en}
 */

import { describe, expect, test } from '@jest/globals';
import { addOneSecond, validateTime, formatTime, Time, } from './add-one-second-P34279';

/* ----------------------------- DOMAIN TESTS ------------------------------ */

describe('addOneSecond', () => {
  test('full rollover', () => {
    const t: Time = { hours: 23, minutes: 59, seconds: 59 };

    expect(addOneSecond(t)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  test('normal increment', () => {
    const t: Time = { hours: 10, minutes: 10, seconds: 10 };

    expect(addOneSecond(t)).toEqual({
      hours: 10,
      minutes: 10,
      seconds: 11,
    });
  });

  test('minute overflow', () => {
    const t: Time = { hours: 1, minutes: 5, seconds: 59 };

    expect(addOneSecond(t)).toEqual({
      hours: 1,
      minutes: 6,
      seconds: 0,
    });
  });

  test('hour overflow', () => {
    const t: Time = { hours: 7, minutes: 59, seconds: 59 };

    expect(addOneSecond(t)).toEqual({
      hours: 8,
      minutes: 0,
      seconds: 0,
    });
  });
});

/* ---------------------------- VALIDATION TESTS --------------------------- */

describe('validateTime', () => {
  test('valid time', () => {
    expect(() => validateTime(12, 30, 30)).not.toThrow();
  });

  test('invalid hours', () => {
    expect(() => validateTime(24, 0, 0)).toThrow();
  });

  test('invalid minutes', () => {
    expect(() => validateTime(10, 60, 0)).toThrow();
  });

  test('invalid seconds', () => {
    expect(() => validateTime(10, 0, 60)).toThrow();
  });
});

/* ----------------------------- FORMAT TESTS ------------------------------ */

describe('formatTime', () => {
  test('leading zeros', () => {
    expect(
      formatTime({ hours: 1, minutes: 2, seconds: 3 }),
    ).toBe('01:02:03');
  });
});

/* ----------------------------- Jutge TESTS ------------------------------ */

describe('Jutge test cases', () => {
  test('case 1', () => {
    const t: Time = { hours: 11, minutes: 33, seconds: 15 };
    expect(formatTime(addOneSecond(t))).toBe('11:33:16');
  });

  test('case 2', () => {
    const t: Time = { hours: 19, minutes: 45, seconds: 59 };
    expect(formatTime(addOneSecond(t))).toBe('19:46:00');
  });

  test('case 3', () => {
    const t: Time = { hours: 12, minutes: 59, seconds: 59 };
    expect(formatTime(addOneSecond(t))).toBe('13:00:00');
  });

  test('case 4', () => {
    const t: Time = { hours: 3, minutes: 5, seconds: 9 };
    expect(formatTime(addOneSecond(t))).toBe('03:05:10');
  });

  test('case 5', () => {
    const t: Time = { hours: 0, minutes: 1, seconds: 2 };
    expect(formatTime(addOneSecond(t))).toBe('00:01:03');
  });
});