/**
 * Ninots Framework - Response Helpers
 * Laravel-inspired response creation utilities
 * Zero dependencies implementation
 */

import type { JsonResponseOptions, RedirectOptions, CookieOptions, ViewData, ViewEngine } from '../types';

// Type alias for Bun.file return type
type BunFile = ReturnType<typeof Bun.file>;

/**
 * Response factory with fluent API
 */
export class ResponseFactory {
  private statusCode: number = 200;
  private responseHeaders: Headers = new Headers();
  private cookies: Map<string, { value: string; options: CookieOptions }> = new Map();

  /**
   * Set response status
   */
  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  /**
   * Set a header
   */
  header(name: string, value: string): this {
    this.responseHeaders.set(name, value);
    return this;
  }

  /**
   * Set multiple headers
   */
  headers(headers: Record<string, string>): this {
    for (const [name, value] of Object.entries(headers)) {
      this.responseHeaders.set(name, value);
    }
    return this;
  }

  /**
   * Set a cookie
   */
  cookie(name: string, value: string, options: CookieOptions = {}): this {
    this.cookies.set(name, { value, options });
    return this;
  }

  /**
   * Remove a cookie
   */
  withoutCookie(name: string): this {
    this.cookie(name, '', { maxAge: 0 });
    return this;
  }

  /**
   * Build and apply cookies to headers
   */
  private applyCookies(): void {
    for (const [name, { value, options }] of this.cookies) {
      const cookieString = buildCookieString(name, value, options);
      this.responseHeaders.append('Set-Cookie', cookieString);
    }
  }

  /**
   * Create a text response
   */
  text(content: string): Response {
    this.applyCookies();
    this.responseHeaders.set('Content-Type', 'text/plain; charset=utf-8');
    return new Response(content, {
      status: this.statusCode,
      headers: this.responseHeaders,
    });
  }

  /**
   * Create an HTML response
   */
  html(content: string): Response {
    this.applyCookies();
    this.responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
    return new Response(content, {
      status: this.statusCode,
      headers: this.responseHeaders,
    });
  }

  /**
   * Create a JSON response
   */
  json(data: unknown): Response {
    this.applyCookies();
    this.responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
    return new Response(JSON.stringify(data), {
      status: this.statusCode,
      headers: this.responseHeaders,
    });
  }

  /**
   * Create a file download response
   */
  download(file: BunFile | string, filename?: string): Response {
    this.applyCookies();
    const bunFile = typeof file === 'string' ? Bun.file(file) : file;
    const downloadName = filename ?? (typeof file === 'string' ? file.split('/').pop() : 'download');
    
    this.responseHeaders.set('Content-Disposition', `attachment; filename="${downloadName}"`);
    this.responseHeaders.set('Content-Type', bunFile.type);
    
    return new Response(bunFile, {
      status: this.statusCode,
      headers: this.responseHeaders,
    });
  }

  /**
   * Create a file response (inline)
   */
  file(file: BunFile | string): Response {
    this.applyCookies();
    const bunFile = typeof file === 'string' ? Bun.file(file) : file;
    
    this.responseHeaders.set('Content-Type', bunFile.type);
    
    return new Response(bunFile, {
      status: this.statusCode,
      headers: this.responseHeaders,
    });
  }

  /**
   * Create a stream response
   */
  stream(readable: ReadableStream): Response {
    this.applyCookies();
    return new Response(readable, {
      status: this.statusCode,
      headers: this.responseHeaders,
    });
  }

  /**
   * Create an empty response
   */
  noContent(): Response {
    this.applyCookies();
    return new Response(null, {
      status: 204,
      headers: this.responseHeaders,
    });
  }
}

/**
 * Build cookie string from options
 */
function buildCookieString(name: string, value: string, options: CookieOptions): string {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }
  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.httpOnly) {
    cookie += '; HttpOnly';
  }
  if (options.maxAge !== undefined) {
    cookie += `; Max-Age=${options.maxAge}`;
  }
  if (options.path) {
    cookie += `; Path=${options.path}`;
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }
  if (options.secure) {
    cookie += '; Secure';
  }
  
  return cookie;
}

/**
 * Quick response helper functions
 */
