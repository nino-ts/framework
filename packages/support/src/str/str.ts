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
export class Str {
    // Case transformations

    /**
     * Convert string to camelCase.
     * Treats hyphens, underscores, and spaces as separators.
     */
    static camel(str: string): string {
        const words = str.split(/[-_\s]+/).filter(Boolean);
        if (words.length === 0) return '';
        const first = words[0];
        if (!first) return '';
        return first.toLowerCase() + words.slice(1).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
    }

    /**
     * Convert string to snake_case.
     * Handles camelCase, kebab-case, and spaces.
     */
    static snake(str: string): string {
        return str
            .replace(/([A-Z])/g, '_$1')
            .replace(/[-\s]+/g, '_')
            .toLowerCase()
            .replace(/^_+/, '');
    }

    /**
     * Convert string to kebab-case.
     * Handles camelCase, snake_case, and spaces.
     */
    static kebab(str: string): string {
        return str
            .replace(/([A-Z])/g, '-$1')
            .replace(/[_\s]+/g, '-')
            .toLowerCase()
            .replace(/^-+/, '');
    }

    /**
     * Convert string to StudlyCase (PascalCase).
     * Treats hyphens, underscores, and spaces as word separators.
     */
    static studly(str: string): string {
        const words = str.split(/[-_\s]+/).filter(Boolean);
        return words.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('');
    }

    /**
     * Convert string to UPPERCASE.
     */
    static upper(str: string): string {
        return str.toUpperCase();
    }

    /**
     * Convert string to lowercase.
     */
    static lower(str: string): string {
        return str.toLowerCase();
    }

    // Checking

    /**
     * Check if string starts with the given search string.
     */
    static startsWith(str: string, search: string): boolean {
        return str.startsWith(search);
    }

    /**
     * Check if string ends with the given search string.
     */
    static endsWith(str: string, search: string): boolean {
        return str.endsWith(search);
    }

    /**
     * Check if string contains the given search string.
     */
    static contains(str: string, search: string): boolean {
        return str.includes(search);
    }

    /**
     * Check if string does not contain the given search string.
     */
    static doesntContain(str: string, search: string): boolean {
        return !str.includes(search);
    }

    // Extraction

    /**
     * Get the substring after the first occurrence of search string.
     * Returns original string if search string is not found.
     */
    static after(str: string, search: string): string {
        const index = str.indexOf(search);
        return index === -1 ? str : str.slice(index + search.length);
    }

    /**
     * Get the substring before the first occurrence of search string.
     * Returns original string if search string is not found.
     */
    static before(str: string, search: string): string {
        const index = str.indexOf(search);
        return index === -1 ? str : str.slice(0, index);
    }

    /**
     * Get the substring between two strings.
     * Returns empty string if either start or end is not found.
     */
    static between(str: string, start: string, end: string): string {
        const startIndex = str.indexOf(start);
        if (startIndex === -1) return '';
        
        const afterStart = startIndex + start.length;
        const endIndex = str.indexOf(end, afterStart);
        
        return endIndex === -1 ? '' : str.slice(afterStart, endIndex);
    }

    // Manipulation

    /**
     * Replace all occurrences of search string with replacement.
     */
    static replace(str: string, search: string, replacement: string): string {
        return str.split(search).join(replacement);
    }

    /**
     * Replace only the first occurrence of search string.
     */
    static replaceFirst(str: string, search: string, replacement: string): string {
        const index = str.indexOf(search);
        if (index === -1) return str;
        return str.slice(0, index) + replacement + str.slice(index + search.length);
    }

    /**
     * Truncate string to a maximum length, appending end suffix if truncated.
     */
    static limit(str: string, limit: number, end: string = '...'): string {
        if (str.length <= limit) return str;
        return str.slice(0, limit) + end;
    }

    /**
     * Create a URL-safe slug from the string.
     * Converts to lowercase and replaces non-alphanumeric characters with separator.
     */
    static slug(str: string, separator: string = '-'): string {
        return str
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s-]+/g, separator)
            .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
    }

    // Parsing

    /**
     * Remove leading and trailing whitespace (or specified characters).
     */
    static trim(str: string, chars?: string): string {
        if (chars === undefined) {
            return str.trim();
        }
        
        const regex = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g');
        return str.replace(regex, '');
    }

    /**
     * Extract substring starting at index with optional length.
     * Supports negative indices (from end of string).
     */
    static substr(str: string, start: number, length?: number): string {
        return str.substr(start, length);
    }

    /**
     * Get the length of the string.
     */
    static length(str: string): number {
        return str.length;
    }
}
