/**
 * Base Command class for CLI commands.
 *
 * @packageDocumentation
 */
import type { CommandDefinition, OutputWriter } from "./types";
import type { CommandInterface } from "./contracts/command-interface";
/**
 * Base class for console commands.
 *
 * @example
 * ```typescript
 * class GreetCommand extends Command {
 *   signature = 'greet {name} {--loud}';
 *   description = 'Greet someone';
 *
 *   async handle(): Promise<number> {
 *     const name = this.argument('name');
 *     const loud = this.option('loud');
 *     const message = loud ? `HELLO, ${name.toUpperCase()}!` : `Hello, ${name}!`;
 *     this.info(message);
 *     return 0;
 *   }
 * }
 * ```
 */
export declare abstract class Command implements CommandInterface {
    /**
     * The command signature (e.g., 'make:controller {name} {--resource}').
     */
    protected abstract signature: string;
    /**
     * The command description.
     */
    protected abstract description: string;
    /**
     * Parsed arguments.
     */
    private args;
    /**
     * Parsed options.
     */
    private opts;
    /**
     * Output writer.
     */
    private output;
    /**
     * Execute the command.
     *
     * @returns Exit code (0 for success, non-zero for failure)
     */
    abstract handle(): Promise<number>;
    /**
     * Get the command definition.
     *
     * @returns The command definition
     */
    getDefinition(): CommandDefinition;
    /**
     * Get an argument value.
     *
     * @param name - Argument name
     * @returns The argument value or undefined
     */
    argument(name: string): string | undefined;
    /**
     * Get an option value.
     *
     * @param name - Option name
     * @returns The option value, or default from signature
     */
    option(name: string): string | boolean | undefined;
    /**
     * Set the arguments.
     *
     * @param args - Arguments object
     */
    setArguments(args: Record<string, string>): void;
    /**
     * Set the options.
     *
     * @param opts - Options object
     */
    setOptions(opts: Record<string, string | boolean>): void;
    /**
     * Set the output writer.
     *
     * @param writer - Output writer
     */
    setOutput(writer: OutputWriter): void;
    /**
     * Output an info message.
     *
     * @param message - The message
     */
    info(message: string): void;
    /**
     * Output an error message.
     *
     * @param message - The message
     */
    error(message: string): void;
    /**
     * Output a success message.
     *
     * @param message - The message
     */
    success(message: string): void;
    /**
     * Output a warning message.
     *
     * @param message - The message
     */
    warn(message: string): void;
    /**
     * Output a plain line.
     *
     * @param message - The message
     */
    line(message: string): void;
}
