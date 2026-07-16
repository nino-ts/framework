export declare function appendWebRoutes(routesFile: string, importLine: string, routeBlock: string): Promise<void>;
export declare function appendApiRoutes(routesFile: string, importLine: string, routeBlock: string): Promise<void>;
/**
 * Insert an import at true file top-level (never inside a function body).
 *
 * Prefers placing the import immediately before an unindented import marker.
 * If the marker is indented (legacy starter layouts), falls back to inserting
 * after the last top-level import statement.
 */
export declare function insertTopLevelImport(source: string, importLine: string, importMarker: string): string;
