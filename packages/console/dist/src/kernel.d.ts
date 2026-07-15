/**
 * Kernel class for managing and running console commands.
 *
 * @packageDocumentation
 */
import type { Command } from "./command";
import type { KernelInterface } from "./contracts/kernel-interface";
import type { OutputWriter } from "./types";
/**
 * The console kernel that manages and executes commands.
 *
 * @example
 * ```typescript
 * const kernel = new Kernel();
 * kernel.register(new ServeCommand());
 * kernel.register(new MakeControllerCommand());
 * await kernel.run(process.argv.slice(2));
 * ```
 */
export declare class Kernel implements KernelInterface {
    /**
     * Registered commands.
     */
    private commands;
    /**
     * Output writer.
     */
    private output;
    /**
     * Register a command.
     *
     * @param command - The command to register
     * @returns This kernel for chaining
     */
    register(command: Command): this;
    /**
     * Set the output writer.
     *
     * @param writer - Output writer
     */
    setOutput(writer: OutputWriter): void;
    /**
     * Run a command from command line arguments.
     *
     * @param argv - Command line arguments (without node and script)
     * @returns Exit code
     */
    run(argv: string[]): Promise<number>;
    /**
     * Find a command by name.
     *
     * @param name - Command name
     * @returns The command or undefined
     */
    findCommand(name: string): Command | undefined;
    /**
     * Get all registered commands.
     *
     * @returns Array of commands
     */
    getCommands(): Command[];
    /**
     * Show help information.
     */
    private showHelp;
    /**
     * Parse command line arguments for a command.
     *
     * @param command - The command
     * @param argv - Arguments (without command name)
     * @returns Parsed arguments and options
     */
    private parseArgv;
}
