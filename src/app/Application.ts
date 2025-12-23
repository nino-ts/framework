/**
 * Ninots Framework - Application
 * Thin wrapper over Bun's native HTTP server with Laravel-like DX
 * Uses Bun's native routing (v1.2.3+)
 */

import type {
  ApplicationConfig,
  MiddlewareHandler,
  NinotsRequest,
} from '../types';
import { Container, container } from '../container/Container';
import { Pipeline } from '../middleware/Pipeline';
import { createRequest } from '../http/Request';
import { ResponseHelpers } from '../http/Response';
import type { EventEmitter } from '../events/EventEmitter';
import { events } from '../events/EventEmitter';

// Re-export ApplicationConfig for bootstrap module
export type { ApplicationConfig };

// Bun native route handler type
type BunRouteHandler = (req: Request) => Response | Promise<Response>;
type BunRouteHandlers = Record<string, BunRouteHandler>;
type BunRoutes = Record<string, BunRouteHandler | BunRouteHandlers | Response>;

/**
 * Main Application class - Uses Bun's native routing
 */
export class Application {
  private static instance: Application | null = null;
  
  private config: ApplicationConfig;
  private server: ReturnType<typeof Bun.serve> | null = null;
  private container: Container;
  private emitter: EventEmitter;
  private routes: BunRoutes = {};
  private globalMiddleware: MiddlewareHandler[] = [];
  private currentPrefix: string = '';
  private middlewareStack: MiddlewareHandler[][] = [];
  private booted: boolean = false;
  private bootCallbacks: Array<() => void | Promise<void>> = [];
  private shutdownCallbacks: Array<() => void | Promise<void>> = [];

  constructor(config: ApplicationConfig = {}) {
    this.config = {
      port: config.port ?? 3000,
      hostname: config.hostname ?? '0.0.0.0',
      development: config.development ?? process.env.NODE_ENV !== 'production',
      timezone: config.timezone ?? 'UTC',
      locale: config.locale ?? 'en',
      baseUrl: config.baseUrl ?? `http://localhost:${config.port ?? 3000}`,
    };

    this.container = Container.getInstance();
    this.emitter = events();
    this.registerCoreServices();
    Application.instance = this;
  }

  static getInstance(): Application {
    if (!Application.instance) {
      throw new Error('Application has not been initialized');
    }
    return Application.instance;
  }

  static create(config: ApplicationConfig = {}): Application {
    return new Application(config);
  }

  private registerCoreServices(): void {
    this.container.instance('app', this);
    this.container.instance('events', this.emitter);
    this.container.instance('config', this.config);
  }

  getContainer(): Container {
    return this.container;
  }

  getEvents(): EventEmitter {
    return this.emitter;
  }

  getConfig(): ApplicationConfig {
    return { ...this.config };
  }

  isDevelopment(): boolean {
    return this.config.development ?? false;
  }

  isProduction(): boolean {
    return !this.isDevelopment();
  }

  booting(callback: () => void | Promise<void>): this {
    this.bootCallbacks.push(callback);
    return this;
  }

  terminating(callback: () => void | Promise<void>): this {
    this.shutdownCallbacks.push(callback);
    return this;
  }

  async boot(): Promise<void> {
    if (this.booted) return;
    await this.emitter.emit('app:booting');
    for (const callback of this.bootCallbacks) {
      await callback();
    }
    this.booted = true;
    await this.emitter.emit('app:booted');
  }

