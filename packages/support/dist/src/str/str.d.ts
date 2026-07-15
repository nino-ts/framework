/**
 * Str class - String manipulation utilities
 *
 * All methods are static and work with strings directly.
 * Inspired by Laravel's Str class.
 *
 * @example
 * ```typescript
 * Str.camel('hello-world'); // 'helloWorld'
 * Str.contains('hello', 'ell'); // true
 * ```
 */
export declare const Str: {
    /**
     * Get the substring after the first occurrence of search string.
     * Returns original string if search string is not found.
     */
    after(str: string, search: string): string;
    /**
     * Get the substring before the first occurrence of search string.
     * Returns original string if search string is not found.
     */
    before(str: string, search: string): string;
    /**
     * Get the substring between two strings.
     * Returns empty string if either start or end is not found.
     */
    between(str: string, start: string, end: string): string;
    /**
     * Convert string to camelCase.
     * Treats hyphens, underscores, and spaces as separators.
     */
    camel(str: string): string;
    /**
     * Check if string contains the given search string.
     */
    contains(str: string, search: string): boolean;
    /**
     * Check if string does not contain the given search string.
     */
    doesntContain(str: string, search: string): boolean;
    /**
     * Check if string ends with the given search string.
     */
    endsWith(str: string, search: string): boolean;
    /**
     * Convert string to kebab-case.
     * Handles camelCase, snake_case, and spaces.
     */
    kebab(str: string): string;
    /**
     * Get the length of the string.
     */
    length(str: string): number;
    /**
     * Truncate string to a maximum length, appending end suffix if truncated.
     */
    limit(str: string, limit: number, end?: string): string;
    /**
     * Convert string to lowercase.
     */
    lower(str: string): string;
    /**
     * Replace all occurrences of search string with replacement.
     */
    replace(str: string, search: string, replacement: string): string;
    /**
     * Replace only the first occurrence of search string.
     */
    replaceFirst(str: string, search: string, replacement: string): string;
    /**
     * Create a URL-safe slug from the string.
     * Converts to lowercase and replaces non-alphanumeric characters with separator.
     */
    slug(str: string, separator?: string): string;
    /**
     * Convert string to snake_case.
     * Handles camelCase, kebab-case, and spaces.
     */
    snake(str: string): string;
    /**
     * Check if string starts with the given search string.
     */
    startsWith(str: string, search: string): boolean;
    /**
     * Convert string to StudlyCase (PascalCase).
     * Treats hyphens, underscores, and spaces as word separators.
     */
    studly(str: string): string;
    /**
     * Extract substring starting at index with optional length.
     * Supports negative indices (from end of string).
     */
    substr(str: string, start: number, length?: number): string;
    /**
     * Remove leading and trailing whitespace (or specified characters).
     */
    trim(str: string, chars?: string): string;
    /**
     * Convert string to UPPERCASE.
     */
    upper(str: string): string;
};
