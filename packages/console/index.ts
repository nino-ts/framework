/**
 * @ninots/console - CLI Framework
 *
 * @packageDocumentation
 */

export { DbSeedCommand, type DbSeedCommandOptions } from "./src/commands/db-seed-command";
export { MigrateCommand, type MigrateCommandOptions } from "./src/commands/migrate-command";
export { Command } from "./src/command";
export type { CommandInterface } from "./src/contracts/command-interface";
export type { KernelInterface } from "./src/contracts/kernel-interface";
export { Kernel } from "./src/kernel";
export { OutputStyle } from "./src/output-style";
export type {
    CommandDefinition,
    CommandSignature,
    ParsedArguments,
} from "./src/types";