export const ResponseHelpers = {
  /**
   * Create a new response factory
   */
  make(): ResponseFactory {
    return new ResponseFactory();
  },

  /**
   * Create a text response
   */
  text(content: string, status: number = 200): Response {
    return new Response(content, {
      status,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },

  /**
   * Create an HTML response
   */
  html(content: string, status: number = 200): Response {
    return new Response(content, {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },

  /**
   * Create a JSON response
   */
  json(data: unknown, options: JsonResponseOptions = {}): Response {
    const { status = 200, headers = {} } = options;
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...headers,
      },
    });
  },

  /**
   * Create a redirect response
   */
  redirect(url: string, options: RedirectOptions = {}): Response {
    const { status = 302 } = options;
    return Response.redirect(url, status);
  },

  /**
   * Create a permanent redirect response
   */
  permanentRedirect(url: string): Response {
    return Response.redirect(url, 301);
  },

  /**
   * Create a back redirect (uses Referer header)
   */
  back(request: Request, fallback: string = '/'): Response {
    const referer = request.headers.get('Referer') ?? fallback;
    return Response.redirect(referer, 302);
  },

  /**
   * Create a 404 response
   */
  notFound(message: string = 'Not Found'): Response {
    return new Response(message, { status: 404 });
  },

  /**
   * Create a 401 response
   */
  unauthorized(message: string = 'Unauthorized'): Response {
    return new Response(message, { status: 401 });
  },

  /**
   * Create a 403 response
   */
  forbidden(message: string = 'Forbidden'): Response {
    return new Response(message, { status: 403 });
  },

  /**
   * Create a 400 response
   */
  badRequest(message: string = 'Bad Request'): Response {
    return new Response(message, { status: 400 });
  },

  /**
   * Create a 422 response (validation error)
   */
  validationError(errors: Record<string, string[]>): Response {
    return new Response(JSON.stringify({ errors }), {
      status: 422,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  },

  /**
   * Create a 500 response
   */
  serverError(message: string = 'Internal Server Error'): Response {
    return new Response(message, { status: 500 });
  },

  /**
   * Create a file download response
   */
  download(file: BunFile | string, filename?: string): Response {
    const bunFile = typeof file === 'string' ? Bun.file(file) : file;
    const downloadName = filename ?? (typeof file === 'string' ? file.split('/').pop() : 'download');
    
    return new Response(bunFile, {
      headers: {
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        'Content-Type': bunFile.type,
      },
    });
  },

  /**
   * Create a file response (inline)
   */
  file(file: BunFile | string): Response {
    const bunFile = typeof file === 'string' ? Bun.file(file) : file;
    return new Response(bunFile, {
      headers: { 'Content-Type': bunFile.type },
    });
  },

  /**
   * Create a no content response
   */
  noContent(): Response {
    return new Response(null, { status: 204 });
  },

  /**
   * Create a stream response
   */
  stream(readable: ReadableStream, contentType: string = 'application/octet-stream'): Response {
    return new Response(readable, {
      headers: { 'Content-Type': contentType },
    });
  },

  /**
   * Create a Server-Sent Events response
   */
  sse(generator: AsyncGenerator<string, void, unknown>): Response {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const data of generator) {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  },
};

/**
 * Simple template view function
 */
let viewEngine: ViewEngine = (template: string, data: ViewData): string => {
  let result = template;
  
  // Simple variable replacement {{ variable }}
  result = result.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const value = data[key];
    return value !== undefined ? escapeHtml(String(value)) : '';
  });
  
  // Raw output {!! variable !!}
  result = result.replace(/\{!!\s*(\w+)\s*!!\}/g, (_, key) => {
    const value = data[key];
    return value !== undefined ? String(value) : '';
  });
  
  return result;
};

/**
 * Escape HTML characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Set a custom view engine
 */
export function setViewEngine(engine: ViewEngine): void {
  viewEngine = engine;
}

/**
 * Render a view
 */
export async function view(templatePath: string, data: ViewData = {}): Promise<Response> {
  const file = Bun.file(templatePath);
  
  if (!(await file.exists())) {
    throw new Error(`View not found: ${templatePath}`);
  }
  
  const template = await file.text();
  const html = viewEngine(template, data);
  
  return ResponseHelpers.html(html);
}
