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
	RoutesCompileCommandOptions,
	StubWriteResult,
} from "@ninots/console";
export {
	applyStubReplacements,
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
	migrationTimestamp,
	normalizeControllerName,
	normalizeMigrationName,
	normalizeModelName,
	normalizeModuleName,
	normalizeViewName,
	OutputStyle,
	PathResolver,
	RoutesCompileCommand,
	StubExistsError,
} from "@ninots/console";
// ── Container ───────────────────────────────────────────────────
export type {
	Binding,
	ContainerInterface,
	Factory as ContainerFactory,
} from "@ninots/container";
export { Container, ServiceProvider } from "@ninots/container";
// ── Events ──────────────────────────────────────────────────────
export type {
	EventClass,
	EventListener,
	Job,
	QueueConnection,
} from "@ninots/events";
export { EventDispatcher, SyncBus } from "@ninots/events";
export * from "@ninots/filesystem";
// ── Foundation ──────────────────────────────────────────────────
export type {
	ApplicationConfig,
	ApplicationState,
	CoreServiceKey,
	CreateApplicationOptions,
	CreateServeOptionsInput,
	RequestHandler,
} from "@ninots/foundation";
export {
	Application,
	CORE_SERVICE_KEYS,
	createApp,
	createApplication,
	createHttpHandler,
	createServeOptions,
	EVENT_DISPATCHER_KEY,
	MIDDLEWARE_STACK_KEY,
	ROUTER_KEY,
	SYNC_BUS_KEY,
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
	Pipeline,
	parseRequestCookies,
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
	RouteRegistry,
	RouteResolver,
} from "@ninots/routing";
export {
	emitRouteRegistry,
	loadRoutes,
	Route,
	Router,
	route,
	setRouteResolver,
} from "@ninots/routing";
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
