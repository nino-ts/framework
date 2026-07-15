/**
 * OutputStyle class for styled console output.
 *
 * @packageDocumentation
 */
import type { OutputWriter } from "./types";
/**
 * Provides styled output methods for console commands.
 *
 * @example
 * ```typescript
 * const style = new OutputStyle();
 * style.info('Processing...'); // Cyan [INFO]
 * style.success('Done!');      // Green [SUCCESS]
 * style.error('Failed!');      // Red [ERROR]
 * ```
 */
export declare class OutputStyle {
    /**
     * The output writer.
     */
    private writer;
    /**
     * Creates a new OutputStyle instance.
     *
     * @param writer - Optional output writer
     */
    constructor(writer?: OutputWriter);
    /**
     * Output an info message with cyan color.
     *
     * @param message - The message to output
     */
    info(message: string): void;
    /**
     * Output an error message with red color.
     *
     * @param message - The message to output
     */
    error(message: string): void;
    /**
     * Output a success message with green color.
     *
     * @param message - The message to output
     */
    success(message: string): void;
    /**
     * Output a warning message with yellow color.
     *
     * @param message - The message to output
     */
    warn(message: string): void;
    /**
     * Output a plain line.
     *
     * @param message - The message to output
     */
    line(message: string): void;
    /**
     * Output an empty line.
     */
    newLine(): void;
    /**
     * Output a formatted table.
     *
     * @param headers - Table headers
     * @param rows - Table rows
     */
    table(headers: string[], rows: string[][]): void;
}
