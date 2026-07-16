/**
 * Name normalization helpers for CLI generators.
 */
export interface ControllerNames {
    readonly className: string;
    readonly fileName: string;
    readonly importPath: string;
    readonly routePrefix: string;
    readonly variableName: string;
}
export interface ModelNames {
    readonly className: string;
    readonly fileName: string;
    readonly importPath: string;
    readonly tableName: string;
}
export interface MigrationNames {
    readonly className: string;
    readonly fileName: string;
}
export interface ViewNames {
    readonly exportName: string;
    readonly fileName: string;
    readonly importPath: string;
}
export declare function normalizeControllerName(input: string): ControllerNames;
export declare function normalizeModelName(input: string): ModelNames;
export declare function normalizeMigrationName(input: string): MigrationNames;
export declare function migrationTimestamp(date?: Date): string;
export declare function normalizeViewName(input: string): ViewNames;
export declare function applyStubReplacements(template: string, replacements: Record<string, string>): string;
