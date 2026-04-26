/**
 * Documentation server using Bun native HTTP server
 *
 * @packageDocumentation
 */

import { join, resolve } from 'node:path';
import { serve } from 'bun';

// Get directory from command line args or use default
const args = process.argv;
const dirIndex = args.indexOf('--dir');
const docsDir = dirIndex !== -1 && args[dirIndex + 1] ? args[dirIndex + 1] : './docs';
const portIndex = args.indexOf('--port');
const port = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1], 10) : 8080;

// Resolve to absolute path (cross-platform)
const resolvedDir = resolve(process.cwd(), docsDir);

console.log(`📚 Serving documentation from: ${resolvedDir}`);

const server = serve({
  fetch(req: Request): Response {
    const url = new URL(req.url);
    let path = url.pathname;

    // Handle root path
    if (path === '/') {
      path = '/index.html';
    }

    // Remove leading slash for file path
    const filePath = path.startsWith('/') ? path.slice(1) : path;

    try {
      // Use join for cross-platform path handling
      const fullPath = join(resolvedDir, filePath);
      const file = Bun.file(fullPath);

      // Check if file exists
      if (!file.exists) {
        console.error(`File not found: ${fullPath}`);
        return new Response('Not Found', { status: 404 });
      }

      // Determine content type
      const ext = filePath.split('.').pop()?.toLowerCase();
      const contentTypes: Record<string, string> = {
        css: 'text/css',
        gif: 'image/gif',
        html: 'text/html',
        ico: 'image/x-icon',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        js: 'application/javascript',
        json: 'application/json',
        png: 'image/png',
        svg: 'image/svg+xml',
        ttf: 'font/ttf',
        woff: 'font/woff',
        woff2: 'font/woff2',
      };

      const contentType = ext ? contentTypes[ext] || 'application/octet-stream' : 'text/plain';

      return new Response(file, {
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
  port,
});

console.log(`📚 Documentation server running at http://localhost:${server.port}`);
console.log('Press Ctrl+C to stop');
