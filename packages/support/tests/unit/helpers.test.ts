import { describe, expect, test } from 'bun:test';
import { deepClone } from '../../src/utils/helpers.ts';

describe('deepClone', () => {
  test('should return primitives as-is', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBeNull();
  });

  test('should clone arrays', () => {
    const original = [1, 2, [3, 4]];
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[2]).not.toBe(original[2]);
  });

  test('should clone Date instances', () => {
    const original = new Date('2025-01-01T00:00:00Z');
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.getTime()).toBe(original.getTime());
    expect(cloned).toBeInstanceOf(Date);
  });

  test('should clone Map instances', () => {
    const original = new Map<string, number>([
      ['a', 1],
      ['b', 2],
    ]);
    const cloned = deepClone(original);
    expect(cloned.get('a')).toBe(1);
    expect(cloned.get('b')).toBe(2);
    expect(cloned).not.toBe(original);
    expect(cloned).toBeInstanceOf(Map);
  });

  test('should deep clone Map values', () => {
    const inner = { x: 1 };
    const original = new Map([['key', inner]]);
    const cloned = deepClone(original);
    expect(cloned.get('key')).toEqual(inner);
    expect(cloned.get('key')).not.toBe(inner);
  });

  test('should clone Set instances', () => {
    const original = new Set([1, 2, 3]);
    const cloned = deepClone(original);
    expect(cloned.size).toBe(3);
    expect(cloned.has(1)).toBe(true);
    expect(cloned.has(2)).toBe(true);
    expect(cloned.has(3)).toBe(true);
    expect(cloned).not.toBe(original);
    expect(cloned).toBeInstanceOf(Set);
  });

  test('should deep clone Set values', () => {
    const inner = { x: 1 };
    const original = new Set([inner]);
    const cloned = deepClone(original);
    const clonedValues = [...cloned];
    expect(clonedValues[0]).toEqual(inner);
    expect(clonedValues[0]).not.toBe(inner);
  });

  test('should clone nested plain objects', () => {
    const original = { a: 1, b: { c: 2, d: { e: 3 } } };
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.b.d).not.toBe(original.b.d);
  });

  test('should only clone own properties', () => {
    const proto = { inherited: true };
    const original = Object.create(proto);
    original.own = 'value';
    const cloned = deepClone(original);
    expect(cloned.own).toBe('value');
    expect(cloned.inherited).toBeUndefined();
  });
});
