import { describe, it, expect } from 'bun:test';
import { Arr } from '../../src/arr';

describe('Arr', () => {
    describe('get', () => {
        it('returns value for simple key', () => {
            const obj = { name: 'John', age: 30 };
            expect(Arr.get(obj, 'name')).toBe('John');
        });

        it('returns value with dot notation', () => {
            const obj = { user: { profile: { name: 'Jane' } } };
            expect(Arr.get(obj, 'user.profile.name')).toBe('Jane');
        });

        it('returns default value when key not found', () => {
            const obj = { name: 'John' };
            expect(Arr.get(obj, 'age', 0)).toBe(0);
        });

        it('returns undefined when key not found and no default', () => {
            const obj = { name: 'John' };
            expect(Arr.get(obj, 'missing')).toBeUndefined();
        });

        it('handles array access with dot notation', () => {
            const obj = { items: [{ id: 1, name: 'Item' }] };
            expect(Arr.get(obj, 'items.0.name')).toBe('Item');
        });
    });

    describe('set', () => {
        it('sets value for simple key', () => {
            const obj = { name: 'John' };
            Arr.set(obj, 'age', 30);
            expect(obj.age).toBe(30);
        });

        it('sets value with dot notation creating path', () => {
            const obj: Record<string, unknown> = {};
            Arr.set(obj, 'user.profile.name', 'Jane');
            expect(Arr.get(obj, 'user.profile.name')).toBe('Jane');
        });

        it('updates existing nested value', () => {
            const obj = { user: { name: 'John' } };
            Arr.set(obj, 'user.name', 'Jane');
            expect(obj.user.name).toBe('Jane');
        });

        it('returns the modified object', () => {
            const obj = { name: 'John' };
            const result = Arr.set(obj, 'age', 30);
            expect(result).toBe(obj);
        });
    });

    describe('has', () => {
        it('returns true if key exists', () => {
            const obj = { name: 'John', age: 30 };
            expect(Arr.has(obj, 'name')).toBe(true);
        });

        it('returns false if key does not exist', () => {
            const obj = { name: 'John' };
            expect(Arr.has(obj, 'age')).toBe(false);
        });

        it('supports dot notation', () => {
            const obj = { user: { profile: { name: 'Jane' } } };
            expect(Arr.has(obj, 'user.profile.name')).toBe(true);
            expect(Arr.has(obj, 'user.profile.email')).toBe(false);
        });
    });

    describe('merge', () => {
        it('merges two objects', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { c: 3, d: 4 };
            const result = Arr.merge(obj1, obj2);
            expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
        });

        it('performs deep merge', () => {
            const obj1 = { user: { name: 'John', age: 30 } };
            const obj2 = { user: { email: 'john@example.com' } };
            const result = Arr.merge(obj1, obj2);
            expect(result.user).toEqual({
                name: 'John',
                age: 30,
                email: 'john@example.com',
            });
        });

        it('merges multiple objects', () => {
            const obj1 = { a: 1 };
            const obj2 = { b: 2 };
            const obj3 = { c: 3 };
            const result = Arr.merge(obj1, obj2, obj3);
            expect(result).toEqual({ a: 1, b: 2, c: 3 });
        });

        it('later objects override earlier values', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { b: 3, c: 4 };
            const result = Arr.merge(obj1, obj2);
            expect(result.b).toBe(3);
        });
    });

    describe('only', () => {
        it('returns object with only specified keys', () => {
            const obj = { a: 1, b: 2, c: 3, d: 4 };
            const result = Arr.only(obj, ['a', 'c']);
            expect(result).toEqual({ a: 1, c: 3 });
        });

        it('returns empty object if no keys match', () => {
            const obj = { a: 1, b: 2 };
            const result = Arr.only(obj, ['x', 'y']);
            expect(result).toEqual({});
        });

        it('ignores non-existent keys', () => {
            const obj = { a: 1, b: 2 };
            const result = Arr.only(obj, ['a', 'z']);
            expect(result).toEqual({ a: 1 });
        });
    });

    describe('except', () => {
        it('returns object without specified keys', () => {
            const obj = { a: 1, b: 2, c: 3, d: 4 };
            const result = Arr.except(obj, ['b', 'd']);
            expect(result).toEqual({ a: 1, c: 3 });
        });

        it('returns all keys if excluded keys do not exist', () => {
            const obj = { a: 1, b: 2 };
            const result = Arr.except(obj, ['x', 'y']);
            expect(result).toEqual({ a: 1, b: 2 });
        });

        it('returns empty object if all keys are excluded', () => {
            const obj = { a: 1, b: 2 };
            const result = Arr.except(obj, ['a', 'b']);
            expect(result).toEqual({});
        });
    });

    describe('unique', () => {
        it('removes duplicate values from array', () => {
            const arr = [1, 2, 2, 3, 3, 3, 4];
            const result = Arr.unique(arr);
            expect(result).toEqual([1, 2, 3, 4]);
        });

        it('handles array of strings', () => {
            const arr = ['a', 'b', 'a', 'c', 'b'];
            const result = Arr.unique(arr);
            expect(result).toEqual(['a', 'b', 'c']);
        });

        it('returns empty array for empty input', () => {
            const result = Arr.unique([]);
            expect(result).toEqual([]);
        });

        it('handles single element array', () => {
            const result = Arr.unique([1]);
            expect(result).toEqual([1]);
        });
    });

    describe('flatten', () => {
        it('flattens nested array', () => {
            const arr = [1, [2, 3], [4, [5, 6]]];
            const result = Arr.flatten(arr, 1);
            expect(result).toEqual([1, 2, 3, 4, [5, 6]]);
        });

        it('flattens deeply nested array', () => {
            const arr = [1, [2, [3, [4]]]];
            const result = Arr.flatten(arr, 3);
            expect(result).toEqual([1, 2, 3, 4]);
        });

        it('returns array unchanged with depth 0', () => {
            const arr = [1, [2, 3]];
            const result = Arr.flatten(arr, 0);
            expect(result).toEqual([1, [2, 3]]);
        });

        it('flattens completely without depth limit', () => {
            const arr = [1, [2, [3, [4, [5]]]]];
            const result = Arr.flatten(arr);
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });
    });

    describe('groupBy', () => {
        it('groups array by key', () => {
            const arr = [
                { type: 'a', value: 1 },
                { type: 'b', value: 2 },
                { type: 'a', value: 3 },
            ];
            const result = Arr.groupBy(arr, 'type');
            expect(result.a).toHaveLength(2);
            expect(result.b).toHaveLength(1);
        });

        it('groups array by function', () => {
            const arr = [1, 2, 3, 4, 5, 6];
            const result = Arr.groupBy(arr, (n) => (n % 2 === 0 ? 'even' : 'odd'));
            expect(result.even).toEqual([2, 4, 6]);
            expect(result.odd).toEqual([1, 3, 5]);
        });

        it('handles empty array', () => {
            const result = Arr.groupBy([], 'key');
            expect(result).toEqual({});
        });
    });

    describe('keyBy', () => {
        it('indexes array by key', () => {
            const arr = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
            ];
            const result = Arr.keyBy(arr, 'id');
            expect(result[1]).toEqual({ id: 1, name: 'John' });
            expect(result[2]).toEqual({ id: 2, name: 'Jane' });
        });

        it('indexes array by function', () => {
            const arr = [
                { name: 'John', age: 30 },
                { name: 'Jane', age: 25 },
            ];
            const result = Arr.keyBy(arr, (item) => item.name);
            expect(result.John).toEqual({ name: 'John', age: 30 });
            expect(result.Jane).toEqual({ name: 'Jane', age: 25 });
        });

        it('handles empty array', () => {
            const result = Arr.keyBy([], 'key');
            expect(result).toEqual({});
        });
    });

    describe('isEmpty', () => {
        it('returns true for empty array', () => {
            expect(Arr.isEmpty([])).toBe(true);
        });

        it('returns false for non-empty array', () => {
            expect(Arr.isEmpty([1, 2, 3])).toBe(false);
        });

        it('returns true for empty object', () => {
            expect(Arr.isEmpty({})).toBe(true);
        });

        it('returns false for non-empty object', () => {
            expect(Arr.isEmpty({ a: 1 })).toBe(false);
        });

        it('returns true for empty string', () => {
            expect(Arr.isEmpty('')).toBe(true);
        });

        it('returns false for non-empty string', () => {
            expect(Arr.isEmpty('hello')).toBe(false);
        });

        it('returns true for null and undefined', () => {
            expect(Arr.isEmpty(null)).toBe(true);
            expect(Arr.isEmpty(undefined)).toBe(true);
        });

        it('returns true for 0 and false', () => {
            expect(Arr.isEmpty(0)).toBe(true);
            expect(Arr.isEmpty(false)).toBe(true);
        });
    });
});
