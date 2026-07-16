import { readFile, writeFile } from "node:fs/promises";

const WEB_IMPORT_MARKER = "// -- nino:web-imports --";
const WEB_ROUTE_MARKER = "// -- nino:web-routes --";
const API_IMPORT_MARKER = "// -- nino:api-imports --";
const API_ROUTE_MARKER = "// -- nino:api-routes --";

export async function appendWebRoutes(
    routesFile: string,
    importLine: string,
    routeBlock: string,
): Promise<void> {
    await appendRoutes(routesFile, WEB_IMPORT_MARKER, WEB_ROUTE_MARKER, importLine, routeBlock);
}

export async function appendApiRoutes(
    routesFile: string,
    importLine: string,
    routeBlock: string,
): Promise<void> {
    await appendRoutes(routesFile, API_IMPORT_MARKER, API_ROUTE_MARKER, importLine, routeBlock);
}

async function appendRoutes(
    routesFile: string,
    importMarker: string,
    routeMarker: string,
    importLine: string,
    routeBlock: string,
): Promise<void> {
    const source = await readFile(routesFile, "utf8");

    if (!source.includes(importMarker) || !source.includes(routeMarker)) {
        throw new Error(
            `Routes file is missing generator markers (${importMarker}, ${routeMarker}): ${routesFile}`,
        );
    }

    let updated = source;

    if (!updated.includes(importLine)) {
        updated = updated.replace(importMarker, `${importLine}\n${importMarker}`);
    }

    if (!updated.includes(routeBlock.trim())) {
        updated = updated.replace(routeMarker, `${routeBlock}\n        ${routeMarker}`);
    }

    await writeFile(routesFile, updated, "utf8");
}
