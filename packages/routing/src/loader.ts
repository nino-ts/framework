import { FileSystemRouter } from "bun";
import type { Router } from "./router";
import type { RouteHandler } from "./types";

/**
 * Loads routes from a directory using Bun.FileSystemRouter
 * and registers them into the provided Router instance.
 *
 * It maps Next.js style file routes (e.g., /users/[id].ts) to
 * framework routes (e.g., /users/:id).
 *
 * @param dir Absolute path to the routes directory
 * @param router Router instance to register routes on
 * @param prefix Optional prefix for all routes from this directory
 */
export async function loadRoutes(
	dir: string,
	router: Router,
	prefix = "",
): Promise<void> {
	const fsRouter = new FileSystemRouter({
		dir,
		style: "nextjs",
	});

	// Track registered routes to detect collisions
	const existingPaths = new Set(
		router.getRoutes().map((r) => `${r.getMethod()} ${r.getPath()}`),
	);

	for (const [routePattern, filePath] of Object.entries(fsRouter.routes)) {
		// Next.js style: /users/[id] -> Express style: /users/:id
		let normalizedPath = routePattern.replace(/\[([^\]]+)\]/g, ":$1");

		if (prefix) {
			normalizedPath = `${prefix}${normalizedPath === "/" ? "" : normalizedPath}`;
		}

		// Fix trailing slashes
		if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
			normalizedPath = normalizedPath.slice(0, -1);
		}

		try {
			const routeModule = await import(filePath);

			// Look for HTTP method exports (GET, POST, etc.)
			const supportedMethods = [
				"GET",
				"POST",
				"PUT",
				"PATCH",
				"DELETE",
				"HEAD",
				"OPTIONS",
			] as const;

			for (const method of supportedMethods) {
				if (routeModule[method]) {
					const handler = routeModule[method] as RouteHandler;
					const routeKey = `${method} ${normalizedPath}`;

					if (existingPaths.has(routeKey)) {
					}

					// Register in router
					router[method.toLowerCase() as Lowercase<typeof method>](
						normalizedPath,
						handler,
					);
					existingPaths.add(routeKey);
				}
			}
		} catch (_error) {}
	}
}
