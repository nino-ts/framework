/**
 * Resolves generator output paths relative to an application root.
 */
export interface GeneratorPathsConfig {
    readonly basePath: string;
    readonly controllersDirectory?: string;
    readonly modelsDirectory?: string;
    readonly migrationsDirectory?: string;
    readonly viewsDirectory?: string;
    readonly modulesDirectory?: string;
    readonly webRoutesPath?: string;
    readonly apiRoutesPath?: string;
    readonly providersPath?: string;
}
export declare class PathResolver {
    readonly basePath: string;
    private readonly controllersDirectory;
    private readonly modelsDirectory;
    private readonly migrationsDirectory;
    private readonly viewsDirectory;
    private readonly modulesDirectory;
    private readonly webRoutesPath;
    private readonly apiRoutesPath;
    private readonly providersPath;
    constructor(config: GeneratorPathsConfig);
    controllerPath(fileName: string): string;
    modelPath(fileName: string): string;
    migrationPath(fileName: string): string;
    viewPath(fileName: string): string;
    moduleRoot(moduleName: string): string;
    moduleProviderPath(moduleName: string, providerFileName: string): string;
    moduleRoutesPath(moduleName: string): string;
    moduleControllersDirectory(moduleName: string): string;
    moduleModelsDirectory(moduleName: string): string;
    webRoutesFile(): string;
    apiRoutesFile(): string;
    providersFile(): string;
}
