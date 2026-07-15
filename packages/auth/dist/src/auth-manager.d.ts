import type { Authenticatable } from "./contracts/authenticatable";
import type { Guard } from "./contracts/guard";
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
export declare class AuthManager {
    /** Map of registered guard factories */
    private readonly factories;
    /** Cache of created guard instances */
    private readonly guards;
    /** Default guard name */
    private readonly defaultGuardName;
    /**
     * Creates a new AuthManager instance.
     *
     * @param config - Optional configuration options
     */
    constructor(config?: AuthManagerConfig);
    /**
     * Resolves a guard instance by name.
     * Uses default guard if name is not provided.
     * Caches guard instances for subsequent calls.
     *
     * @param name - Guard name (optional, uses default if not provided)
     * @returns Guard instance
     * @throws Error if guard name is not registered
     */
    guard(name?: string): Guard;
    /**
     * Extends the auth manager with a custom guard factory.
     *
     * @param name - Guard name
     * @param factory - Factory function that creates guard instances
     * @throws Error if factory is not a function
     */
    extend(name: string, factory: GuardFactory): void;
    /**
     * Delegates check() to the default guard.
     *
     * @returns true if user is authenticated
     */
    check(): Promise<boolean>;
    /**
     * Delegates user() to the default guard.
     *
     * @returns Authenticated user or null
     */
    user(): Promise<Authenticatable | null>;
    /**
     * Delegates id() to the default guard.
     *
     * @returns User ID or null
     */
    id(): Promise<string | number | null>;
}