  /**
   * Wrap handler with middleware pipeline
   */
  private wrapHandler(handler: (req: NinotsRequest) => Response | Promise<Response>): BunRouteHandler {
    const middleware = [...this.globalMiddleware, ...this.middlewareStack.flat()];
    
    return async (req: Request): Promise<Response> => {
      const startTime = performance.now();
      
      try {
        // Extract params from Bun's native routing (req.params)
        const params = (req as Request & { params?: Record<string, string> }).params ?? {};
        const ninotsRequest = createRequest(req, params, req.url, null);

        let response: Response;

        if (middleware.length > 0) {
          const pipeline = new Pipeline();
          response = await pipeline
            .through(middleware)
            .setHandler(handler)
            .handle(ninotsRequest);
        } else {
          response = await handler(ninotsRequest);
        }

        const duration = performance.now() - startTime;
        await this.emitter.emit('request:completed', { request: ninotsRequest, response, duration });

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        await this.emitter.emit('request:error', { request: req, error, duration });

        if (this.isDevelopment()) {
          const errorMessage = error instanceof Error ? error.stack : String(error);
          return new Response(`Internal Server Error\n\n${errorMessage}`, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          });
        }

        return ResponseHelpers.serverError('Internal Server Error');
      }
    };
  }

  /**
   * Add a route - registers directly in Bun's native routes object
   */
  private addRoute(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'ALL',
    path: string,
    handler: (req: NinotsRequest) => Response | Promise<Response>
  ): this {
    const fullPath = this.currentPrefix + path;
    const wrappedHandler = this.wrapHandler(handler);

    if (method === 'ALL') {
      // For 'any' routes, register the handler directly
      this.routes[fullPath] = wrappedHandler;
    } else {
      // For specific methods, use Bun's per-method handler syntax
      const existing = this.routes[fullPath];
      if (existing && typeof existing === 'object' && !(existing instanceof Response)) {
        (existing as BunRouteHandlers)[method] = wrappedHandler;
      } else {
        this.routes[fullPath] = { [method]: wrappedHandler } as BunRouteHandlers;
      }
    }

    return this;
  }

  // Route Registration - Using Bun's native :param syntax
  get(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('GET', path, handler);
  }

  post(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('POST', path, handler);
  }

  put(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('PUT', path, handler);
  }

  patch(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('PATCH', path, handler);
  }

  delete(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('DELETE', path, handler);
  }

  options(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('OPTIONS', path, handler);
  }

  head(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('HEAD', path, handler);
  }

  any(path: string, handler: (req: NinotsRequest) => Response | Promise<Response>): this {
    return this.addRoute('ALL', path, handler);
  }

  /** Serve a static response (Bun native) */
  static(path: string, response: Response): this {
    this.routes[this.currentPrefix + path] = response;
    return this;
  }

  /** Serve a file using Bun.file() */
  file(path: string, filePath: string): this {
    this.routes[this.currentPrefix + path] = Bun.file(filePath) as unknown as Response;
    return this;
  }

  /** Add a redirect using Response.redirect() */
  redirect(from: string, to: string, status: 301 | 302 | 307 | 308 = 302): this {
    this.routes[this.currentPrefix + from] = Response.redirect(to, status);
    return this;
  }

  /** Add global middleware */
  use(...middleware: MiddlewareHandler[]): this {
    this.globalMiddleware.push(...middleware);
    return this;
  }

  /** Create a route group with prefix and/or middleware */
  group(options: { prefix?: string; middleware?: MiddlewareHandler[] }, callback: () => void): this {
    const previousPrefix = this.currentPrefix;
    
    if (options.prefix) {
      this.currentPrefix = previousPrefix + options.prefix;
    }
    if (options.middleware) {
      this.middlewareStack.push(options.middleware);
    }

    callback();

    this.currentPrefix = previousPrefix;
    if (options.middleware) {
      this.middlewareStack.pop();
    }

    return this;
  }

  /** Start the HTTP server using Bun.serve with native routes */
  async start(): Promise<ReturnType<typeof Bun.serve>> {
    await this.boot();

    this.server = Bun.serve({
      port: this.config.port,
      hostname: this.config.hostname,
      development: this.config.development,
      
      // Bun's native routes object
      routes: this.routes,

      // Fallback for unmatched routes
      fetch: async (req) => {
        await this.emitter.emit('request:notfound', { request: req, path: new URL(req.url).pathname });
        return ResponseHelpers.notFound('Not Found');
      },

      // Native error handler
      error: (error) => {
        console.error('Server error:', error);
        if (this.isDevelopment()) {
          return new Response(`Server Error: ${error.message}\n\n${error.stack}`, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
        return ResponseHelpers.serverError('Internal Server Error');
      },
    });

    await this.emitter.emit('app:started', { server: this.server });
    console.log(`🚀 Ninots server running at ${this.server.url}`);

    return this.server;
  }

  /** Stop the HTTP server */
  async stop(closeActiveConnections: boolean = true): Promise<void> {
    await this.emitter.emit('app:stopping');
    for (const callback of this.shutdownCallbacks) {
      await callback();
    }
    if (this.server) {
      await this.server.stop(closeActiveConnections);
      this.server = null;
    }
    await this.emitter.emit('app:stopped');
  }

  /** Hot reload routes (Bun native feature) */
  reload(): void {
    if (!this.server) throw new Error('Server is not running');
    this.server.reload({
      routes: this.routes,
      fetch: async (_req) => ResponseHelpers.notFound('Not Found'),
    });
  }

  /** Get server metrics (Bun native) */
  get metrics() {
    if (!this.server) return null;
    return {
      pendingRequests: this.server.pendingRequests,
      pendingWebSockets: this.server.pendingWebSockets,
      port: this.server.port,
      hostname: this.server.hostname,
      url: this.server.url,
    };
  }
}

// Helper Functions
export function app(): Application {
  return Application.getInstance();
}

export function createApp(config: ApplicationConfig = {}): Application {
  return Application.create(config);
}

export function resolve<T>(abstract: string | symbol): T {
  return container().make<T>(abstract);
}
