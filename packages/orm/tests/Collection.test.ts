import { describe, expect, test } from 'bun:test';
import { Collection } from '@/collection';

describe('Collection', () => {
    const items = [
        { active: true, age: 25, id: 1, name: 'Alice' },
        { active: false, age: 30, id: 2, name: 'Bob' },
        { active: true, age: 25, id: 3, name: 'Charlie' },
    ];

    test('should be iterable', () => {
        const collection = new Collection(items);
        const result = [];
        for (const item of collection) {
            result.push(item);
        }
        expect(result).toEqual(items);
    });

    test('all() should return all items', () => {
        const collection = new Collection(items);
        expect(collection.all()).toEqual(items);
    });

    test('count() should return number of items', () => {
        const collection = new Collection(items);
        expect(collection.count()).toBe(3);
    });

    test('first() should return first item', () => {
        const collection = new Collection(items);
        expect(collection.first()).toEqual(items[0]);
    });

    test('first() should return null if empty', () => {
        const collection = new Collection([]);
        expect(collection.first()).toBeNull();
    });

    test('last() should return last item', () => {
        const collection = new Collection(items);
        expect(collection.last()).toEqual(items[2]);
    });

    test('map() should return new collection with mapped items', () => {
        const collection = new Collection(items);
        const mapped = collection.map((item) => item.name);
        expect(mapped).toBeInstanceOf(Collection);
        expect(mapped.all()).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    test('filter() should return new collection with filtered items', () => {
        const collection = new Collection(items);
        const filtered = collection.filter((item) => item.age > 25);
        expect(filtered).toBeInstanceOf(Collection);
        expect(filtered.count()).toBe(1);
        expect(filtered.first()).toEqual(items[1]);
    });

    test('pluck() should extract values by key', () => {
        const collection = new Collection(items);
        expect(collection.pluck('name').all()).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    test('sum() should calculate sum of numeric field', () => {
        const collection = new Collection(items);
        expect(collection.sum('age')).toBe(80);
    });

    test('avg() should calculate average of numeric field', () => {
        const collection = new Collection([{ val: 10 }, { val: 20 }, { val: 30 }]);
        expect(collection.avg('val')).toBe(20);
    });

    test('min() should calculate min of numeric field', () => {
        const collection = new Collection([{ val: 10 }, { val: 20 }, { val: 5 }]);
        expect(collection.min('val')).toBe(5);
    });

    test('max() should calculate max of numeric field', () => {
        const collection = new Collection([{ val: 10 }, { val: 20 }, { val: 5 }]);
        expect(collection.max('val')).toBe(20);
    });

    test('unique() should remove duplicates by key', () => {
        const collection = new Collection(items);
        const unique = collection.unique('age');
        expect(unique.count()).toBe(2);
        expect(unique.pluck('age').all()).toEqual([25, 30]);
    });

    test('unique() should remove duplicates by value (primitives)', () => {
        const collection = new Collection([1, 2, 2, 3]);
        const unique = collection.unique();
        expect(unique.all()).toEqual([1, 2, 3]);
    });

    test('isEmpty() should return true if empty', () => {
        const collection = new Collection([]);
        expect(collection.isEmpty()).toBe(true);
    });

    test('isNotEmpty() should return true if not empty', () => {
        const collection = new Collection(items);
        expect(collection.isNotEmpty()).toBe(true);
    });
});
