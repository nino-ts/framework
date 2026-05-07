export interface Authenticatable {
    /**
     * Get the name of the unique identifier for the user.
     */
    getAuthIdentifierName(): string;

    /**
     * Get the unique identifier for the user.
     */
    getAuthIdentifier(): string | number;

    /**
     * Get the password for the user.
     */
    getAuthPassword(): string;

    /**
     * Get the name of the password attribute for the user.
     */
    getAuthPasswordName(): string;

    /**
     * Get the token value for the "remember me" session.
     */
    getRememberToken(): string | null;

    /**
     * Set the token value for the "remember me" session.
     */
    setRememberToken(value: string | null): void;

    /**
     * Get the column name for the "remember me" token.
     */
    getRememberTokenName(): string;
}
