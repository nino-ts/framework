import path from "node:path";

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

export class PathResolver {
    readonly basePath: string;
    private readonly controllersDirectory: string;
    private readonly modelsDirectory: string;
    private readonly migrationsDirectory: string;
    private readonly viewsDirectory: string;
    private readonly webRoutesPath: string;
    private readonly apiRoutesPath: string;

    constructor(config: GeneratorPathsConfig) {
        this.basePath = config.basePath;
        this.controllersDirectory = config.controllersDirectory ?? "app/Http/Controllers";
        this.modelsDirectory = config.modelsDirectory ?? "app/Models";
        this.migrationsDirectory = config.migrationsDirectory ?? "database/migrations";
        this.viewsDirectory = config.viewsDirectory ?? "resources/views";
        this.webRoutesPath = config.webRoutesPath ?? path.join("routes", "web.ts");
        this.apiRoutesPath = config.apiRoutesPath ?? path.join("routes", "api.ts");
    }

    controllerPath(fileName: string): string {
        return path.join(this.basePath, this.controllersDirectory, `${fileName}.ts`);
    }

    modelPath(fileName: string): string {
        return path.join(this.basePath, this.modelsDirectory, `${fileName}.ts`);
    }

    migrationPath(fileName: string): string {
        return path.join(this.basePath, this.migrationsDirectory, fileName);
    }

    viewPath(fileName: string): string {
        return path.join(this.basePath, this.viewsDirectory, fileName);
    }

    webRoutesFile(): string {
        return path.isAbsolute(this.webRoutesPath)
            ? this.webRoutesPath
            : path.join(this.basePath, this.webRoutesPath);
    }

    apiRoutesFile(): string {
        return path.isAbsolute(this.apiRoutesPath)
            ? this.apiRoutesPath
            : path.join(this.basePath, this.apiRoutesPath);
    }
}
