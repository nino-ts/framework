import type { AuthManager } from '../auth-manager';

export class Authenticate {
    protected auth: AuthManager;

    constructor(auth: AuthManager) {
        this.auth = auth;
    }

    async handle(request: Request, next: (req: Request) => Promise<Response>): Promise<Response> {
        if (await this.auth.check()) {
            return next(request);
        }

        const accept = request.headers.get('Accept');
        if (accept?.includes('application/json')) {
            return new Response(JSON.stringify({ message: 'Unauthenticated.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 401,
            });
        }

        // Default to simple 401 for now. Redirect logic usually handled by exception handler in app.
        return new Response('Unauthenticated.', { status: 401 });
    }
}
