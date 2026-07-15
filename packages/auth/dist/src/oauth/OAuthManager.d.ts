import type { ProviderConfig } from "./AbstractOAuthProvider";
import type { OAuthProvider } from "./contracts/OAuthProvider";
export declare class OAuthManager {
    protected config: Record<string, ProviderConfig>;
    protected drivers: Map<string, OAuthProvider>;
    protected customCreators: Map<string, (config: ProviderConfig) => OAuthProvider>;
    constructor(config: Record<string, ProviderConfig>);
    /**
     * Get a driver instance.
     */
    driver(driver: string): OAuthProvider;
    /**
     * Register a custom driver creator.
     */
    extend(driver: string, callback: (config: ProviderConfig) => OAuthProvider): this;
    /**
     * Create a new driver instance.
     */
    protected createDriver(driver: string): OAuthProvider;
}
