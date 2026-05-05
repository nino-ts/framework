// Core
export { AuthManager } from "./src/auth-manager";
// Contracts
export type { Authenticatable } from "./src/contracts/authenticatable";
export type { ConnectionInterface } from "./src/contracts/connection-interface";
export type { Guard, StatefulGuard } from "./src/contracts/guard";
export type { Hasher } from "./src/contracts/hasher";
export type { SessionInterface } from "./src/contracts/session-interface";
export type { UserProvider } from "./src/contracts/user-provider";
// Encryption
export { WebEncrypter } from "./src/encryption/encrypter";
export { DecryptException, EncryptException } from "./src/encryption/exceptions";
export { RequestGuard } from "./src/guards/request-guard";
// Guards
export { SessionGuard } from "./src/guards/session-guard";
export { TokenGuard } from "./src/guards/token-guard";
export { ArgonHasher } from "./src/hashing/argon-hasher";
// Hashing
export { BcryptHasher } from "./src/hashing/bcrypt-hasher";
export { JwksError, JwtError } from "./src/jwt/errors";
export { JwksCache } from "./src/jwt/jwks-cache";

// JWT
export { JwtDecoder } from "./src/jwt/jwt-decoder";
export type { JwksKey, JwtHeader, JwtPayload } from "./src/jwt/types";
// Middleware
export { authenticate } from "./src/middleware/authenticate";
export { guest } from "./src/middleware/guest";
export { AbstractOAuthProvider } from "./src/oauth/AbstractOAuthProvider";
// OAuth
export { OAuthManager } from "./src/oauth/OAuthManager";
export { OAuthUser } from "./src/oauth/OAuthUser";
export { GitHubProvider } from "./src/oauth/providers/GitHubProvider";
// Providers
export { DatabaseUserProvider } from "./src/providers/database-provider";
export { DatabaseSessionDriver } from "./src/session/drivers/database-driver";
export { FileSessionDriver } from "./src/session/drivers/file-driver";
export { MemorySessionDriver } from "./src/session/drivers/memory-driver";
// Session
export { Session } from "./src/session/session";
export { SessionManager } from "./src/session/session-manager";
