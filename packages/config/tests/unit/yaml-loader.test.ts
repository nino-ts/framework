/**
 * Unit tests for YAML loader.
 *
 * @packageDocumentation
 */

import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { YamlLoader } from '@/loaders/yaml-loader';

describe('YamlLoader', () => {
    const testDir = join(import.meta.dir, '..', '..', 'fixtures', 'yaml-loader');

    beforeEach(async () => {
        await mkdir(testDir, { recursive: true });
    });

    afterEach(async () => {
        await rm(testDir, { recursive: true, force: true });
    });

    describe('supports()', () => {
        test('should support yaml extension', () => {
            const loader = new YamlLoader();

            expect(loader.supports('yaml')).toBe(true);
            expect(loader.supports('YAML')).toBe(true);
        });

        test('should support yml extension', () => {
            const loader = new YamlLoader();

            expect(loader.supports('yml')).toBe(true);
            expect(loader.supports('YML')).toBe(true);
        });

        test('should not support other extensions', () => {
            const loader = new YamlLoader();

            expect(loader.supports('json')).toBe(false);
            expect(loader.supports('toml')).toBe(false);
        });
    });

    describe('load()', () => {
        test('should load valid YAML file', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'config.yaml');
            const content = `name: ninots
version: "1.0.0"`;

            await writeFile(filePath, content);

            const result = await loader.load(filePath);

            expect(result.name).toBe('ninots');
            expect(result.version).toBe('1.0.0');
        });

        test('should load nested YAML object', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'nested.yaml');
            const content = `app:
  name: ninots
  debug: true
database:
  host: localhost
  port: 3306`;

            await writeFile(filePath, content);

            const result = await loader.load(filePath);
            const app = result.app as Record<string, unknown>;
            const database = result.database as Record<string, unknown>;

            expect(app.name).toBe('ninots');
            expect(app.debug).toBe(true);
            expect(database.host).toBe('localhost');
            expect(database.port).toBe(3306);
        });

        test('should load empty YAML file', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'empty.yaml');

            await writeFile(filePath, '');

            const result = await loader.load(filePath);

            expect(result).toEqual({});
        });

        test('should throw for invalid YAML', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'invalid.yaml');

            await writeFile(filePath, ':\n  invalid yaml: [unclosed');

            expect(loader.load(filePath)).rejects.toThrow();
        });

        test('should throw for non-existent file', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'missing.yaml');

            expect(loader.load(filePath)).rejects.toThrow();
        });

        test('should handle YAML with arrays', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'arrays.yaml');
            const content = `servers:
  - server1
  - server2
ports:
  - 3000
  - 3001`;

            await writeFile(filePath, content);

            const result = await loader.load(filePath);

            expect(result.servers).toEqual(['server1', 'server2']);
            expect(result.ports).toEqual([3000, 3001]);
        });

        test('should handle YAML with various types', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'types.yaml');
            const content = `string: value
number: 42
float: 3.14
boolean: true
nullValue: null
array:
  - 1
  - 2
  - 3
object:
  nested: value`;

            await writeFile(filePath, content);

            const result = await loader.load(filePath);
            const obj = result.object as Record<string, unknown>;

            expect(result.string).toBe('value');
            expect(result.number).toBe(42);
            expect(result.float).toBe(3.14);
            expect(result.boolean).toBe(true);
            expect(result.nullValue).toBeNull();
            expect(result.array).toEqual([1, 2, 3]);
            expect(obj.nested).toBe('value');
        });

        test('should handle YAML with .yml extension', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'config.yml');
            const content = `name: ninots`;

            await writeFile(filePath, content);

            const result = await loader.load(filePath);

            expect(result.name).toBe('ninots');
        });

        test('should throw if YAML contains non-object root', async () => {
            const loader = new YamlLoader();
            const filePath = join(testDir, 'array.yaml');
            const content = `- item1
- item2`;

            await writeFile(filePath, content);

            expect(loader.load(filePath)).rejects.toThrow('must be an object');
        });
    });
});
