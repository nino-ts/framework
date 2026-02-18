/**
 * Types and contracts for @ninots/config.
 *
 * @packageDocumentation
 */

/**
 * Configuration repository interface.
 *
 * Provides access to configuration values with dot-notation support.
 */
export interface ConfigRepository {
    /**
     * Get a configuration value by key.
     *
     * @param key - Dot-notation key (e.g., "app.name")
     * @param defaultValue - Default value if key not found
     * @returns The configuration value or default
     */
    get<T = unknown>(key: string, defaultValue?: T): T;

    /**
     * Set a configuration value.
     *
     * @param key - Dot-notation key
     * @param value - Value to set
     */
    set(key: string, value: unknown): void;

    /**
     * Check if a configuration key exists.
     *
     * @param key - Dot-notation key
     * @returns True if key exists
     */
    has(key: string): boolean;

    /**
     * Get all configuration values.
     *
     * @returns All configuration as object
     */
    all(): Record<string, unknown>;

    /**
     * Remove a configuration key.
     *
     * @param key - Dot-notation key
     */
    forget(key: string): void;
}

/**
 * Configuration loader interface.
 *
 * Loads configuration from a specific file format.
 */
export interface ConfigLoader {
    /**
     * Load configuration from a file.
     *
     * @param filePath - Absolute path to config file
     * @returns Parsed configuration object
     */
    load(filePath: string): Promise<Record<string, unknown>>;

    /**
     * Check if this loader supports a file extension.
     *
     * @param extension - File extension without dot (e.g., "json")
     * @returns True if supported
     */
    supports(extension: string): boolean;
}

/**
 * Environment loader interface.
 *
 * Loads environment variables from .env files.
 */
export interface EnvLoader {
    /**
     * Load environment variables from a .env file.
     *
     * @param filePath - Path to .env file
     * @returns Parsed environment variables
     */
    load(filePath: string): Promise<Record<string, string>>;

    /**
     * Get an environment variable.
     *
     * @param key - Variable name
     * @param defaultValue - Default value if not found
     * @returns The variable value or default
     */
    get(key: string, defaultValue?: string): string | undefined;
}

/**
 * Configuration manager options.
 */
export interface ConfigManagerOptions {
    /**
     * Directory containing configuration files.
     */
    configPath: string;

    /**
     * Path to .env file (optional).
     */
    envPath?: string;

    /**
     * Whether to cache loaded configurations.
     * @default true
     */
    cache?: boolean;
}

/**
 * Configuration item stored in cache.
 */
export interface ConfigCacheItem {
    /**
     * Configuration file name without extension.
     */
    name: string;

    /**
     * Parsed configuration data.
     */
    data: Record<string, unknown>;

    /**
     * Timestamp when loaded.
     */
    loadedAt: number;
}
