/**
 * Ninots Framework - Bootstrap
 * Application initialization and configuration
 */

import { Application, type ApplicationConfig } from './app/Application';
import { logger, cors, helmet, requestId } from './middleware/Pipeline';

/**
 * Bootstrap a new Ninots application with common defaults
 */
export function bootstrap(config: ApplicationConfig = {}): Application {
  const app = new Application({
    port: config.port ?? Number(process.env.PORT) ?? 3000,
    hostname: config.hostname ?? '0.0.0.0',
    development: config.development ?? process.env.NODE_ENV !== 'production',
    ...config,
  });

  // Register default middleware for development
  if (app.isDevelopment()) {
    app.use(logger({ format: 'dev' }));
    app.use(requestId());
  }

  return app;
}

/**
 * Bootstrap with API defaults (CORS, security headers, etc.)
 */
export function bootstrapApi(config: ApplicationConfig = {}): Application {
  const app = bootstrap(config);

  // Add API-specific middleware
  app.use(cors());
  app.use(helmet());

  return app;
}

/**
 * Quick start helper - creates and starts the application
 */
export async function serve(
  config: ApplicationConfig = {},
  setup?: (app: Application) => void | Promise<void>
): Promise<Application> {
  const app = bootstrap(config);
  
  if (setup) {
    await setup(app);
  }

  await app.start();
  return app;
}
