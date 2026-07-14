/**
 * Container binding keys for core framework services.
 *
 * @packageDocumentation
 */

/** IoC key for the HTTP {@link Router} instance. */
export const ROUTER_KEY = "router" as const;

/** IoC key for the named {@link MiddlewareStack} instance. */
export const MIDDLEWARE_STACK_KEY = "middleware" as const;

/** Union of all core service keys. */
export type CoreServiceKey = typeof ROUTER_KEY | typeof MIDDLEWARE_STACK_KEY;

/** All core IoC keys (for iteration / documentation). */
export const CORE_SERVICE_KEYS: readonly CoreServiceKey[] = [ROUTER_KEY, MIDDLEWARE_STACK_KEY] as const;
