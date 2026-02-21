import type { ProviderConfig } from '@/abstract-provider.ts';
import type { SocialProvider } from '@/contracts/provider.ts';
import { GitHubProvider } from '@/providers/github-provider.ts';

export class SocialManager {
  protected drivers: Map<string, SocialProvider> = new Map();
  protected customCreators: Map<string, (config: ProviderConfig) => SocialProvider> = new Map();

  constructor(protected config: Record<string, ProviderConfig>) {}

  /**
   * Get a driver instance.
   */
  driver(driver: string): SocialProvider {
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
  extend(driver: string, callback: (config: ProviderConfig) => SocialProvider): this {
    this.customCreators.set(driver, callback);
    return this;
  }

  /**
   * Create a new driver instance.
   */
  protected createDriver(driver: string): SocialProvider {
    const config = this.config[driver];

    if (!config) {
      throw new Error(`Config for social driver [${driver}] not found.`);
    }

    if (this.customCreators.has(driver)) {
      return this.customCreators.get(driver)?.(config);
    }

    switch (driver) {
      case 'github':
        return new GitHubProvider(config);
      default:
        throw new Error(`Social driver [${driver}] not supported.`);
    }
  }
}
