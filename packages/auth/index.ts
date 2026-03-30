// Core
export { AuthManager } from './src/auth-manager';

// Guards
export { SessionGuard } from './src/guards/session-guard';
export { TokenGuard } from './src/guards/token-guard';
export { RequestGuard } from './src/guards/request-guard';

// Providers
export { DatabaseUserProvider } from './src/providers/database-provider';

// Hashing
export { BcryptHasher } from './src/hashing/bcrypt-hasher';
export { ArgonHasher } from './src/hashing/argon-hasher';

// Session
export { Session } from './src/session/session';
export { SessionManager } from './src/session/session-manager';
export { FileSessionDriver } from './src/session/drivers/file-driver';
export { MemorySessionDriver } from './src/session/drivers/memory-driver';
export { DatabaseSessionDriver } from './src/session/drivers/database-driver';

// OAuth
export { OAuthManager } from './src/oauth/OAuthManager';
export { AbstractOAuthProvider } from './src/oauth/AbstractOAuthProvider';
export { OAuthUser } from './src/oauth/OAuthUser';
export { GitHubProvider } from './src/oauth/providers/GitHubProvider';

// JWT
export { JwtDecoder } from './src/jwt/jwt-decoder';
export { JwksCache } from './src/jwt/jwks-cache';
export { JwtError, JwksError } from './src/jwt/errors';
export type { JwtHeader, JwtPayload, JwksKey } from './src/jwt/types';

// Encryption
export { WebEncrypter } from './src/encryption/encrypter';
export { EncryptException, DecryptException } from './src/encryption/exceptions';

// Middleware
export { authenticate } from './src/middleware/authenticate';
export { guest } from './src/middleware/guest';

// Contracts
export type { Authenticatable } from './src/contracts/authenticatable';
export type { Guard, StatefulGuard } from './src/contracts/guard';
export type { Hasher } from './src/contracts/hasher';
export type { UserProvider } from './src/contracts/user-provider';
export type { SessionInterface } from './src/contracts/session-interface';
export type { ConnectionInterface } from './src/contracts/connection-interface';
