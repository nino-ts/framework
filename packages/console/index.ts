/**
 * @ninots/console - CLI Framework
 *
 * @packageDocumentation
 */

export { DbSeedCommand, type DbSeedCommandOptions } from "./src/commands/db-seed-command";
export { MakeControllerCommand, type MakeControllerCommandOptions } from "./src/commands/make-controller-command";
export { MakeMigrationCommand, type MakeMigrationCommandOptions } from "./src/commands/make-migration-command";
export { MakeModelCommand, type MakeModelCommandOptions } from "./src/commands/make-model-command";
export { MakeViewCommand, type MakeViewCommandOptions } from "./src/commands/make-view-command";
export { MigrateCommand, type MigrateCommandOptions } from "./src/commands/migrate-command";
export { Command } from "./src/command";
export {
    PathResolver,
    StubExistsError,
    applyStubReplacements,
    migrationTimestamp,
    normalizeControllerName,
    normalizeMigrationName,
    normalizeModelName,
    normalizeViewName,
    type GeneratorPathsConfig,
    type StubWriteResult,
} from "./src/generator";
export type { CommandInterface } from "./src/contracts/command-interface";
export type { KernelInterface } from "./src/contracts/kernel-interface";
export { Kernel } from "./src/kernel";
export { OutputStyle } from "./src/output-style";
export type {
    CommandDefinition,
    CommandSignature,
    ParsedArguments,
} from "./src/types";
