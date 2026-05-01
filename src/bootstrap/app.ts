import { Container } from '../../packages/container';
import { Application } from '../../packages/foundation';
import { Pipeline } from '../../packages/middleware';
import { Router } from '../../packages/routing';

// 1. Create the IoC Container
const container = new Container();

// 2. Initialize the Foundation Application
const app = new Application(
  {
    development: process.env.NODE_ENV !== 'production',
    hostname: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 3000,
  },
  container,
);

// 3. Register Core Services into Container
const router = new Router();
const pipeline = new Pipeline(container);

app.instance('router', router);
app.instance('pipeline', pipeline);

// 4. Set up HTTP Request Handler (Routing -> Middleware)
app.setHandler(async (request: Request) => {
  const method = request.method;
  const url = new URL(request.url);

  // Match route
  const match = router.match(method, url.pathname);

  if (!match) {
    return new Response('Not Found', { status: 404 });
  }

  // Execute middleware pipeline
  // The terminal handler is the route itself
  const terminal = async (req: Request) => {
    return match.route.handler(req, match.params);
  };

  const middlewareList = match.route.middleware || [];

  return pipeline.send(request).through(middlewareList).then(terminal);
});

export { app, container };

// Boot loop if executed directly
if (import.meta.main) {
  console.log(`Starting ninoTS Application on ${app.getConfig().hostname}:${app.getConfig().port}...`);
  app.start().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
  });
}
