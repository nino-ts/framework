/**
 * Resolves generator output paths relative to an application root.
 */
export interface GeneratorPathsConfig {
    readonly basePath: string;
    readonly controllersDirectory?: string;
    readonly modelsDirectory?: string;
    readonly migrationsDirectory?: string;
    readonly viewsDirectory?: string;
    readonly webRoutesPath?: string;
    readonly apiRoutesPath?: string;
}
export declare class PathResolver {
    readonly basePath: string;
    private readonly controllersDirectory;
    private readonly modelsDirectory;
    private readonly migrationsDirectory;
    private readonly viewsDirectory;
    private readonly webRoutesPath;
    private readonly apiRoutesPath;
    constructor(config: GeneratorPathsConfig);
    controllerPath(fileName: string): string;
    modelPath(fileName: string): string;
    migrationPath(fileName: string): string;
    viewPath(fileName: string): string;
    webRoutesFile(): string;
    apiRoutesFile(): string;
}
