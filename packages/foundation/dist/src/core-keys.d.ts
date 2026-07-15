/**
 * Container binding keys for core framework services.
 *
 * @packageDocumentation
 */
/** IoC key for the HTTP {@link Router} instance. */
export declare const ROUTER_KEY: "router";
/** IoC key for the named {@link MiddlewareStack} instance. */
export declare const MIDDLEWARE_STACK_KEY: "middleware";
/** IoC key for the {@link EventDispatcher} instance. */
export declare const EVENT_DISPATCHER_KEY: "events";
/** IoC key for the sync {@link SyncBus} instance. */
export declare const SYNC_BUS_KEY: "bus";
/** Union of all core service keys. */
export type CoreServiceKey = typeof ROUTER_KEY | typeof MIDDLEWARE_STACK_KEY | typeof EVENT_DISPATCHER_KEY | typeof SYNC_BUS_KEY;
/** All core IoC keys (for iteration / documentation). */
export declare const CORE_SERVICE_KEYS: readonly CoreServiceKey[];
