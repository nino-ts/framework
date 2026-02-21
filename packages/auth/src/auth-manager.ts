import type { Guard } from '@/contracts/guard.ts';
import type { Authenticatable } from '@/contracts/authenticatable.ts';

/**
 * Minimal config shapes used by AuthManager
 */
type GuardConfig = { driver: string; provider?: string;[key: string]: unknown };
type AuthConfig = { defaults: { guard: string }; guards: Record<string, GuardConfig> };

/**
 * Factory for creating Auth Guards.
 */
export type GuardFactory = (name: string, config: GuardConfig) => Guard;

/**
 * Auth Manager.
 */
export class AuthManager<T extends AuthConfig = AuthConfig> {
  protected guards: Map<string, Guard> = new Map();
  protected factories: Map<string, GuardFactory> = new Map();
  protected config: T;

  constructor(config: T) {
    this.config = config;
  }

  /**
   * Register a custom driver creator closure.
   */
  extend(driver: string, factory: GuardFactory): this {
    this.factories.set(driver, factory);
    return this;
  }

  /**
   * Get a guard instance by name.
   */
  guard(name?: string): Guard {
    name = name || this.config.defaults.guard;

    const guard = this.guards.get(name);
    if (guard) {
      return guard;
    }

    return this.resolve(name);
  }

  /**
   * Resolve the given guard.
   */
  protected resolve(name: string): Guard {
    const config = this.config.guards[name];

    if (!config) {
      throw new Error(`Auth guard [${name}] is not defined.`);
    }

    const driver = config.driver;
    const factory = this.factories.get(driver);

    if (!factory) {
      throw new Error(`Auth driver [${driver}] is not defined.`);
    }

    const guard = factory(name, config);
    this.guards.set(name, guard);

    return guard;
  }

  /**
   * Dynamically call the default guard instance.
   */
  check(): Promise<boolean> {
    return this.guard().check();
  }

  /**
   * Dynamically call the default guard instance.
   */
  user(): Promise<Authenticatable | null> {
    return this.guard().user();
  }

  /**
   * Dynamically call the default guard instance.
   */
  id(): Promise<string | number | null> {
    return this.guard().id();
  }
}
