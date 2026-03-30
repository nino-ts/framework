/**
 * Mocks simples para testes unitários do DatabaseUserProvider.
 *
 * @packageDocumentation
 */

import { mock } from 'bun:test';
import type { ConnectionInterface } from '@/contracts/connection-interface';
import type { Hasher } from '@/contracts/hasher';
import type { Authenticatable } from '@/contracts/authenticatable';

/**
 * Cria um mock de ConnectionInterface com API de mock do Bun.
 *
 * @returns Um objeto ConnectionInterface mockado com função query mockada
 *
 * @example
 * ```typescript
 * const connection = createMockConnection();
 * connection.query.mockResolvedValue([{ id: 1, email: 'test@example.com' }]);
 * const results = await connection.query('SELECT * FROM users WHERE id = ?', [1]);
 * ```
 */
export function createMockConnection(): ConnectionInterface & { query: ReturnType<typeof mock> } {
  return {
    query: mock().mockResolvedValue([]),
  } as ConnectionInterface & { query: ReturnType<typeof mock> };
}

/**
 * Cria um mock de Hasher com API de mock do Bun.
 *
 * @param shouldMatch - Se o hash deve corresponder (padrão: true)
 * @returns Um objeto Hasher mockado com métodos hash, verify e needsRehash
 *
 * @example
 * ```typescript
 * const hasher = createMockHasher();
 * const hash = await hasher.hash('password');
 * expect(await hasher.verify('password', hash)).toBe(true);
 * ```
 *
 * @example
 * ```typescript
 * const hasher = createMockHasher(false);
 * hasher.verify.mockResolvedValue(false);
 * ```
 */
export function createMockHasher(shouldMatch: boolean = true): Hasher & { 
  hash: ReturnType<typeof mock>;
  verify: ReturnType<typeof mock>;
  needsRehash: ReturnType<typeof mock>;
} {
  const hasher = {
    hash: mock().mockImplementation(async (value: string) => `hashed:${value}`),
    verify: mock().mockImplementation(async (_value: string, _hashedValue: string) => {
      return shouldMatch;
    }),
    needsRehash: mock().mockImplementation(async (_hashedValue: string) => {
      return false;
    }),
  } as Hasher & { 
    hash: ReturnType<typeof mock>;
    verify: ReturnType<typeof mock>;
    needsRehash: ReturnType<typeof mock>;
  };
  
  return hasher;
}

/**
 * Dados opcionais para criar um MockUser.
 */
interface MockUserData {
  /**
   * Identificador único do usuário.
   */
  id?: string | number;

  /**
   * Endereço de email do usuário.
   */
  email?: string;

  /**
   * Nome de exibição do usuário.
   */
  name?: string | null;

  /**
   * Senha hasheada do usuário.
   */
  password?: string | null;

  /**
   * Token "remember me" do usuário.
   */
  remember_token?: string | null;
}

/**
 * Cria um mock de Authenticatable com dados personalizados.
 *
 * @param data - Dados opcionais para o usuário
 * @returns Um objeto Authenticatable mockado
 *
 * @example
 * ```typescript
 * const user = createMockUser({ id: 1, email: 'test@example.com' });
 * expect(user.getEmail()).toBe('test@example.com');
 * ```
 */
export function createMockUser(data: MockUserData = {}): Authenticatable {
  const attrs: Record<string, unknown> = {
    id: data.id ?? 1,
    email: data.email ?? 'test@example.com',
    name: data.name ?? 'Test User',
    password: data.password ?? 'hashed:password',
    remember_token: data.remember_token ?? null,
  };

  return {
    getAuthIdentifierName(): string {
      return 'id';
    },

    getAuthIdentifier(): string | number {
      return attrs.id as string | number;
    },

    getAuthPassword(): string {
      return attrs.password as string;
    },

    getAuthPasswordName(): string {
      return 'password';
    },

    getRememberToken(): string | null {
      return attrs.remember_token as string | null;
    },

    setRememberToken(value: string | null): void {
      attrs.remember_token = value;
    },

    getRememberTokenName(): string {
      return 'remember_token';
    },

    getId(): string | number {
      return attrs.id as string | number;
    },

    getEmail(): string | null {
      return attrs.email as string | null;
    },

    getName(): string | null {
      return attrs.name as string | null;
    },

    getPassword(): string | null {
      return attrs.password as string | null;
    },
  };
}
