import type { Authenticatable } from './contracts/authenticatable';
import type { Guard } from './contracts/guard';

/**
 * Factory function type for creating guard instances.
 */
export type GuardFactory = (name: string) => Guard;

/**
 * Configuration options for AuthManager.
 */
export interface AuthManagerConfig {
  /** Default guard name (default: 'session') */
  default?: string;
}

/**
 * Central authentication manager and factory.
 *
 * Manages guard instances and provides unified API for authentication.
 *
 * @example
 * ```typescript
 * const auth = new AuthManager();
 * auth.extend('session', (name) => {
 *   const provider = new DatabaseUserProvider(...);
 *   const session = new Session(...);
 *   return new SessionGuard(name, provider, session);
 * });
 *
 * const guard = auth.guard('session');
 * const authenticated = await guard.check();
 * ```
 */
export class AuthManager {
  /** Map of registered guard factories */
  private readonly factories: Map<string, GuardFactory> = new Map();

  /** Cache of created guard instances */
  private readonly guards: Map<string, Guard> = new Map();

  /** Default guard name */
  private readonly defaultGuardName: string;

  /**
   * Creates a new AuthManager instance.
   *
   * @param config - Optional configuration options
   */
  constructor(config?: AuthManagerConfig) {
    this.defaultGuardName = config?.default ?? 'session';
  }

  /**
   * Resolves a guard instance by name.
   * Uses default guard if name is not provided.
   * Caches guard instances for subsequent calls.
   *
   * @param name - Guard name (optional, uses default if not provided)
   * @returns Guard instance
   * @throws Error if guard name is not registered
   */
  guard(name?: string): Guard {
    const guardName = name ?? this.defaultGuardName;

    const factory = this.factories.get(guardName);
    if (!factory) {
      throw new Error(`Guard "${guardName}" is not registered`);
    }

    let guardInstance = this.guards.get(guardName);
    if (!guardInstance) {
      guardInstance = factory(guardName);
      this.guards.set(guardName, guardInstance);
    }

    return guardInstance;
  }

  /**
   * Extends the auth manager with a custom guard factory.
   *
   * @param name - Guard name
   * @param factory - Factory function that creates guard instances
   * @throws Error if factory is not a function
   */
  extend(name: string, factory: GuardFactory): void {
    if (typeof factory !== 'function') {
      throw new Error('Guard factory must be a function');
    }

    this.factories.set(name, factory);
  }

  /**
   * Delegates check() to the default guard.
   *
   * @returns true if user is authenticated
   */
  async check(): Promise<boolean> {
    return await this.guard().check();
  }

  /**
   * Delegates user() to the default guard.
   *
   * @returns Authenticated user or null
   */
  async user(): Promise<Authenticatable | null> {
    return await this.guard().user();
  }

  /**
   * Delegates id() to the default guard.
   *
   * @returns User ID or null
   */
  async id(): Promise<string | number | null> {
    return await this.guard().id();
  }
}
