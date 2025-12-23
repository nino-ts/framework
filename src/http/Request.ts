/**
 * Ninots Framework - Request Handler
 * Enhanced Request with Laravel-like helpers
 * Zero dependencies implementation
 */

import type { NinotsRequest, RouteParams, QueryParams, UploadedFile } from '../types';

/**
 * Create an enhanced Ninots Request from a standard Request
 */
export function createRequest(
  req: Request,
  params: RouteParams = {},
  routePath: string = '',
  ip: string | null = null
): NinotsRequest {
  const ninotsRequest = req as NinotsRequest;
  
  ninotsRequest.params = params;
  ninotsRequest.routePath = routePath;
  ninotsRequest.startTime = performance.now();
  ninotsRequest.ip = ip;
  ninotsRequest.query = parseQueryString(new URL(req.url).search);
  
  return ninotsRequest;
}

/**
 * Parse query string into object
 */
export function parseQueryString(search: string): QueryParams {
  const params: QueryParams = {};
  const searchParams = new URLSearchParams(search);
  
  for (const [key, value] of searchParams) {
    const existing = params[key];
    if (existing !== undefined) {
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing, value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
}

/**
 * Request helper functions
 */
export const RequestHelpers = {
  /**
   * Get the full URL of the request
   */
  fullUrl(request: NinotsRequest): string {
    return request.url;
  },

  /**
   * Get the path of the request
   */
  path(request: NinotsRequest): string {
    return new URL(request.url).pathname;
  },

  /**
   * Get the HTTP method
   */
  method(request: NinotsRequest): string {
    return request.method;
  },

  /**
   * Check if the request method matches
   */
  isMethod(request: NinotsRequest, method: string): boolean {
    return request.method.toUpperCase() === method.toUpperCase();
  },

  /**
   * Get a header value
   */
  header(request: NinotsRequest, name: string, defaultValue?: string): string | undefined {
    return request.headers.get(name) ?? defaultValue;
  },

  /**
   * Check if a header exists
   */
  hasHeader(request: NinotsRequest, name: string): boolean {
    return request.headers.has(name);
  },

  /**
   * Get the bearer token from Authorization header
   */
  bearerToken(request: NinotsRequest): string | null {
    const auth = request.headers.get('Authorization');
    if (auth?.startsWith('Bearer ')) {
      return auth.slice(7);
    }
    return null;
  },

  /**
   * Check if request expects JSON response
   */
  expectsJson(request: NinotsRequest): boolean {
    const accept = request.headers.get('Accept') ?? '';
    return accept.includes('application/json') || accept.includes('*/*');
  },

  /**
   * Check if request is AJAX
   */
  ajax(request: NinotsRequest): boolean {
    return request.headers.get('X-Requested-With')?.toLowerCase() === 'xmlhttprequest';
  },

  /**
   * Check if request is secure (HTTPS)
   */
  secure(request: NinotsRequest): boolean {
    return new URL(request.url).protocol === 'https:';
  },

  /**
   * Get a route parameter
   */
  param(request: NinotsRequest, name: string, defaultValue?: string): string | undefined {
    return request.params[name] ?? defaultValue;
  },

  /**
   * Get a query parameter
   */
  query(request: NinotsRequest, name: string, defaultValue?: string): string | undefined {
    const value = request.query[name];
    if (Array.isArray(value)) {
      return value[0] ?? defaultValue;
    }
    return value ?? defaultValue;
  },

  /**
   * Get all query parameters
   */
  queryAll(request: NinotsRequest): QueryParams {
    return request.query;
  },

  /**
   * Check if request has a specific input
   */
  has(request: NinotsRequest, key: string): boolean {
    return key in request.query || key in request.params;
  },

  /**
   * Get the content type
   */
  contentType(request: NinotsRequest): string | null {
    return request.headers.get('Content-Type');
  },

  /**
   * Check if content type is JSON
   */
  isJson(request: NinotsRequest): boolean {
    const contentType = RequestHelpers.contentType(request);
    return contentType?.includes('application/json') ?? false;
  },

  /**
   * Check if content type is form data
   */
  isFormData(request: NinotsRequest): boolean {
    const contentType = RequestHelpers.contentType(request);
    return contentType?.includes('multipart/form-data') ?? false;
  },

  /**
   * Check if content type is URL encoded
   */
  isUrlEncoded(request: NinotsRequest): boolean {
    const contentType = RequestHelpers.contentType(request);
    return contentType?.includes('application/x-www-form-urlencoded') ?? false;
  },

  /**
   * Get JSON body
   */
  async json<T = unknown>(request: NinotsRequest): Promise<T> {
    try {
      return await request.json() as T;
    } catch {
      return {} as T;
    }
  },

  /**
   * Get form data
   */
  async formData(request: NinotsRequest): Promise<globalThis.FormData> {
    try {
      return await request.formData() as globalThis.FormData;
    } catch {
      return new FormData();
    }
  },

  /**
   * Get text body
   */
  async text(request: NinotsRequest): Promise<string> {
    try {
      return await request.text();
    } catch {
      return '';
    }
  },

  /**
   * Get all input data (query + body)
   */
  async all(request: NinotsRequest): Promise<Record<string, unknown>> {
    const data: Record<string, unknown> = { ...request.query };
    
    if (RequestHelpers.isJson(request)) {
      const json = await RequestHelpers.json(request);
      Object.assign(data, json);
    } else if (RequestHelpers.isFormData(request) || RequestHelpers.isUrlEncoded(request)) {
      const formData = await RequestHelpers.formData(request);
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
    }
    
    return data;
  },

  /**
   * Get only specific fields from input
   */
  async only(request: NinotsRequest, keys: string[]): Promise<Record<string, unknown>> {
    const all = await RequestHelpers.all(request);
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      if (key in all) {
        result[key] = all[key];
      }
    }
    return result;
  },

  /**
   * Get all input except specific fields
   */
  async except(request: NinotsRequest, keys: string[]): Promise<Record<string, unknown>> {
    const all = await RequestHelpers.all(request);
    const result: Record<string, unknown> = { ...all };
    for (const key of keys) {
      delete result[key];
    }
    return result;
  },

  /**
   * Get an uploaded file
   */
  async file(request: NinotsRequest, name: string): Promise<UploadedFile | null> {
    const formData = await RequestHelpers.formData(request);
    const file = formData.get(name);
    
    if (file instanceof File) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        arrayBuffer: () => file.arrayBuffer(),
        text: () => file.text(),
        stream: () => file.stream(),
      };
    }
    
    return null;
  },

  /**
   * Get multiple uploaded files
   */
  async files(request: NinotsRequest, name: string): Promise<UploadedFile[]> {
    const formData = await RequestHelpers.formData(request);
    const files = formData.getAll(name);
    
    return files
      .filter((f): f is File => f instanceof File)
      .map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        arrayBuffer: () => file.arrayBuffer(),
        text: () => file.text(),
        stream: () => file.stream(),
      }));
  },

  /**
   * Check if a file was uploaded
   */
  async hasFile(request: NinotsRequest, name: string): Promise<boolean> {
    const file = await RequestHelpers.file(request, name);
    return file !== null;
  },

  /**
   * Get request duration in milliseconds
   */
  duration(request: NinotsRequest): number {
    return performance.now() - request.startTime;
  },

  /**
   * Get user agent
   */
  userAgent(request: NinotsRequest): string | null {
    return request.headers.get('User-Agent');
  },

  /**
   * Get referer
   */
  referer(request: NinotsRequest): string | null {
    return request.headers.get('Referer');
  },

  /**
   * Get host
   */
  host(request: NinotsRequest): string {
    return request.headers.get('Host') ?? new URL(request.url).host;
  },
};
