import type { Authenticatable } from '@/contracts/authenticatable.ts';
import type { ConnectionInterface } from '@/contracts/connection-interface.ts';
import type { Hasher } from '@/contracts/hasher.ts';
import type { UserProvider } from '@/contracts/user-provider.ts';

// Simple Generic User Class to wrap DB results
class GenericUser implements Authenticatable {
  constructor(private attributes: Record<string, unknown>) { }

  getAuthIdentifierName(): string {
    return 'id';
  }

  getAuthIdentifier(): string | number {
    return this.attributes[this.getAuthIdentifierName()] as string | number;
  }

  getAuthPassword(): string {
    return this.attributes[this.getAuthPasswordName()] as string;
  }

  getAuthPasswordName(): string {
    return 'password';
  }

  getRememberToken(): string | null {
    const token = this.attributes[this.getRememberTokenName()];
    return token === null || token === undefined ? null : (token as string);
  }

  setRememberToken(value: string | null): void {
    this.attributes[this.getRememberTokenName()] = value;
  }

  getRememberTokenName(): string {
    return 'remember_token';
  }
}

export class DatabaseUserProvider implements UserProvider {
  constructor(
    protected connection: ConnectionInterface,
    protected hasher: Hasher,
    protected table: string,
  ) { }

  async retrieveById(identifier: string | number): Promise<Authenticatable | null> {
    const results = await this.connection.query(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [identifier]);
    return this.getUserFromResults(results);
  }

  async retrieveByToken(identifier: string | number, token: string): Promise<Authenticatable | null> {
    const results = await this.connection.query(
      `SELECT * FROM ${this.table} WHERE id = ? AND remember_token = ? LIMIT 1`,
      [identifier, token],
    );
    return this.getUserFromResults(results);
  }

  async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
    await this.connection.query(`UPDATE ${this.table} SET remember_token = ? WHERE id = ?`, [
      token,
      user.getAuthIdentifier(),
    ]);
    user.setRememberToken(token);
  }

  async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
    // Build query dynamically based on credentials (excluding password)
    const criteria: string[] = [];
    const params: unknown[] = [];

    for (const [key, value] of Object.entries(credentials)) {
      if (!key.includes('password')) {
        criteria.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (criteria.length === 0) {
      return null;
    }

    const sql = `SELECT * FROM ${this.table} WHERE ${criteria.join(' AND ')} LIMIT 1`;
    const results = await this.connection.query(sql, params);
    return this.getUserFromResults(results);
  }

  async validateCredentials(user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean> {
    const plain = credentials.password as string;
    return this.hasher.check(plain, user.getAuthPassword());
  }

  protected getUserFromResults(results: Record<string, unknown>[]): Authenticatable | null {
    if (!results || results.length === 0) {
      return null;
    }
    return new GenericUser(results[0]);
  }
}
