/**
 * Ninots Framework - Type Definitions
 * Zero dependencies, Bun native APIs only
 */

// ============================================================================
// HTTP Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface RouteParams {
  [key: string]: string;
}

export interface QueryParams {
  [key: string]: string | string[] | undefined;
}

// ============================================================================
// Request Types
// ============================================================================

export interface NinotsRequest extends Request {
  params: RouteParams;
  query: QueryParams;
  routePath: string;
  startTime: number;
  ip: string | null;
  validated?: Record<string, unknown>;
}

// ============================================================================
// Route Types
// ============================================================================

export type RouteHandler = (request: NinotsRequest) => Response | Promise<Response>;

export type MiddlewareHandler = (
  request: NinotsRequest,
  next: () => Promise<Response>
) => Response | Promise<Response>;

export interface RouteDefinition {
  method: HttpMethod | HttpMethod[];
  path: string;
  handler: RouteHandler;
  middleware: MiddlewareHandler[];
  name?: string;
  prefix?: string;
}

export interface RouteMatch {
  route: RouteDefinition;
  params: RouteParams;
}

export interface RouteGroupOptions {
  prefix?: string;
  middleware?: MiddlewareHandler[];
  name?: string;
}

// ============================================================================
// Controller Types
// ============================================================================

export type ControllerAction = (request: NinotsRequest) => Response | Promise<Response>;

export interface ControllerClass {
  new (...args: unknown[]): Controller;
}

export abstract class Controller {
  protected request!: NinotsRequest;
  
  setRequest(request: NinotsRequest): void {
    this.request = request;
  }
}

// ============================================================================
// Validation Types
// ============================================================================

export type ValidationRule = 
  | 'required'
  | 'string'
  | 'number'
  | 'boolean'
  | 'email'
  | 'url'
  | 'uuid'
  | 'array'
  | 'object'
  | 'date'
  | 'nullable'
  | 'integer'
  | 'numeric'
  | 'alpha'
  | 'alphanumeric'
  | `min:${number}`
  | `max:${number}`
  | `between:${number},${number}`
  | `in:${string}`
  | `regex:${string}`
  | `same:${string}`
  | `different:${string}`
  | `confirmed`;

export interface ValidationRules {
  [field: string]: ValidationRule[] | string;
}

export interface ValidationErrors {
  [field: string]: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrors;
  validated: Record<string, unknown>;
}

// ============================================================================
// Service Container Types
// ============================================================================

export type ServiceFactory<T> = () => T;

export interface ServiceBinding<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
  instance?: T;
}

// ============================================================================
// Application Types
// ============================================================================

export interface ApplicationConfig {
  port?: number;
  hostname?: string;
  development?: boolean;
  timezone?: string;
  locale?: string;
  baseUrl?: string;
}

export interface ServerInstance {
  url: string;
  port: number;
  hostname: string;
  stop: (closeActiveConnections?: boolean) => Promise<void>;
  reload: (options: { fetch: (req: Request) => Response | Promise<Response> }) => void;
  requestIP: (req: Request) => { address: string; port: number } | null;
  pendingRequests: number;
  pendingWebSockets: number;
}

// ============================================================================
// Event Types
// ============================================================================

export type EventListener<T = unknown> = (payload: T) => void | Promise<void>;

export interface EventSubscription {
  event: string;
  listener: EventListener;
  once: boolean;
}

// ============================================================================
// Response Helper Types
// ============================================================================

export interface JsonResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

export interface RedirectOptions {
  status?: 301 | 302 | 303 | 307 | 308;
}

// ============================================================================
// File Types
// ============================================================================

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
  stream: () => ReadableStream<Uint8Array>;
}

// ============================================================================
// Cookie Types
// ============================================================================

export interface CookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
}

// ============================================================================
// View Types (Simple Template Engine)
// ============================================================================

export interface ViewData {
  [key: string]: unknown;
}

export type ViewEngine = (template: string, data: ViewData) => string;
