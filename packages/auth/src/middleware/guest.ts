import type { AuthManager } from '../auth-manager';

export class RedirectIfAuthenticated {
    protected auth: AuthManager;

    constructor(auth: AuthManager) {
        this.auth = auth;
    }

    async handle(request: Request, next: (req: Request) => Promise<Response>): Promise<Response> {
        if (await this.auth.check()) {
            // Default redirect to home. In real app, this should be configurable.
            return new Response(null, {
                headers: { Location: '/' },
                status: 302,
            });
        }

        return next(request);
    }
}
