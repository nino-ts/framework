import { describe, expect, it } from 'bun:test';
import { Collection } from '../../src/collection.ts';

describe('Collection', () => {
  describe('constructor', () => {
    it('initializes with array of items', () => {
      const collection = new Collection([1, 2, 3]);
      expect(collection.toArray()).toEqual([1, 2, 3]);
    });

    it('initializes with empty array', () => {
      const collection = new Collection([]);
      expect(collection.toArray()).toEqual([]);
    });

    it('accepts objects in constructor', () => {
      const items = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
      const collection = new Collection(items);
      expect(collection.toArray()).toEqual(items);
    });
  });

  describe('map', () => {
    it('applies function to each item', () => {
      const collection = new Collection([1, 2, 3]);
      const result = collection.map((x) => x * 2);
      expect(result.toArray()).toEqual([2, 4, 6]);
    });

    it('transforms objects', () => {
      const items = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
      const collection = new Collection(items);
      const result = collection.map((item) => item.name);
      expect(result.toArray()).toEqual(['John', 'Jane']);
    });

    it('returns new Collection instance', () => {
      const collection = new Collection([1, 2, 3]);
      const result = collection.map((x) => x * 2);
      expect(result).toBeInstanceOf(Collection);
      expect(collection.toArray()).toEqual([1, 2, 3]); // original unchanged
    });
  });

  describe('filter', () => {
    it('filters items based on predicate', () => {
      const collection = new Collection([1, 2, 3, 4, 5]);
      const result = collection.filter((x) => x % 2 === 0);
      expect(result.toArray()).toEqual([2, 4]);
    });

    it('filters objects by condition', () => {
      const items = [
        { active: true, id: 1 },
        { active: false, id: 2 },
        { active: true, id: 3 },
      ];
      const collection = new Collection(items);
      const result = collection.filter((item) => item.active);
      expect(result.toArray()).toHaveLength(2);
    });

    it('returns empty collection if no items match', () => {
      const collection = new Collection([1, 2, 3]);
      const result = collection.filter((x) => x > 10);
      expect(result.toArray()).toEqual([]);
    });

    it('returns new Collection instance', () => {
      const collection = new Collection([1, 2, 3]);
      const result = collection.filter((x) => x > 1);
      expect(result).toBeInstanceOf(Collection);
    });
  });

  describe('reduce', () => {
    it('reduces array to single value', () => {
      const collection = new Collection([1, 2, 3, 4]);
      const result = collection.reduce((sum, x) => sum + x, 0);
      expect(result).toBe(10);
    });

    it('reduces objects', () => {
      const items = [{ value: 10 }, { value: 20 }, { value: 30 }];
      const collection = new Collection(items);
      const result = collection.reduce((sum, item) => sum + item.value, 0);
      expect(result).toBe(60);
    });

    it('uses first element as initial value when not provided', () => {
      const collection = new Collection([1, 2, 3, 4]);
      const result = collection.reduce((sum, x) => sum + x);
      expect(result).toBe(10);
    });
  });

  describe('groupBy', () => {
    it('groups items by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const collection = new Collection(items);
      const result = collection.groupBy('type');
      expect(result.a).toHaveLength(2);
      expect(result.b).toHaveLength(1);
    });

    it('groups items by function', () => {
      const collection = new Collection([1, 2, 3, 4, 5, 6]);
      const result = collection.groupBy((n) => (n % 2 === 0 ? 'even' : 'odd'));
      expect(result.even).toEqual([2, 4, 6]);
      expect(result.odd).toEqual([1, 3, 5]);
    });
  });

  describe('unique', () => {
    it('returns collection with unique items', () => {
      const collection = new Collection([1, 2, 2, 3, 3, 3]);
      const result = collection.unique();
      expect(result.toArray()).toEqual([1, 2, 3]);
    });

    it('works with objects', () => {
      const items = ['a', 'b', 'a', 'c', 'b'];
      const collection = new Collection(items);
      const result = collection.unique();
      expect(result.toArray().length).toBe(3);
    });

    it('returns new Collection instance', () => {
      const collection = new Collection([1, 2, 2, 3]);
      const result = collection.unique();
      expect(result).toBeInstanceOf(Collection);
    });
  });

  describe('values', () => {
    it('returns array of values', () => {
      const collection = new Collection([1, 2, 3]);
      expect(collection.values()).toEqual([1, 2, 3]);
    });

    it('returns plain array not Collection', () => {
      const collection = new Collection([1, 2, 3]);
      const values = collection.values();
      expect(Array.isArray(values)).toBe(true);
      expect(values).not.toBeInstanceOf(Collection);
    });
  });

  describe('toArray', () => {
    it('returns array representation', () => {
      const collection = new Collection([1, 2, 3]);
      const arr = collection.toArray();
      expect(arr).toEqual([1, 2, 3]);
      expect(Array.isArray(arr)).toBe(true);
    });

    it('handles objects', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const collection = new Collection(items);
      const arr = collection.toArray();
      expect(arr).toEqual(items);
    });
  });

  describe('chainability', () => {
    it('chains map and filter', () => {
      const collection = new Collection([1, 2, 3, 4, 5]);
      const result = collection
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .toArray();
      expect(result).toEqual([4, 8]);
    });

    it('chains multiple operations', () => {
      const items = [
        { active: true, id: 1, value: 10 },
        { active: false, id: 2, value: 20 },
        { active: true, id: 3, value: 30 },
      ];
      const collection = new Collection(items);
      const result = collection
        .filter((item) => item.active)
        .map((item) => item.value)
        .toArray();
      expect(result).toEqual([10, 30]);
    });
  });

  describe('iteration', () => {
    it('supports for...of loop', () => {
      const collection = new Collection([1, 2, 3]);
      const items: number[] = [];
      for (const item of collection) {
        items.push(item);
      }
      expect(items).toEqual([1, 2, 3]);
    });

    it('is iterable', () => {
      const collection = new Collection([1, 2, 3]);
      expect(typeof collection[Symbol.iterator]).toBe('function');
    });
  });
});
