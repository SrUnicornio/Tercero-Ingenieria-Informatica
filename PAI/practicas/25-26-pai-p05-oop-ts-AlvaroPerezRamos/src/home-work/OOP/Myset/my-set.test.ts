import { describe, expect, beforeEach, test } from '@jest/globals';
import { MySet } from './my-set';

describe('MySet', () => {
  let setA: MySet;
  let setB: MySet;
  let emptySet: MySet;

  beforeEach(() => {
    setA = new MySet([1, 2, 3]);
    setB = new MySet([3, 4, 5]);
    emptySet = new MySet();
  });

  /* ---------------- BASIC OPERATIONS ---------------- */

  test('add inserts element only once', () => {
    setA.add(2);
    expect(setA.toString()).toBe('{1, 2, 3}');
  });

  test('has detects membership', () => {
    expect(setA.has(2)).toBe(true);
    expect(setA.has(10)).toBe(false);
  });

  test('size returns cardinality', () => {
    expect(setA.size()).toBe(3);
    expect(emptySet.size()).toBe(0);
  });

  test('empty set detection', () => {
    expect(emptySet.isEmpty()).toBe(true);
    expect(setA.isEmpty()).toBe(false);
  });

  /* ---------------- SET ALGEBRA ---------------- */

  test('union', () => {
    const result = setA.union(setB);
    expect(result.toString()).toBe('{1, 2, 3, 4, 5}');
  });

  test('intersection', () => {
    const result = setA.intersection(setB);
    expect(result.toString()).toBe('{3}');
  });

  test('difference', () => {
    const result = setA.difference(setB);
    expect(result.toString()).toBe('{1, 2}');
  });

  /* ---------------- RELATIONS ---------------- */

  test('subset relation', () => {
    const subset = new MySet([1, 2]);
    expect(subset.isSubsetOf(setA)).toBe(true);
    expect(setA.isSubsetOf(subset)).toBe(false);
  });

  test('disjoint sets', () => {
    const disjoint = new MySet([8, 9]);
    expect(setA.isDisjointFrom(disjoint)).toBe(true);
  });

  test('equal sets', () => {
    const copy = new MySet([1, 2, 3]);
    expect(setA.isEqual(copy)).toBe(true);
  });

  /* ---------------- ALGEBRAIC PROPERTIES ---------------- */

  test('union commutativity', () => {
    expect(setA.union(setB).toString())
      .toBe(setB.union(setA).toString());
  });

  test('intersection commutativity', () => {
    expect(setA.intersection(setB).toString())
      .toBe(setB.intersection(setA).toString());
  });

  test('A ∪ ∅ = A', () => {
    expect(setA.union(emptySet).isEqual(setA)).toBe(true);
  });

  test('A ∩ ∅ = ∅', () => {
    expect(setA.intersection(emptySet).isEmpty()).toBe(true);
  });
});