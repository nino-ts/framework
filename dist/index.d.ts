/**
 * @ninots/framework — Meta-Package Entry Point
 *
 * Re-exports all core packages using package specifiers (Laravel/Illuminate style).
 * Install `@ninots/framework` to get all packages, or install individual
 * packages like `@ninots/orm` for granular usage.
 *
 * @packageDocumentation
 */

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
    authenticate,
    BcryptHasher,
    DatabaseSessionDriver,
    DatabaseUserProvider,
    FileSessionDriver,
    GitHubProvider,
    guest,
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
} from "@ninots/auth";
// ── Wildcard Re-exports (no collision risk) ─────────────────────
export * from "@ninots/cache";
export * from "@ninots/config";
// ── Events ──────────────────────────────────────────────────────
export type { EventClass, EventListener, Job, QueueConnection } from "@ninots/events";
export { EventDispatcher, SyncBus } from "@ninots/events";
// ── Console (curated to avoid collisions) ───────────────────────
export type {
    CommandDefinition,
    CommandSignature,
    DbSeedCommandOptions,
    GeneratorPathsConfig,
    MakeControllerCommandOptions,
    MakeMigrationCommandOptions,
    MakeModelCommandOptions,
    MakeModuleCommandOptions,
    MakeViewCommandOptions,
    MigrateCommandOptions,
    MigrateRefreshCommandOptions,
    MigrateRollbackCommandOptions,
    ParsedArguments,
    StubWriteResult,
} from "@ninots/console";
export {
    Command,
    DbSeedCommand,
    Kernel,
    MakeControllerCommand,
    MakeMigrationCommand,
    MakeModelCommand,
    MakeModuleCommand,
    MakeViewCommand,
    MigrateCommand,
    MigrateRefreshCommand,
    MigrateRollbackCommand,
    OutputStyle,
    PathResolver,
    StubExistsError,
    applyStubReplacements,
    migrationTimestamp,
    normalizeControllerName,
    normalizeMigrationName,
    normalizeModelName,
    normalizeModuleName,
    normalizeViewName,
} from "@ninots/console";

// ── Container ───────────────────────────────────────────────────
export type {
    Binding,
    ContainerInterface,
    Factory as ContainerFactory,
} from "@ninots/container";
export { Container, ServiceProvider } from "@ninots/container";
export * from "@ninots/filesystem";
// ── Foundation ──────────────────────────────────────────────────
export type {
    ApplicationConfig,
    ApplicationState,
    CreateApplicationOptions,
    CreateServeOptionsInput,
    CoreServiceKey,
    RequestHandler,
} from "@ninots/foundation";
export {
    Application,
    CORE_SERVICE_KEYS,
    MIDDLEWARE_STACK_KEY,
    ROUTER_KEY,
    EVENT_DISPATCHER_KEY,
    SYNC_BUS_KEY,
    createApp,
    createApplication,
    createHttpHandler,
    createServeOptions,
    wireCoreServices,
} from "@ninots/foundation";
// ── HTTP ────────────────────────────────────────────────────────
export type {
    FileResponseOptions,
    HtmlResponseOptions,
    JsonResponseOptions,
    RedirectResponseOptions,
    TextResponseOptions,
} from "@ninots/http";
export { RequestHelpers, ResponseHelpers } from "@ninots/http";
export * from "@ninots/logger";
// ── Middleware ───────────────────────────────────────────────────
export type {
    CsrfConfig,
    CsrfOptions,
    Middleware,
    MiddlewareHandler,
    MiddlewareNext,
    SessionResolution,
    WideEventMiddlewareOptions,
} from "@ninots/middleware";
export {
    createCsrfFailureResponse,
    extractCsrfToken,
    formatSessionCookie,
    generateCsrfToken,
    getSessionIdFromRequest,
    isSafeMethod,
    MiddlewareStack,
    parseRequestCookies,
    Pipeline,
    resolveCsrfConfig,
    resolveSessionId,
    verifyCsrf,
    verifyCsrfToken,
    wideEventMiddleware,
    withSessionCookie,
} from "@ninots/middleware";
export * from "@ninots/orm";
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
export * from "@ninots/session";
export * from "@ninots/support";
export * from "@ninots/validation";
// ── View ────────────────────────────────────────────────────────
export type {
    JsxProps,
    JsxType,
    LayoutComponent,
    ViewComponent,
    ViewInit,
    ViewResult,
} from "@ninots/view";
export { csrfField, escapeHtml, render, withLayout } from "@ninots/view";
export * from "@ninots/websocket";
