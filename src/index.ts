/**
 * Ninots Framework - Module Exports
 * Zero dependencies, Laravel-inspired framework for Bun
 * Uses Bun's native APIs (routing, file serving, etc.)
 */

// ============================================================================
// Types
// ============================================================================
export type {
  HttpMethod,
  RouteParams,
  QueryParams,
  NinotsRequest,
  RouteHandler,
  MiddlewareHandler,
  ValidationRule,
  ValidationRules,
  ValidationErrors,
  ValidationResult,
  ServiceFactory,
  ServiceBinding,
  ApplicationConfig,
  EventListener,
  EventSubscription,
  JsonResponseOptions,
  RedirectOptions,
  UploadedFile,
  CookieOptions,
  ViewData,
  ViewEngine,
} from './types';

export { Controller } from './types';

// ============================================================================
// Application (uses Bun.serve native routing)
// ============================================================================
export { 
  Application, 
  createApp, 
  app, 
  resolve,
} from './app/Application';

export {
  bootstrap,
  bootstrapApi,
  serve,
} from './bootstrap';

// ============================================================================
// Container (IoC/DI)
// ============================================================================
export { 
  Container, 
  container,
  resolve as make,
} from './container/Container';

// ============================================================================
// HTTP Helpers
// ============================================================================
export { 
  createRequest, 
  parseQueryString,
  RequestHelpers,
} from './http/Request';

export { 
  ResponseFactory,
  ResponseHelpers,
  setViewEngine,
  view,
} from './http/Response';

// ============================================================================
// Middleware
// ============================================================================
export { 
  Pipeline, 
  pipeline,
  cors,
  jsonParser,
  logger,
  rateLimit,
  compress,
  helmet,
  auth,
  timeout,
  requestId,
} from './middleware/Pipeline';

export type {
  CorsOptions,
  LoggerOptions,
  RateLimitOptions,
} from './middleware/Pipeline';

// ============================================================================
// Validation
// ============================================================================
export { 
  Validator, 
  validate,
  validateRequest,
} from './validation/Validator';

// ============================================================================
// Events
// ============================================================================
export { 
  EventEmitter, 
  events,
  resetEvents,
  Listen,
  registerEventHandlers,
} from './events/EventEmitter';
