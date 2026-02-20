/**
 * Unit tests for JSON loader.
 *
 * @packageDocumentation
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { JsonLoader } from '@/loaders/json-loader.ts';

describe('JsonLoader', () => {
  const testDir = join(import.meta.dir, '..', '..', 'fixtures', 'json-loader');

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { force: true, recursive: true });
  });

  describe('supports()', () => {
    test('should support json extension', () => {
      const loader = new JsonLoader();

      expect(loader.supports('json')).toBe(true);
      expect(loader.supports('JSON')).toBe(true);
    });

    test('should not support other extensions', () => {
      const loader = new JsonLoader();

      expect(loader.supports('yaml')).toBe(false);
      expect(loader.supports('yml')).toBe(false);
      expect(loader.supports('toml')).toBe(false);
    });
  });

  describe('load()', () => {
    test('should load valid JSON file', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'config.json');
      const content = { name: 'ninots', version: '1.0.0' };

      await writeFile(filePath, JSON.stringify(content));

      const result = await loader.load(filePath);

      expect(result).toEqual(content);
    });

    test('should load nested JSON object', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'nested.json');
      const content = {
        app: {
          debug: true,
          name: 'ninots',
        },
        database: {
          host: 'localhost',
          port: 3306,
        },
      };

      await writeFile(filePath, JSON.stringify(content));

      const result = await loader.load(filePath);

      expect(result).toEqual(content);
    });

    test('should load empty JSON object', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'empty.json');

      await writeFile(filePath, '{}');

      const result = await loader.load(filePath);

      expect(result).toEqual({});
    });

    test('should throw for invalid JSON', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'invalid.json');

      await writeFile(filePath, '{ invalid json }');

      expect(loader.load(filePath)).rejects.toThrow();
    });

    test('should throw for non-existent file', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'missing.json');

      expect(loader.load(filePath)).rejects.toThrow();
    });

    test('should handle JSON with arrays', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'arrays.json');
      const content = {
        ports: [3000, 3001],
        servers: ['server1', 'server2'],
      };

      await writeFile(filePath, JSON.stringify(content));

      const result = await loader.load(filePath);

      expect(result).toEqual(content);
    });

    test('should handle JSON with various types', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'types.json');
      const content = {
        array: [1, 2, 3],
        boolean: true,
        float: 3.14,
        null: null,
        number: 42,
        object: { nested: 'value' },
        string: 'value',
      };

      await writeFile(filePath, JSON.stringify(content));

      const result = await loader.load(filePath);

      expect(result).toEqual(content);
    });

    test('should throw when root is not an object', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'root-string.json');

      await writeFile(filePath, '"just a string"');

      expect(loader.load(filePath)).rejects.toThrow('Configuration must be an object');
    });

    test('should throw when root is an array', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'root-array.json');

      await writeFile(filePath, '[1, 2, 3]');

      expect(loader.load(filePath)).rejects.toThrow('Configuration must be an object, not array');
    });

    test('should throw when root is null', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'root-null.json');

      await writeFile(filePath, 'null');

      expect(loader.load(filePath)).rejects.toThrow('Configuration must be an object');
    });

    test('should throw when root is a number', async () => {
      const loader = new JsonLoader();
      const filePath = join(testDir, 'root-number.json');

      await writeFile(filePath, '123');

      expect(loader.load(filePath)).rejects.toThrow('Configuration must be an object');
    });
  });
});
