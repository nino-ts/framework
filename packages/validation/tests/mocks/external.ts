/**
 * Mocks de Dependências Externas para Testes.
 *
 * @packageDocumentation
 * Mocks para database, HTTP e outros serviços externos.
 */

// ============================================
// Database Mocks
// ============================================

/**
 * Repositório de database mock.
 */
export interface MockDatabaseRepository {
  /**
   * Verifica existência de registro.
   */
  exists: (table: string, column: string, value: unknown) => Promise<boolean>;

  /**
   * Conta registros.
   */
  count: (table: string, column: string, value: unknown, ignoreId?: string | number) => Promise<number>;

  /**
   * Busca registro.
   */
  find: (table: string, column: string, value: unknown) => Promise<Record<string, unknown> | null>;

  /**
   * Executa query.
   */
  query: (sql: string, params?: unknown[]) => Promise<Record<string, unknown>[]>;
}

/**
 * Configuração para mock de database.
 */
export interface DatabaseMockConfig {
  /**
   * Dados pré-carregados por tabela.
   */
  data?: Record<string, Record<string, unknown>[]>;

  /**
   * Se deve simular erro de conexão.
   */
  connectionError?: boolean;

  /**
   * Delay simulado em ms.
   */
  delay?: number;
}

/**
 * Cria um mock de repositório de database.
 *
 * @param config - Configuração do mock
 * @returns Repositório mock
 *
 * @example
 * const db = createDatabaseMock({
 *   data: {
 *     users: [{ id: 1, email: 'test@example.com' }],
 *   },
 * });
 */
export function createDatabaseMock(config: DatabaseMockConfig = {}): MockDatabaseRepository {
  const { data = {}, connectionError = false, delay = 0 } = config;

  return {
    exists: async (table: string, column: string, value: unknown): Promise<boolean> => {
      if (connectionError) {
        throw new Error('Database connection error');
      }

      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const tableData = data[table] ?? [];
      return tableData.some((record) => record[column] === value);
    },

    count: async (
      table: string,
      column: string,
      value: unknown,
      ignoreId?: string | number,
    ): Promise<number> => {
      if (connectionError) {
        throw new Error('Database connection error');
      }

      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const tableData = data[table] ?? [];
      let count = tableData.filter((record) => record[column] === value).length;

      if (ignoreId !== undefined) {
        count = tableData.filter((record) => record[column] === value && record.id !== ignoreId).length;
      }

      return count;
    },

    find: async (table: string, column: string, value: unknown): Promise<Record<string, unknown> | null> => {
      if (connectionError) {
        throw new Error('Database connection error');
      }

      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const tableData = data[table] ?? [];
      return tableData.find((record) => record[column] === value) ?? null;
    },

    query: async (sql: string, params?: unknown[]): Promise<Record<string, unknown>[]> => {
      if (connectionError) {
        throw new Error('Database connection error');
      }

      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Mock simples - retorna dados da tabela mencionada no SQL
      const tableMatch = sql.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        const tableName = tableMatch[1];
        return data[tableName] ?? [];
      }

      return [];
    },
  };
}

// ============================================
// Auth Service Mocks
// ============================================

/**
 * Serviço de autenticação mock.
 */
export interface MockAuthService {
  /**
   * Verifica senha.
   */
  verifyPassword: (password: string) => Promise<boolean>;

  /**
   * Obtém usuário atual.
   */
  getCurrentUser: () => Promise<Record<string, unknown> | null>;

  /**
   * Obtém senha hash do usuário.
   */
  getPasswordHash: () => Promise<string>;
}

/**
 * Configuração para mock de auth.
 */
export interface AuthMockConfig {
  /**
   * Se a senha é válida.
   */
  passwordValid?: boolean;

  /**
   * Usuário atual.
   */
  user?: Record<string, unknown> | null;

  /**
   * Hash de senha mock.
   */
  passwordHash?: string;
}

/**
 * Cria um mock de serviço de autenticação.
 *
 * @param config - Configuração do mock
 * @returns Serviço mock
 *
 * @example
 * const auth = createAuthMock({
 *   passwordValid: true,
 *   user: { id: 1, email: 'test@example.com' },
 * });
 */
export function createAuthMock(config: AuthMockConfig = {}): MockAuthService {
  const { passwordValid = false, user = null, passwordHash = '$2b$10$mockedhash' } = config;

  return {
    verifyPassword: async (password: string): Promise<boolean> => {
      return passwordValid;
    },

    getCurrentUser: async (): Promise<Record<string, unknown> | null> => {
      return user;
    },

    getPasswordHash: async (): Promise<string> => {
      return passwordHash;
    },
  };
}

