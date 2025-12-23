/**
 * Ninots Framework - Middleware Pipeline
 * Laravel-inspired middleware system
 * Zero dependencies implementation
 */

import type { MiddlewareHandler, NinotsRequest, RouteHandler } from '../types';

/**
 * Middleware pipeline executor
 */
export class Pipeline {
  private middleware: MiddlewareHandler[] = [];
  private handler: RouteHandler | null = null;

  /**
   * Set middleware to pass through
   */
  through(middleware: MiddlewareHandler[]): this {
    this.middleware = [...middleware];
    return this;
  }

  /**
   * Set the final handler
   */
  setHandler(handler: RouteHandler): this {
    this.handler = handler;
    return this;
  }

  /**
   * Execute the pipeline
   */
  async handle(request: NinotsRequest): Promise<Response> {
    if (!this.handler) {
      throw new Error('Pipeline requires a final handler');
    }

    const finalHandler = this.handler;
    let index = 0;

    const next = async (): Promise<Response> => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index];
        if (!middleware) throw new Error('Middleware not found');
        index++;
        return middleware(request, next);
      }
      return finalHandler(request);
    };

    return next();
  }
}

/**
 * Create a new pipeline
 */
export function pipeline(): Pipeline {
  return new Pipeline();
}

// ============================================================================
// Built-in Middleware
// ============================================================================

/**
 * CORS Middleware
 */
export interface CorsOptions {
  origin?: string | string[] | ((origin: string) => boolean);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export function cors(options: CorsOptions = {}): MiddlewareHandler {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    exposedHeaders = [],
    credentials = false,
    maxAge = 86400,
  } = options;

  return async (request, next) => {
    const requestOrigin = request.headers.get('Origin') ?? '';

    // Check if origin is allowed
    let allowedOrigin: string;
    if (typeof origin === 'string') {
      allowedOrigin = origin;
    } else if (Array.isArray(origin)) {
      allowedOrigin = origin.includes(requestOrigin) ? requestOrigin : origin[0] ?? '*';
    } else if (typeof origin === 'function') {
      allowedOrigin = origin(requestOrigin) ? requestOrigin : '';
    } else {
      allowedOrigin = '*';
    }

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': methods.join(', '),
          'Access-Control-Allow-Headers': allowedHeaders.join(', '),
          'Access-Control-Max-Age': String(maxAge),
          ...(credentials && { 'Access-Control-Allow-Credentials': 'true' }),
        },
      });
    }

    // Process request and add CORS headers to response
    const response = await next();
    const newHeaders = new Headers(response.headers);
    
    newHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
    if (exposedHeaders.length) {
      newHeaders.set('Access-Control-Expose-Headers', exposedHeaders.join(', '));
    }
    if (credentials) {
      newHeaders.set('Access-Control-Allow-Credentials', 'true');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

/**
 * JSON Body Parser Middleware
 */
export function jsonParser(): MiddlewareHandler {
  return async (_request, next) => {
    // Already handles JSON body through request helpers
    return next();
  };
}

/**
 * Request Logging Middleware
 */
export interface LoggerOptions {
  format?: 'combined' | 'common' | 'dev' | 'short' | 'tiny';
  skip?: (request: NinotsRequest, response: Response) => boolean;
}

export function logger(options: LoggerOptions = {}): MiddlewareHandler {
  const { format = 'dev', skip } = options;

  return async (request, next) => {
    const startTime = performance.now();
    const response = await next();
    const duration = (performance.now() - startTime).toFixed(2);

    if (skip?.(request, response)) {
      return response;
    }

    const method = request.method;
    const url = new URL(request.url).pathname;
    const status = response.status;
    const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';

    let logMessage: string;

    switch (format) {
      case 'tiny':
        logMessage = `${method} ${url} ${status} - ${duration}ms`;
        break;
      case 'short':
        logMessage = `${request.ip ?? '-'} ${method} ${url} ${status} - ${duration}ms`;
        break;
      case 'combined':
        logMessage = `${request.ip ?? '-'} - [${new Date().toISOString()}] "${method} ${url}" ${status} ${response.headers.get('Content-Length') ?? '-'} "${request.headers.get('Referer') ?? '-'}" "${request.headers.get('User-Agent') ?? '-'}"`;
        break;
      case 'common':
        logMessage = `${request.ip ?? '-'} [${new Date().toISOString()}] "${method} ${url}" ${status}`;
        break;
      case 'dev':
      default:
        logMessage = `${statusColor}${method}\x1b[0m ${url} ${statusColor}${status}\x1b[0m ${duration}ms`;
        break;
    }

    console.log(logMessage);
    return response;
  };
}

/**
 * Rate Limiter Middleware
 */
export interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  message?: string;
  keyGenerator?: (request: NinotsRequest) => string;
}

export function rateLimit(options: RateLimitOptions = {}): MiddlewareHandler {
  const {
    windowMs = 60000, // 1 minute
    max = 100,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => req.ip ?? 'unknown',
  } = options;

  const requests = new Map<string, { count: number; resetTime: number }>();

  return async (request, next) => {
    const key = keyGenerator(request);
    const now = Date.now();

    let record = requests.get(key);

    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
      requests.set(key, record);
    }

    record.count++;

    if (record.count > max) {
      return new Response(JSON.stringify({ error: message }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)),
          'X-RateLimit-Limit': String(max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(record.resetTime),
        },
      });
    }

    const response = await next();
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-RateLimit-Limit', String(max));
    newHeaders.set('X-RateLimit-Remaining', String(Math.max(0, max - record.count)));
    newHeaders.set('X-RateLimit-Reset', String(record.resetTime));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

/**
 * Compression Middleware (using Bun's native gzip)
 */
export function compress(options: { threshold?: number } = {}): MiddlewareHandler {
  const { threshold = 1024 } = options;

  return async (request, next) => {
    const response = await next();
    const acceptEncoding = request.headers.get('Accept-Encoding') ?? '';

    // Check if client accepts gzip
    if (!acceptEncoding.includes('gzip')) {
      return response;
    }

    // Get response body
    const body = await response.arrayBuffer();

    // Skip small responses
    if (body.byteLength < threshold) {
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // Compress using Bun's native gzip
    const compressed = Bun.gzipSync(new Uint8Array(body));
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Content-Encoding', 'gzip');
    newHeaders.set('Content-Length', String(compressed.byteLength));

    return new Response(compressed, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

/**
 * Security Headers Middleware
 */
export function helmet(options: Record<string, string> = {}): MiddlewareHandler {
  const defaultHeaders: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'",
    ...options,
  };

  return async (_request, next) => {
    const response = await next();
    const newHeaders = new Headers(response.headers);

    for (const [key, value] of Object.entries(defaultHeaders)) {
      newHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

/**
 * Authentication Middleware (Bearer Token)
 */
export function auth(
  validate: (token: string) => boolean | Promise<boolean>
): MiddlewareHandler {
  return async (request, next) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.slice(7);
    const isValid = await validate(token);

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return next();
  };
}

/**
 * Timeout Middleware
 */
export function timeout(ms: number): MiddlewareHandler {
  return async (_request, next) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ms);

    try {
      const response = await Promise.race([
        next(),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error('Request timeout'));
          });
        }),
      ]);

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.message === 'Request timeout') {
        return new Response(JSON.stringify({ error: 'Request timeout' }), {
          status: 408,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }
  };
}

/**
 * Request ID Middleware
 */
export function requestId(): MiddlewareHandler {
  return async (request, next) => {
    const id = request.headers.get('X-Request-ID') ?? crypto.randomUUID();
    const response = await next();
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Request-ID', id);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}
