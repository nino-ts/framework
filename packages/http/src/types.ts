/**
 * Type definitions for the HTTP package.
 *
 * @packageDocumentation
 */

/**
 * Options for JSON responses.
 */
export interface JsonResponseOptions {
    /**
     * HTTP status code.
     * @defaultValue 200
     */
    status?: number;

    /**
     * Additional headers to include in the response.
     */
    headers?: Record<string, string>;
}

/**
 * Options for redirect responses.
 */
export interface RedirectResponseOptions {
    /**
     * HTTP status code for the redirect.
     * @defaultValue 302
     */
    status?: 301 | 302 | 303 | 307 | 308;

    /**
     * Additional headers to include in the response.
     */
    headers?: Record<string, string>;
}

/**
 * Options for HTML responses.
 */
export interface HtmlResponseOptions {
    /**
     * HTTP status code.
     * @defaultValue 200
     */
    status?: number;

    /**
     * Additional headers to include in the response.
     */
    headers?: Record<string, string>;
}

/**
 * Options for text responses.
 */
export interface TextResponseOptions {
    /**
     * HTTP status code.
     * @defaultValue 200
     */
    status?: number;

    /**
     * Additional headers to include in the response.
     */
    headers?: Record<string, string>;
}

/**
 * Options for file responses.
 */
export interface FileResponseOptions {
    /**
     * The filename to use for Content-Disposition header.
     */
    filename?: string;

    /**
     * Whether to force download (attachment) or display inline.
     * @defaultValue false
     */
    download?: boolean;

    /**
     * Additional headers to include in the response.
     */
    headers?: Record<string, string>;
}
