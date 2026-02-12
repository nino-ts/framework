import type { Authenticatable } from './authenticatable';

export interface UserProvider {
    /**
     * Retrieve a user by their unique identifier.
     */
    retrieveById(identifier: string | number): Promise<Authenticatable | null>;

    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     */
    retrieveByToken(identifier: string | number, token: string): Promise<Authenticatable | null>;

    /**
     * Update the "remember me" token for the given user in storage.
     */
    updateRememberToken(user: Authenticatable, token: string): Promise<void>;

    /**
     * Retrieve a user by the given credentials.
     */
    retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null>;

    /**
     * Validate a user against the given credentials.
     */
    validateCredentials(user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean>;
}
