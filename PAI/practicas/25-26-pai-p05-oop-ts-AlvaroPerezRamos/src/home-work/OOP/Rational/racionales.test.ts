import { describe, test, expect, beforeEach } from '@jest/globals';
import { Racional, parseRational } from './racionales';

describe('Racional', () => {
  let half: Racional;
  let third: Racional;

  beforeEach(() => {
    half = new Racional(1, 2);
    third = new Racional(1, 3);
  });

  /* ---------------- CONSTRUCTOR ---------------- */

  test('simplifies fractions automatically', () => {
    expect(new Racional(2, 4).toString()).toBe('1/2');
  });

  test('normalizes negative denominator', () => {
    expect(new Racional(1, -2).toString()).toBe('-1/2');
  });

  test('throws if denominator is zero', () => {
    expect(() => new Racional(1, 0)).toThrow();
  });

  /* ---------------- ARITHMETIC ---------------- */

  test('addition', () => {
    expect(half.add(third).toString()).toBe('5/6');
  });

  test('subtraction', () => {
    expect(half.subtract(third).toString()).toBe('1/6');
  });

  test('multiplication', () => {
    expect(half.multiply(third).toString()).toBe('1/6');
  });

  test('division', () => {
    expect(half.divide(third).toString()).toBe('3/2');
  });

  test('division by zero throws', () => {
    expect(() =>
      half.divide(new Racional(0, 1)),
    ).toThrow();
  });

  /* ---------------- COMPARISON ---------------- */

  test('equals', () => {
    expect(new Racional(2, 4).equals(half)).toBe(true);
  });

  test('lessThan', () => {
    expect(third.lessThan(half)).toBe(true);
  });

  test('greaterThan', () => {
    expect(half.greaterThan(third)).toBe(true);
  });

  /* ---------------- PARSE ---------------- */

  test('parse rational', () => {
    expect(parseRational('3/4').toString()).toBe('3/4');
  });

  test('parse integer', () => {
    expect(parseRational('5').toString()).toBe('5');
  });

  test('invalid format throws', () => {
    expect(() => parseRational('1/2/3')).toThrow();
  });
});