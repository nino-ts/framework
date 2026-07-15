/**
 * Strict type definitions for HTTP package with explicit typing.
 *
 * @packageDocumentation
 */
/**
 * Branded type for HTTP status codes (100-599).
 * Provides compile-time type safety for valid HTTP status codes.
 *
 * @example
 * ```typescript
 * const status: HttpStatusCode = 200; // Error - must use createHttpStatusCode
 * const status = createHttpStatusCode(200); // OK
 * const status = HttpStatus.OK; // OK
 * ```
 */
export type HttpStatusCode = number & {
    readonly __brand: "HttpStatusCode";
};
/**
 * Create a type-safe HTTP status code with runtime validation.
 *
 * @param code - The numeric status code (100-599)
 * @returns A branded HttpStatusCode
 * @throws {RangeError} If code is outside valid range (100-599)
 *
 * @example
 * ```typescript
 * const ok = createHttpStatusCode(200); // HttpStatusCode
 * const invalid = createHttpStatusCode(999); // throws RangeError
 * ```
 */
export declare function createHttpStatusCode(code: number): HttpStatusCode;
/**
 * HTTP method literal union type for type-safe method checking.
 *
 * Includes all standard HTTP methods defined in RFC 7231 and RFC 5789.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE";
/**
 * HTTP redirect status codes.
 *
 * - 301: Moved Permanently - Resource permanently moved
 * - 302: Found - Temporary redirect (originally "Moved Temporarily")
 * - 303: See Other - Response is at another URI using GET
 * - 307: Temporary Redirect - Temporary redirect preserving method
 * - 308: Permanent Redirect - Permanent redirect preserving method
 */
export type RedirectStatusCode = 301 | 302 | 303 | 307 | 308;
/**
 * Content-Disposition type for file responses.
 *
 * - inline: Display file in browser
 * - attachment: Force download
 */
export type ContentDisposition = "inline" | "attachment";
/**
 * Options for JSON responses with strict type safety.
 */
export interface JsonResponseOptions {
    /**
     * HTTP status code.
     * @defaultValue 200
     */
    readonly status?: number;
    /**
     * Additional headers to include in the response.
     * Headers are immutable once set.
     */
    readonly headers?: Readonly<Record<string, string>>;
}
/**
 * Options for redirect responses with strict redirect status codes.
 */
export interface RedirectResponseOptions {
    /**
     * HTTP redirect status code.
     *
     * @defaultValue 302 (temporary redirect)
     */
    readonly status?: RedirectStatusCode;
    /**
     * Additional headers to include in the response.
     */
    readonly headers?: Readonly<Record<string, string>>;
}
/**
 * Options for HTML responses.
 */
export interface HtmlResponseOptions {
    /**
     * HTTP status code.
     * @defaultValue 200
     */
    readonly status?: number;
    /**
     * Additional headers to include in the response.
     */
    readonly headers?: Readonly<Record<string, string>>;
}
/**
 * Options for plain text responses.
 */
export interface TextResponseOptions {
    /**
     * HTTP status code.
     * @defaultValue 200
     */
    readonly status?: number;
    /**
     * Additional headers to include in the response.
     */
    readonly headers?: Readonly<Record<string, string>>;
}
/**
 * Options for file responses using Bun's native file handling.
 */
export interface FileResponseOptions {
    /**
     * The filename to use for Content-Disposition header.
     * If not specified, uses the file's original name.
     */
    readonly filename?: string;
    /**
     * Whether to force download (attachment) or display inline.
     * @defaultValue false (inline)
     */
    readonly download?: boolean;
    /**
     * Additional headers to include in the response.
     * Note: Content-Type is automatically inferred by Bun from file extension.
     */
    readonly headers?: Readonly<Record<string, string>>;
}
/**
 * Type guard to check if a string is a valid HTTP method.
 *
 * @param method - The string to check
 * @returns True if the string is a valid HTTP method
 *
 * @example
 * ```typescript
 * if (isHttpMethod(userInput)) {
 *     // userInput is HttpMethod
 * }
 * ```
 */
export declare function isHttpMethod(method: string): method is HttpMethod;
/**
 * Type guard to check if a number is a valid HTTP status code.
 *
 * @param code - The number to check
 * @returns True if the number is in the valid HTTP status code range (100-599)
 *
 * @example
 * ```typescript
 * if (isValidHttpStatusCode(statusCode)) {
 *     // statusCode can be safely cast to HttpStatusCode
 * }
 * ```
 */
