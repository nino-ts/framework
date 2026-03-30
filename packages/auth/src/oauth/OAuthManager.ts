import type { ProviderConfig } from '@/oauth/AbstractOAuthProvider.ts';
import type { OAuthProvider } from '@/oauth/contracts/OAuthProvider.ts';
import { GitHubProvider } from '@/oauth/providers/GitHubProvider.ts';

export class OAuthManager {
  protected drivers: Map<string, OAuthProvider> = new Map();
  protected customCreators: Map<string, (config: ProviderConfig) => OAuthProvider> = new Map();

  constructor(protected config: Record<string, ProviderConfig>) {}

  /**
   * Get a driver instance.
   */
  driver(driver: string): OAuthProvider {
    const existingDriver = this.drivers.get(driver);
    if (existingDriver) {
      return existingDriver;
    }

    const newDriver = this.createDriver(driver);
    this.drivers.set(driver, newDriver);
    return newDriver;
  }

  /**
   * Register a custom driver creator.
   */
  extend(driver: string, callback: (config: ProviderConfig) => OAuthProvider): this {
    this.customCreators.set(driver, callback);
    return this;
  }

  /**
   * Create a new driver instance.
   */
  protected createDriver(driver: string): OAuthProvider {
    const config = this.config[driver];

    if (!config) {
      throw new Error(`Config for oauth driver [${driver}] not found.`);
    }

    const creator = this.customCreators.get(driver);
    if (creator) {
      return creator(config);
    }

    switch (driver) {
      case 'github':
        return new GitHubProvider(config);
      default:
        throw new Error(`OAuth driver [${driver}] not supported.`);
    }
  }
}
