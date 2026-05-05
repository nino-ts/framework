/**
 * Documentation server using Bun native HTTP server.
 *
 * @packageDocumentation
 */

import { join, resolve } from "node:path";
import { serve } from "bun";

const commandLineArguments = process.argv;
const directoryIndex = commandLineArguments.indexOf("--dir");
const documentationDirectory =
  directoryIndex !== -1 && commandLineArguments[directoryIndex + 1]
    ? commandLineArguments[directoryIndex + 1]
    : "./docs";
const portIndex = commandLineArguments.indexOf("--port");
const providedPort = portIndex !== -1 ? commandLineArguments[portIndex + 1] : undefined;
const port = providedPort ? Number(providedPort) : 8080;

const resolvedDirectory = resolve(process.cwd(), documentationDirectory);

const _server = serve({
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let pathname = url.pathname;

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

    try {
      const fullPath = join(resolvedDirectory, filePath);
      const file = Bun.file(fullPath);

      if (!(await file.exists())) {
        return new Response("Not Found", { status: 404 });
      }

      const extension = filePath.split(".").pop()?.toLowerCase();
      const contentTypes: Record<string, string> = {
        css: "text/css",
        gif: "image/gif",
        html: "text/html",
        ico: "image/x-icon",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        js: "application/javascript",
        json: "application/json",
        png: "image/png",
        svg: "image/svg+xml",
        ttf: "font/ttf",
        woff: "font/woff",
        woff2: "font/woff2",
      };

      const contentType = extension ? contentTypes[extension] || "application/octet-stream" : "text/plain";

      return new Response(file, {
        headers: {
          "Content-Type": contentType,
        },
      });
    } catch (_error) {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  port,
});
