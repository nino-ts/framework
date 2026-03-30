export interface OAuthUser {
  getId(): string;
  getName(): string;
  getEmail(): string;
  getAvatar(): string;
  getToken(): string;
  getRefreshToken(): string | null;
  getExpiresIn(): number | null;
  getRaw(): Record<string, unknown>;
}
