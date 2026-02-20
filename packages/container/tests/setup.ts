/**
 * Test setup for @ninots/container.
 *
 * @packageDocumentation
 */

import { beforeEach } from 'bun:test';
import { Container } from '@/container.ts';

/**
 * Shared container instance for tests.
 */
let testContainer: Container;

/**
 * Reset container before each test.
 */
beforeEach(() => {
  testContainer = new Container();
});

/**
 * Creates a fresh container instance for testing.
 *
 * @returns A new Container instance
 */
export function createTestContainer(): Container {
  return new Container();
}

/**
 * Gets the shared test container.
 *
 * @returns The shared test container
 */
export function getTestContainer(): Container {
  return testContainer;
}
