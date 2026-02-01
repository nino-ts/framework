/**
 * Documentation server using Bun native HTTP server
 *
 * @packageDocumentation
 */

import { serve } from 'bun';

const server = serve({
    port: 8080,
    fetch(req: Request): Response {
        const url = new URL(req.url);
        let path = url.pathname === '/' ? '/index.html' : url.pathname;

        try {
            const file = Bun.file(`./docs${path}`);
            return new Response(file);
        } catch {
            return new Response('Not Found', { status: 404 });
        }
    },
});

console.log(
    `📚 Documentation server running at http://localhost:${server.port}`,
);
console.log('Press Ctrl+C to stop');
