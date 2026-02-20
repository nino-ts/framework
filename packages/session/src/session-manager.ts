import type { SessionDriver } from './contracts/session-driver.ts';
import { DatabaseSessionDriver, type SessionConnectionInterface } from './drivers/database-driver.ts';
import { FileSessionDriver } from './drivers/file-driver.ts';
import { MemorySessionDriver } from './drivers/memory-driver.ts';
import { Session } from './session.ts';
import type { SessionConfig } from './types.ts';

/**
 * Session Manager Factory.
 */
export class SessionManager {
  /**
   * The application configuration.
   */
  protected config: SessionConfig;

  /**
   * The array of resolved drivers.
   */
  protected drivers: Map<string, SessionDriver> = new Map();

  /**
   * Optional database connection for the database driver.
   */
  protected connection: SessionConnectionInterface | null;

  /**
   * Create a new Session Manager instance.
   */
  constructor(config: SessionConfig, connection?: SessionConnectionInterface) {
    this.config = config;
    this.connection = connection ?? null;
  }

  /**
   * Get a driver instance.
   */
  driver(name?: string): SessionDriver {
    name = name || this.config.driver;

    const existingDriver = this.drivers.get(name);
    if (existingDriver) {
      return existingDriver;
    }

    const newDriver = this.createDriver(name);
    this.drivers.set(name, newDriver);
    return newDriver;
  }

  /**
   * Create a new driver instance.
   */
  protected createDriver(name: string): SessionDriver {
    switch (name) {
      case 'file':
        return this.createFileDriver();
      case 'memory':
        return this.createMemoryDriver();
      case 'database':
        return this.createDatabaseDriver();
      default:
        throw new Error(`Session driver [${name}] is not supported.`);
    }
  }

  /**
   * Create an instance of the file session driver.
   */
  protected createFileDriver(): SessionDriver {
    return new FileSessionDriver(this.config.files || './storage/framework/sessions');
  }

  /**
   * Create an instance of the memory session driver.
   */
  protected createMemoryDriver(): SessionDriver {
    return new MemorySessionDriver();
  }

  /**
   * Create an instance of the database session driver.
   */
  protected createDatabaseDriver(): SessionDriver {
    if (!this.connection) {
      throw new Error(
        'Database session driver requires a connection. Pass a SessionConnectionInterface to SessionManager.',
      );
    }
    return new DatabaseSessionDriver(this.connection, this.config.table || 'sessions');
  }

  /**
   * Build the session instance.
   */
  build(driver: SessionDriver, id?: string, token?: string): Session {
    return new Session(driver, this.config.cookie || 'ninots_session', id, token);
  }
}
