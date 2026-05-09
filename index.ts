/**
 * @ninots/framework — Meta-Package Entry Point
 *
 * Re-exports all core packages using package specifiers (Laravel/Illuminate style).
 * Install `@ninots/framework` to get all packages, or install individual
 * packages like `@ninots/orm` for granular usage.
 *
 * @packageDocumentation
 */

// ── Wildcard Re-exports (no collision risk) ─────────────────────
export * from "@ninots/cache";
export * from "@ninots/config";
export * from "@ninots/filesystem";
export * from "@ninots/logger";
export * from "@ninots/orm";
export * from "@ninots/session";
export * from "@ninots/support";
export * from "@ninots/validation";
export * from "@ninots/websocket";

// ── Auth (curated — Session/SessionManager collide with @ninots/session) ──
export type {
    Authenticatable,
    ConnectionInterface,
    Guard,
    Hasher,
    JwksKey,
    JwtHeader,
    JwtPayload,
    SessionInterface,
    StatefulGuard,
    UserProvider,
} from "@ninots/auth";
export {
    AbstractOAuthProvider,
    ArgonHasher,
    AuthManager,
    BcryptHasher,
    DatabaseSessionDriver,
    DatabaseUserProvider,
    FileSessionDriver,
    GitHubProvider,
    JwksCache,
    JwksError,
    JwtDecoder,
    JwtError,
    MemorySessionDriver,
    OAuthManager,
    OAuthUser,
    RequestGuard,
    SessionGuard,
    TokenGuard,
    WebEncrypter,
    authenticate,
    guest,
} from "@ninots/auth";

// ── Console (curated to avoid collisions) ───────────────────────
export type {
    CommandDefinition,
    CommandSignature,
    ParsedArguments,
} from "@ninots/console";
export { Command, Kernel, OutputStyle } from "@ninots/console";

// ── Container ───────────────────────────────────────────────────
export type {
    Binding,
    ContainerInterface,
    Factory,
} from "@ninots/container";
export { Container, ServiceProvider } from "@ninots/container";

// ── Foundation ──────────────────────────────────────────────────
export type {
    ApplicationConfig,
    ApplicationState,
} from "@ninots/foundation";
export { Application, createApp } from "@ninots/foundation";

// ── HTTP ────────────────────────────────────────────────────────
export type {
    FileResponseOptions,
    HtmlResponseOptions,
    JsonResponseOptions,
    RedirectResponseOptions,
    TextResponseOptions,
} from "@ninots/http";
export { RequestHelpers, ResponseHelpers } from "@ninots/http";

// ── Middleware ───────────────────────────────────────────────────
export type {
    Middleware,
    MiddlewareHandler,
    MiddlewareNext,
} from "@ninots/middleware";
export { MiddlewareStack, Pipeline } from "@ninots/middleware";

// ── Routing ─────────────────────────────────────────────────────
export type {
    HttpMethod,
    RouteDefinition,
    RouteGroupOptions,
    RouteHandler,
    RouteMatch,
    RouteParams,
} from "@ninots/routing";
export { Route, Router } from "@ninots/routing";
