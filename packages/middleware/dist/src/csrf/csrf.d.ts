/**
 * CSRF token helpers built on `Bun.CSRF`.
 *
 * @packageDocumentation
 */
import type { CsrfConfig, CsrfOptions, SessionResolution } from "./types";
/**
 * Resolve CSRF options with defaults.
 */
export declare function resolveCsrfConfig(options?: CsrfOptions): CsrfConfig;
/**
 * Whether the HTTP method skips CSRF verification.
 */
export declare function isSafeMethod(method: string): boolean;
/**
 * Parse cookies from a Request `Cookie` header.
 */
export declare function parseRequestCookies(request: Request): Record<string, string>;
/**
 * Read the session identifier from the configured session cookie.
 */
export declare function getSessionIdFromRequest(request: Request, sessionCookieName: string): string | undefined;
/**
 * Resolve an existing session id or create a new one for token binding.
 */
export declare function resolveSessionId(request: Request, sessionCookieName: string): SessionResolution;
/**
 * Format a `Set-Cookie` header value for the web session.
 */
export declare function formatSessionCookie(sessionId: string, sessionCookieName: string): string;
/**
 * Generate a CSRF token bound to the given session.
 */
export declare function generateCsrfToken(sessionId: string, config: CsrfConfig): string;
/**
 * Verify a CSRF token for the given session.
 */
export declare function verifyCsrfToken(token: string, sessionId: string, config: CsrfConfig): boolean;
/**
 * Extract a CSRF token from headers or form body without consuming the original request body.
 */
export declare function extractCsrfToken(request: Request, tokenFieldName: string): Promise<string | undefined>;
/**
 * Build a failure response for invalid CSRF tokens.
 */
export declare function createCsrfFailureResponse(config: CsrfConfig): Response;
/**
 * Append the session cookie to an existing response when a new session was created.
 */
export declare function withSessionCookie(response: Response, session: SessionResolution, sessionCookieName: string): Response;
