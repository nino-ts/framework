/**
 * @ninots/console - CLI Framework
 *
 * @packageDocumentation
 */

export { DbSeedCommand, type DbSeedCommandOptions } from "@/commands/db-seed-command.ts";
export { MigrateCommand, type MigrateCommandOptions } from "@/commands/migrate-command.ts";
export { Command } from "@/command.ts";
export type { CommandInterface } from "@/contracts/command-interface.ts";
export type { KernelInterface } from "@/contracts/kernel-interface.ts";
export { Kernel } from "@/kernel.ts";
export { OutputStyle } from "@/output-style.ts";
export type {
    CommandDefinition,
    CommandSignature,
    ParsedArguments,
} from "@/types.ts";