// ============================================
// HTTP Mocks
// ============================================

/**
 * Resposta HTTP mock.
 */
export interface MockHttpResponse {
  /**
   * Status code.
   */
  status: number;

  /**
   * Headers.
   */
  headers: Record<string, string>;

  /**
   * Body.
   */
  body: unknown;

  /**
   * OK status.
   */
  ok: boolean;
}

/**
 * Configuração para mock de HTTP.
 */
export interface HttpMockConfig {
  /**
   * Respostas por URL.
   */
  responses?: Record<string, MockHttpResponse>;

  /**
   * Se deve simular erro de rede.
   */
  networkError?: boolean;

  /**
   * Delay simulado em ms.
   */
  delay?: number;
}

/**
 * Cria uma função fetch mock.
 *
 * @param config - Configuração do mock
 * @returns Fetch mock
 *
 * @example
 * const fetch = createFetchMock({
 *   responses: {
 *     'https://example.com': { status: 200, body: { ok: true }, headers: {}, ok: true },
 *   },
 * });
 */
export function createFetchMock(config: HttpMockConfig = {}): (url: string) => Promise<MockHttpResponse> {
  const { responses = {}, networkError = false, delay = 0 } = config;

  return async (url: string): Promise<MockHttpResponse> => {
    if (networkError) {
      throw new Error('Network error');
    }

    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    const response = responses[url];

    if (!response) {
      return {
        status: 404,
        headers: {},
        body: { error: 'Not found' },
        ok: false,
      };
    }

    return response;
  };
}

// ============================================
// File Mocks
// ============================================

/**
 * File mock para testes.
 */
export interface MockFile {
  /**
   * Nome do arquivo.
   */
  name: string;

  /**
   * Tipo MIME.
   */
  type: string;

  /**
   * Tamanho em bytes.
   */
  size: number;

  /**
   * Última modificação.
   */
  lastModified: number;

  /**
   * Conteúdo do arquivo (para leitura).
   */
  content?: ArrayBuffer;
}

/**
 * Cria um file mock.
 *
 * @param config - Configuração do file
 * @returns File mock
 *
 * @example
 * const file = createFileMock({
 *   name: 'image.jpg',
 *   type: 'image/jpeg',
 *   size: 1024 * 500,
 * });
 */
export function createFileMock(config: Partial<MockFile> = {}): MockFile {
  return {
    name: config.name ?? 'test.txt',
    type: config.type ?? 'text/plain',
    size: config.size ?? 1024,
    lastModified: config.lastModified ?? Date.now(),
    content: config.content,
  };
}

/**
 * Cria um array de files mock.
 *
 * @param count - Número de files
 * @param config - Configuração base
 * @returns Array de files mock
 */
export function createFilesMock(count: number, config: Partial<MockFile> = {}): MockFile[] {
  return Array.from({ length: count }, (_, i) =>
    createFileMock({
      ...config,
      name: config.name ?? `file-${i}.txt`,
    }),
  );
}

// ============================================
// Cache Mocks
// ============================================

/**
 * Cache mock.
 */
export interface MockCache {
  /**
   * Obtém valor.
   */
  get: (key: string) => Promise<unknown>;

  /**
   * Define valor.
   */
  set: (key: string, value: unknown, ttl?: number) => Promise<void>;

  /**
   * Remove valor.
   */
  delete: (key: string) => Promise<boolean>;

  /**
   * Limpa cache.
   */
  clear: () => Promise<void>;

  /**
   * Verifica se existe.
   */
  has: (key: string) => Promise<boolean>;
}

/**
 * Cria um cache mock.
 *
 * @param initialData - Dados iniciais
 * @returns Cache mock
 */
export function createCacheMock(initialData: Record<string, unknown> = {}): MockCache {
  const store = new Map<string, unknown>(Object.entries(initialData));

  return {
    get: async (key: string): Promise<unknown> => {
      return store.get(key);
    },

    set: async (key: string, value: unknown): Promise<void> => {
      store.set(key, value);
    },

    delete: async (key: string): Promise<boolean> => {
      return store.delete(key);
    },

    clear: async (): Promise<void> => {
      store.clear();
    },

    has: async (key: string): Promise<boolean> => {
      return store.has(key);
    },
  };
}
