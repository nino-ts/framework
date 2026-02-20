/**
 * Feature tests for ServiceProvider.
 *
 * @packageDocumentation
 */

import { describe, expect, test } from 'bun:test';
import { ServiceProvider } from '@/service-provider.ts';
import { createTestContainer } from '@/tests/setup';

/**
 * Test service provider that registers a config service.
 */
class ConfigServiceProvider extends ServiceProvider {
  register(): void {
    this.app.singleton('config', () => ({
      debug: true,
      env: 'testing',
    }));
  }
}

/**
 * Test service provider that uses other services in boot.
 */
class LoggerServiceProvider extends ServiceProvider {
  public bootCalled = false;
  public configValue: unknown = null;

  override register(): void {
    this.app.bind('logger', () => ({
      log: (message: string) => console.log(message),
    }));
  }

  override boot(): void {
    this.bootCalled = true;
    this.configValue = this.app.make('config');
  }
}

describe('ServiceProvider', () => {
  describe('register()', () => {
    test('should register services in the container', () => {
      const container = createTestContainer();
      const provider = new ConfigServiceProvider(container);

      provider.register();

      expect(container.bound('config')).toBe(true);
    });

    test('should make services available after registration', () => {
      const container = createTestContainer();
      const provider = new ConfigServiceProvider(container);

      provider.register();

      const config = container.make<{ debug: boolean; env: string }>('config');

      expect(config.debug).toBe(true);
      expect(config.env).toBe('testing');
    });
  });

  describe('boot()', () => {
    test('should be called after registration', () => {
      const container = createTestContainer();
      const configProvider = new ConfigServiceProvider(container);
      const loggerProvider = new LoggerServiceProvider(container);

      // Register all providers first
      configProvider.register();
      loggerProvider.register();

      // Then boot
      configProvider.boot();
      loggerProvider.boot();

      expect(loggerProvider.bootCalled).toBe(true);
    });

    test('should have access to other registered services', () => {
      const container = createTestContainer();
      const configProvider = new ConfigServiceProvider(container);
      const loggerProvider = new LoggerServiceProvider(container);

      // Register all providers first
      configProvider.register();
      loggerProvider.register();

      // Then boot
      configProvider.boot();
      loggerProvider.boot();

      expect(loggerProvider.configValue).toEqual({
        debug: true,
        env: 'testing',
      });
    });
  });

  describe('multiple providers', () => {
    test('should work together in the same container', () => {
      const container = createTestContainer();
      const providers = [new ConfigServiceProvider(container), new LoggerServiceProvider(container)];

      // Register phase
      providers.forEach((p) => p.register());

      // Boot phase
      providers.forEach((p) => p.boot());

      expect(container.bound('config')).toBe(true);
      expect(container.bound('logger')).toBe(true);
    });
  });
});
