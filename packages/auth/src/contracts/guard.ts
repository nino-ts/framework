import type { Authenticatable } from './authenticatable';

export interface Guard {
    /**
     * Determine if the current user is authenticated.
     */
    check(): Promise<boolean>;

    /**
     * Determine if the current user is a guest.
     */
    guest(): Promise<boolean>;

    /**
     * Get the currently authenticated user.
     */
    user(): Promise<Authenticatable | null>;

    /**
     * Get the ID for the currently authenticated user.
     */
    id(): Promise<string | number | null>;

    /**
     * Validate a user's credentials.
     */
    validate(credentials: Record<string, unknown>): Promise<boolean>;
}

export interface StatefulGuard extends Guard {
    /**
     * Attempt to authenticate a user using the given credentials.
     */
    attempt(credentials: Record<string, unknown>, remember?: boolean): Promise<boolean>;

    /**
     * Log a user into the application.
     */
    login(user: Authenticatable, remember?: boolean): Promise<void>;

    /**
     * Log the given user ID into the application.
     */
    loginUsingId(id: string | number, remember?: boolean): Promise<Authenticatable | false>;

    /**
     * Log the user out of the application.
     */
    logout(): Promise<void>;
}