export declare function isValidHttpStatusCode(code: number): code is HttpStatusCode;
/**
 * Type guard to check if a status code is a redirect status.
 *
 * @param code - The status code to check
 * @returns True if the code is a redirect status (301, 302, 303, 307, 308)
 *
 * @example
 * ```typescript
 * if (isRedirectStatus(response.status)) {
 *     // Handle redirect
 * }
 * ```
 */
export declare function isRedirectStatus(code: number): code is RedirectStatusCode;
/**
 * Common HTTP status codes as branded constants.
 *
 * Provides type-safe access to standard HTTP status codes without
 * needing to call `createHttpStatusCode()`.
 *
 * @example
 * ```typescript
 * ResponseHelpers.json(data, { status: HttpStatus.OK });
 * ResponseHelpers.json(error, { status: HttpStatus.NOT_FOUND });
 * ```
 */
export declare const HttpStatus: {
    /** 202 Accepted - Request accepted for processing */
    readonly ACCEPTED: HttpStatusCode;
    /** 502 Bad Gateway - Invalid upstream response */
    readonly BAD_GATEWAY: HttpStatusCode;
    /** 400 Bad Request - Invalid client request */
    readonly BAD_REQUEST: HttpStatusCode;
    /** 409 Conflict - Request conflicts with current state */
    readonly CONFLICT: HttpStatusCode;
    /** 201 Created - Resource created successfully */
    readonly CREATED: HttpStatusCode;
    /** 403 Forbidden - Server refuses to authorize */
    readonly FORBIDDEN: HttpStatusCode;
    /** 302 Found - Temporary redirect */
    readonly FOUND: HttpStatusCode;
    /** 504 Gateway Timeout - Upstream server timeout */
    readonly GATEWAY_TIMEOUT: HttpStatusCode;
    /** 410 Gone - Resource permanently deleted */
    readonly GONE: HttpStatusCode;
    /** 500 Internal Server Error - Generic server error */
    readonly INTERNAL_SERVER_ERROR: HttpStatusCode;
    /** 405 Method Not Allowed - Method not supported */
    readonly METHOD_NOT_ALLOWED: HttpStatusCode;
    /** 301 Moved Permanently - Resource permanently moved */
    readonly MOVED_PERMANENTLY: HttpStatusCode;
    /** 204 No Content - Success with no response body */
    readonly NO_CONTENT: HttpStatusCode;
    /** 406 Not Acceptable - Cannot produce acceptable response */
    readonly NOT_ACCEPTABLE: HttpStatusCode;
    /** 404 Not Found - Resource not found */
    readonly NOT_FOUND: HttpStatusCode;
    /** 501 Not Implemented - Method not implemented */
    readonly NOT_IMPLEMENTED: HttpStatusCode;
    /** 304 Not Modified - Resource hasn't been modified */
    readonly NOT_MODIFIED: HttpStatusCode;
    /** 200 OK - Standard successful response */
    readonly OK: HttpStatusCode;
    /** 402 Payment Required - Reserved for future use */
    readonly PAYMENT_REQUIRED: HttpStatusCode;
    /** 308 Permanent Redirect - Permanent redirect preserving method */
    readonly PERMANENT_REDIRECT: HttpStatusCode;
    /** 408 Request Timeout - Client took too long */
    readonly REQUEST_TIMEOUT: HttpStatusCode;
    /** 303 See Other - Response at another URI using GET */
    readonly SEE_OTHER: HttpStatusCode;
    /** 503 Service Unavailable - Server temporarily unavailable */
    readonly SERVICE_UNAVAILABLE: HttpStatusCode;
    /** 307 Temporary Redirect - Temporary redirect preserving method */
    readonly TEMPORARY_REDIRECT: HttpStatusCode;
    /** 429 Too Many Requests - Rate limit exceeded */
    readonly TOO_MANY_REQUESTS: HttpStatusCode;
    /** 401 Unauthorized - Authentication required */
    readonly UNAUTHORIZED: HttpStatusCode;
    /** 422 Unprocessable Entity - Validation failed */
    readonly UNPROCESSABLE_ENTITY: HttpStatusCode;
    /** 415 Unsupported Media Type - Media type not supported */
    readonly UNSUPPORTED_MEDIA_TYPE: HttpStatusCode;
};
