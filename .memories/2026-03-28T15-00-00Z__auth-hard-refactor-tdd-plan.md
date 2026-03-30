# Hard Refactor TDD Plan - @ninots/auth

**Date:** 2026-03-28  
**Status:** Pending Approval  
**Type:** Breaking Changes / Radical Simplification

---

## 📋 Executive Summary

### Abordagem
- **TDD First:** Todos os testes criados ANTES da implementação
- **Hard Refactor:** Breaking changes totais, sem retrocompatibilidade
- **Princípios:** SOLID, KISS, YAGNI, DRY aplicados rigorosamente
- **Objetivo:** Pacote enxuto, 100% testado, API clara e simples

### Mudanças Radicais

| Ação | Impacto |
|------|---------|
| Mover jwt, social, encryption, session para pacotes separados | @ninots/auth com ~500 LOC |
| Remover RequestGuard | API simplificada, menos superfície |
| Middleware como funções | DX consistente, menos boilerplate |
| Unificar contratos duplicados | Zero redundância |
| Reduzir exports de 43 para ~18 | API surface -58% |

---

## 🎯 Estrutura Final Proposta

### @ninots/auth (Core)

```
framework/packages/auth/
├── index.ts                    # 18 exports essenciais
├── src/
│   ├── auth-manager.ts         # Factory central
│   ├── contracts/
│   │   ├── guard.ts            # Guard, StatefulGuard
│   │   ├── hasher.ts           # Hasher interface
│   │   ├── user-provider.ts    # UserProvider interface
│   │   └── authenticatable.ts  # User contract
│   ├── guards/
│   │   ├── session-guard.ts    # Session-based auth
│   │   └── token-guard.ts      # Bearer token auth
│   ├── providers/
│   │   └── database-provider.ts # SQL user provider
│   ├── hashing/
│   │   ├── bcrypt-hasher.ts    # Bcrypt implementation
│   │   └── argon-hasher.ts     # Argon2 implementation
│   └── middleware/
│       ├── authenticate.ts     # Function: authenticate(auth)
│       └── guest.ts            # Function: guest(auth)
└── tests/
    ├── setup.ts
    ├── unit/
    │   ├── auth-manager.test.ts
    │   ├── session-guard.test.ts
    │   ├── token-guard.test.ts
    │   ├── database-provider.test.ts
    │   ├── hashing.test.ts
    │   └── middleware.test.ts
    └── integration/
        ├── auth-flow.test.ts
        └── remember-me.test.ts
```

### Pacotes Separados (FASE 5 - Opcional)

```
framework/packages/
├── session/    # Session management + drivers
├── jwt/        # JWT decoder + JWKs cache
├── social/     # OAuth providers (GitHub, etc.)
└── encryption/ # WebCrypto encrypter
```

---

## 📊 Métricas Atuais vs Target

| Métrica | Antes | Target | Mudança |
|---------|-------|--------|---------|
| **Exports no index.ts** | 43 | 18 | **-58%** |
| **Arquivos em src/** | 28 | 12 | **-57%** |
| **Cobertura de testes** | 57% | 100% | **+43%** |
| **Contratos duplicados** | 4 | 0 | **-100%** |
| **Linhas de código** | ~2500 | ~1500 | **-40%** |
| **Total de Testes** | 266 | 163 | Pirâmide completa |

---

## 🧪 Pirâmide de Testes Completa

### Visão Geral

```
                    ┌─────────────┐
                    │    E2E      │  20 testes (12%)
                    │  (Topo)     │  Server real + DB real
                    ├─────────────┤
                    │   Feature   │  38 testes (23%)
                    │             │  Fluxo completo do usuário
                    ├─────────────┤
                    │ Integration │  38 testes (23%)
                    │             │  Colaboração entre classes
                    ├─────────────┤
                    │    Unit     │  67 testes (41%)
                    │   (Base)    │  Unidade isolada
                    └─────────────┘
                    TOTAL: 163 testes
```

### Distribuição por Nível

| Nível | Quantidade | % | Tempo Médio | Isolamento |
|-------|------------|---|-------------|------------|
| **Unit** | 67 | 41% | <1ms | Mocks/stubs |
| **Integration** | 38 | 23% | 1-10ms | I/O em memória |
| **Feature** | 38 | 23% | 10-50ms | DB fake |
| **E2E** | 20 | 12% | 50-200ms | Real |

### Estrutura de Diretórios Completa

```
framework/packages/auth/tests/
├── setup.ts                        # Helpers compartilhados
├── mocks/
│   ├── connection.mock.ts          # MemoryConnection (fake DB)
│   ├── session.mock.ts             # MemorySession (fake session)
│   ├── user.mock.ts                # MockUser (fake authenticatable)
│   ├── hasher.mock.ts              # MockHasher (fake hasher)
│   └── index.ts                    # Exports de todos os mocks
├── fixtures/
│   ├── users.fixture.ts            # User fixtures (dados de teste)
│   └── tokens.fixture.ts           # Token fixtures (JWT, remember)
├── unit/                           # 67 testes unitários
│   ├── auth-manager.test.ts        # 9 testes
│   ├── session-guard.test.ts       # 15 testes
│   ├── token-guard.test.ts         # 10 testes
│   ├── database-provider.test.ts   # 10 testes
│   ├── bcrypt-hasher.test.ts       # 7 testes
│   ├── argon-hasher.test.ts        # 7 testes
│   └── middleware.test.ts          # 9 testes
├── integration/                    # 38 testes de integração
│   ├── auth-flow.test.ts           # 12 testes
│   ├── remember-me.test.ts         # 10 testes
│   ├── guard-provider.test.ts      # 8 testes
│   └── middleware-auth.test.ts     # 8 testes
├── feature/                        # 38 testes de feature
│   ├── login-logout.test.ts        # 10 testes
│   ├── registration.test.ts        # 8 testes
│   ├── password-reset.test.ts      # 6 testes
│   ├── token-auth.test.ts          # 8 testes
│   └── multi-guard.test.ts         # 6 testes
└── e2e/                            # 20 testes end-to-end
    ├── http-auth.test.ts           # 8 testes
    ├── session-persistence.test.ts # 6 testes
    └── remember-me-cookie.test.ts  # 6 testes
```

---

## 🔧 FASE 0: Design da Nova API

---

## 🔴 FASE 1: Criar Mocks e Fixtures (Fundação)

### Objetivo
Criar todos os mocks e fixtures necessários para os testes unitários.

### Tarefas

#### 1.1 Mocks
**Arquivo:** `tests/mocks/connection.mock.ts`
```typescript
export class MemoryConnection implements ConnectionInterface {
  private tables: Map<string, any[]> = new Map();
  
  async query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]> {
    // Implementação fake para SELECT, INSERT, UPDATE, DELETE
  }
  
  async execute(sql: string): Promise<void> {
    // Implementação fake para CREATE TABLE, etc.
  }
}
```

**Arquivo:** `tests/mocks/session.mock.ts`
```typescript
export class MemorySession implements SessionInterface {
  private data: Map<string, unknown> = new Map();
  
  get(key: string): unknown {
    return this.data.get(key);
  }
  
  put(key: string, value: unknown): void {
    this.data.set(key, value);
  }
  
  forget(key: string): void {
    this.data.delete(key);
  }
  
  async save(): Promise<void> {
    // No-op para memória
  }
}
```

**Arquivo:** `tests/mocks/user.mock.ts`
```typescript
export class MockUser implements Authenticatable {
  constructor(
    private id: string | number,
    private email: string,
    private password?: string
  ) {}
  
  getId(): string | number {
    return this.id;
  }
  
  getName(): string | null {
    return 'Mock User';
  }
  
  getEmail(): string | null {
    return this.email;
  }
  
  getPassword(): string | null {
    return this.password || null;
  }
  
  getRememberToken(): string | null {
    return null;
  }
}
```

**Arquivo:** `tests/mocks/hasher.mock.ts`
```typescript
export class MockHasher implements Hasher {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    return hash === `hashed:${password}`;
  }
  
  async needsRehash(hash: string): Promise<boolean> {
    return false;
  }
}
```

#### 1.2 Fixtures
**Arquivo:** `tests/fixtures/users.fixture.ts`
```typescript
export function createUserFixture(
  overrides: Partial<Record<string, unknown>> = {}
): Record<string, unknown> {
  return {
    id: 1,
    email: 'user@example.com',
    name: 'Test User',
    password: 'hashed:secret123',
    remember_token: null,
    ...overrides,
  };
}

export function createAdminUserFixture(): Record<string, unknown> {
  return createUserFixture({
    id: 2,
    email: 'admin@example.com',
    name: 'Admin User',
  });
}
```

**Arquivo:** `tests/fixtures/tokens.fixture.ts`
```typescript
export function createRememberTokenFixture(): string {
  return crypto.randomUUID();
}

export function createJwtTokenFixture(payload: Record<string, unknown>): string {
  // JWT fake para testes
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa('fake-signature');
  return `${header}.${payloadEncoded}.${signature}`;
}
```

### Critérios de Aceite FASE 1
- [ ] 4 mocks criados (Connection, Session, User, Hasher)
- [ ] 2 fixtures criados (Users, Tokens)
- [ ] Todos exports em `mocks/index.ts`
- [ ] Zero `any` types
- [ ] TypeScript type-check limpo

---

## 🔴 FASE 2: Criar Testes Unitários (RED)

### Objetivo
Criar TODOS os 67 testes unitários antes da implementação.
Todos os testes devem **FALHAR** inicialmente (Red Phase do TDD).

### Tarefas

#### 2.1 AuthManager Tests
**Arquivo:** `tests/unit/auth-manager.test.ts` (9 testes)

```typescript
import { describe, expect, test, beforeEach } from 'bun:test';
import { AuthManager } from '@/auth-manager';
import { createMockSession, createMockProvider, createMockUser } from '@/mocks';

describe('AuthManager', () => {
  let authManager: AuthManager;

  beforeEach(() => {
    authManager = new AuthManager();
  });

  test('should resolve default guard', () => {
    authManager.extend('session', () => {
      const provider = createMockProvider();
      const session = createMockSession();
      return new SessionGuard('web', provider, session);
    });
    
    const guard = authManager.guard();
    expect(guard).toBeDefined();
  });

  test('should resolve named guard', () => {
    authManager.extend('token', () => {
      const provider = createMockProvider();
      return new TokenGuard(provider, new Request('http://test.com'));
    });
    
    const guard = authManager.guard('token');
    expect(guard).toBeDefined();
  });

  test('should cache guard instances', () => {
    let callCount = 0;
    authManager.extend('session', () => {
      callCount++;
      const provider = createMockProvider();
      const session = createMockSession();
      return new SessionGuard('web', provider, session);
    });
    
    authManager.guard('session');
    authManager.guard('session');
    
    expect(callCount).toBe(1); // Factory chamada apenas uma vez
  });

  test('should throw for unregistered guard name', () => {
    expect(() => authManager.guard('nonexistent')).toThrow();
  });

  test('should throw for unsupported driver', () => {
    expect(() => authManager.extend('invalid', null as any)).toThrow();
  });

  test('should extend with custom guard factory', () => {
    const factory = mock(() => createMockGuard());
    authManager.extend('custom', factory);
    expect(authManager.guard('custom')).toBeDefined();
  });

  test('should delegate check() to default guard', async () => {
    // Setup
    const mockGuard = createMockGuard();
    mockGuard.check = mock().mockResolvedValue(true);
    authManager.extend('session', () => mockGuard as any);
    
    // Act
    const result = await authManager.check();
    
    // Assert
    expect(result).toBe(true);
    expect(mockGuard.check).toHaveBeenCalled();
  });

  test('should delegate user() to default guard', async () => {
    const mockUser = createMockUser({ id: 1, email: 'test@example.com' });
    const mockGuard = createMockGuard();
    mockGuard.user = mock().mockResolvedValue(mockUser);
    authManager.extend('session', () => mockGuard as any);
    
    const result = await authManager.user();
    
    expect(result).toBe(mockUser);
    expect(mockGuard.user).toHaveBeenCalled();
  });

  test('should delegate id() to default guard', async () => {
    const mockGuard = createMockGuard();
    mockGuard.id = mock().mockResolvedValue(123);
    authManager.extend('session', () => mockGuard as any);
    
    const result = await authManager.id();
    
    expect(result).toBe(123);
    expect(mockGuard.id).toHaveBeenCalled();
  });
});
```

#### 2.2 SessionGuard Tests
**Arquivo:** `tests/unit/session-guard.test.ts` (15 testes)

```typescript
import { describe, expect, test, beforeEach } from 'bun:test';
import { SessionGuard } from '@/guards/session-guard';
import { createMockSession, createMockProvider, createMockUser } from '@/mocks';

describe('SessionGuard', () => {
  let session: ReturnType<typeof createMockSession>;
  let provider: ReturnType<typeof createMockProvider>;
  let guard: SessionGuard;

  beforeEach(() => {
    session = createMockSession();
    provider = createMockProvider();
    guard = new SessionGuard('web', provider, session);
  });

  test('should return true for guest when no user', () => {
    expect(guard.guest()).toBe(true);
  });

  test('should return false for check when no user', async () => {
    expect(await guard.check()).toBe(false);
  });

  test('should return null user when not authenticated', async () => {
    expect(await guard.user()).toBeNull();
  });

  test('should return null id when not authenticated', async () => {
    expect(await guard.id()).toBeNull();
  });

  test('should attempt login with valid credentials', async () => {
    const mockUser = createMockUser({ id: 1, email: 'test@example.com' });
    provider.retrieveByCredentials = mock().mockResolvedValue(mockUser);
    provider.validateCredentials = mock().mockResolvedValue(true);
    
    const result = await guard.attempt({
      email: 'test@example.com',
      password: 'secret'
    });
    
    expect(result).toBe(true);
  });

  test('should reject login with invalid password', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByCredentials = mock().mockResolvedValue(mockUser);
    provider.validateCredentials = mock().mockResolvedValue(false);
    
    const result = await guard.attempt({
      email: 'test@example.com',
      password: 'wrong'
    });
    
    expect(result).toBe(false);
  });

  test('should reject login with non-existent user', async () => {
    provider.retrieveByCredentials = mock().mockResolvedValue(null);
    
    const result = await guard.attempt({
      email: 'nonexistent@example.com',
      password: 'secret'
    });
    
    expect(result).toBe(false);
  });

  test('should login and set user', async () => {
    const mockUser = createMockUser({ id: 1 });
    await guard.login(mockUser);
    
    const user = await guard.user();
    expect(user).toBe(mockUser);
  });

  test('should login and store user id in session', async () => {
    const mockUser = createMockUser({ id: 42 });
    await guard.login(mockUser);
    
    expect(session.put).toHaveBeenCalledWith('web_login', 42);
  });

  test('should logout and clear user', async () => {
    const mockUser = createMockUser({ id: 1 });
    await guard.login(mockUser);
    await guard.logout();
    
    expect(await guard.user()).toBeNull();
    expect(session.forget).toHaveBeenCalledWith('web_login');
  });

  test('should loginUsingId and retrieve user', async () => {
    const mockUser = createMockUser({ id: 99 });
    provider.retrieveById = mock().mockResolvedValue(mockUser);
    
    const success = await guard.loginUsingId(99);
    
    expect(success).toBe(true);
    expect(await guard.user()).toBe(mockUser);
  });

  test('should return false for loginUsingId with unknown id', async () => {
    provider.retrieveById = mock().mockResolvedValue(null);
    
    const success = await guard.loginUsingId(999);
    
    expect(success).toBe(false);
  });

  test('should validate credentials without login', async () => {
    const mockUser = createMockUser({ id: 1 });
    provider.retrieveByCredentials = mock().mockResolvedValue(mockUser);
    provider.validateCredentials = mock().mockResolvedValue(true);
    
    const result = await guard.validate({
      email: 'test@example.com',
      password: 'secret'
    });
    
    expect(result).toBe(true);
    expect(await guard.user()).toBeNull(); // Não fez login
  });

  test('should cache user instance on subsequent calls', async () => {
    session.get = mock().mockReturnValue(1);
    provider.retrieveById = mock().mockResolvedValue(createMockUser({ id: 1 }));
    
    await guard.user();
    await guard.user();
    
    expect(provider.retrieveById).toHaveBeenCalledTimes(1);
  });

  test('should support remember me token', async () => {
    const mockUser = createMockUser({ id: 1 });
    await guard.login(mockUser, true);
    
    expect(provider.updateRememberToken).toHaveBeenCalled();
  });
});
```

#### 2.3 TokenGuard Tests
**Arquivo:** `tests/unit/token-guard.test.ts` (10 testes)

#### 2.4 DatabaseUserProvider Tests
**Arquivo:** `tests/unit/database-provider.test.ts` (10 testes)

#### 2.5 Hasher Tests
**Arquivo:** `tests/unit/bcrypt-hasher.test.ts` (7 testes)
**Arquivo:** `tests/unit/argon-hasher.test.ts` (7 testes)

#### 2.6 Middleware Tests
**Arquivo:** `tests/unit/middleware.test.ts` (9 testes)

### Critérios de Aceite FASE 2
- [ ] 67 testes unitários criados
- [ ] Todos os testes **FALHANDO** (verificar com `bun test`)
- [ ] Zero `any` types nos testes
- [ ] Mocks usados consistentemente
- [ ] Tests seguem padrão AAA (Arrange-Act-Assert)

---

## 🟠 FASE 3: Criar Testes de Integração (RED)

### Objetivo
Criar 38 testes de integração que testam colaboração entre classes.

### Características
- Testam 2-3 classes trabalhando juntas
- Usam implementações reais (não mocks) para classes principais
- Usam fakes apenas para I/O externo (DB em memória)
- Tempo: 1-10ms por teste

### Tarefas

#### 3.1 Auth Flow Tests
**Arquivo:** `tests/integration/auth-flow.test.ts` (12 testes)

```typescript
import { describe, expect, test, beforeEach } from 'bun:test';
import { AuthManager } from '@/auth-manager';
import { SessionGuard } from '@/guards/session-guard';
import { DatabaseUserProvider } from '@/providers/database-provider';
import { SessionManager } from '@ninots/session';
import { BcryptHasher } from '@/hashing/bcrypt-hasher';
import { MemoryConnection } from '@/mocks';

describe('Auth Flow - Integration', () => {
  let authManager: AuthManager;
  let connection: MemoryConnection;
  let hasher: BcryptHasher;

  beforeEach(async () => {
    // Setup real: classes reais com DB em memória
    connection = new MemoryConnection();
    hasher = new BcryptHasher();
    
    await connection.execute(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        remember_token TEXT
      )
    `);
    
    const provider = new DatabaseUserProvider(connection, hasher, 'users');
    const sessionManager = new SessionManager({ driver: 'memory' });
    
    authManager = new AuthManager();
    authManager.extend('session', () => {
      const session = sessionManager.build(sessionManager.driver());
      return new SessionGuard('web', provider, session);
    });
  });

  test('should signup new user and auto-login', async () => {
    // Insert user directly in DB
    const password = await hasher.hash('secret123');
    await connection.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      ['user@example.com', password]
    );
    
    // Try to login
    const guard = authManager.guard('session') as SessionGuard;
    const authenticated = await guard.attempt({
      email: 'user@example.com',
      password: 'secret123'
    });
    
    expect(authenticated).toBe(true);
    expect(await guard.check()).toBe(true);
  });

  test('should login with correct credentials', async () => {
    // ... 11 mais testes
  });

  // ... mais 10 testes
});
```

#### 3.2 Remember Me Tests
**Arquivo:** `tests/integration/remember-me.test.ts` (10 testes)

#### 3.3 Guard-Provider Integration
**Arquivo:** `tests/integration/guard-provider.test.ts` (8 testes)

#### 3.4 Middleware Auth Integration
**Arquivo:** `tests/integration/middleware-auth.test.ts` (8 testes)

### Critérios de Aceite FASE 3
- [ ] 38 testes de integração criados
- [ ] Todos os testes **FALHANDO** (Red Phase)
- [ ] Classes reais colaborando
- [ ] DB em memória (MemoryConnection)
- [ ] Zero mocks para classes sob teste

---

## 🟡 FASE 4: Criar Testes de Feature (RED)

### Objetivo
Criar 38 testes de feature que simulam fluxo real do usuário.

### Características
- Testam features completas do ponto de vista do usuário
- Simulam HTTP requests/responses
- Usam banco de dados fake com schema real
- Tempo: 10-50ms por teste

### Tarefas

#### 4.1 Login/Logout Feature
**Arquivo:** `tests/feature/login-logout.test.ts` (10 testes)

```typescript
import { describe, expect, test, beforeEach } from 'bun:test';
import { AuthManager } from '@/auth-manager';
import { SessionGuard } from '@/guards/session-guard';
import { DatabaseUserProvider } from '@/providers/database-provider';
import { SessionManager } from '@ninots/session';
import { BcryptHasher } from '@/hashing/bcrypt-hasher';
import { MemoryConnection } from '@/mocks';

describe('Feature: Login/Logout', () => {
  let auth: AuthManager;
  let connection: MemoryConnection;
  let hasher: BcryptHasher;

  beforeEach(async () => {
    // Setup completo de feature
    connection = new MemoryConnection();
    hasher = new BcryptHasher();
    
    // Create table with real schema
    await connection.execute(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        remember_token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const provider = new DatabaseUserProvider(connection, hasher, 'users');
    const sessionManager = new SessionManager({ driver: 'memory' });
    
    auth = new AuthManager();
    auth.extend('session', () => {
      const session = sessionManager.build(sessionManager.driver());
      return new SessionGuard('web', provider, session);
    });
  });

  test('should login with valid credentials', async () => {
    // Arrange: Create user in database
    const password = await hasher.hash('secret123');
    await connection.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      ['user@example.com', password]
    );
    
    // Act: Try to login
    const guard = auth.guard('session') as SessionGuard;
    const success = await guard.attempt({
      email: 'user@example.com',
      password: 'secret123'
    });
    
    // Assert
    expect(success).toBe(true);
    expect(await guard.check()).toBe(true);
    expect((await guard.user())?.email).toBe('user@example.com');
  });

  test('should logout and clear session', async () => {
    // ... mais 9 testes
  });

  // ... mais 8 testes
});
```

#### 4.2 Registration Feature
**Arquivo:** `tests/feature/registration.test.ts` (8 testes)

#### 4.3 Password Reset Feature
**Arquivo:** `tests/feature/password-reset.test.ts` (6 testes)

#### 4.4 Token Auth Feature
**Arquivo:** `tests/feature/token-auth.test.ts` (8 testes)

#### 4.5 Multi-Guard Feature
**Arquivo:** `tests/feature/multi-guard.test.ts` (6 testes)

### Critérios de Aceite FASE 4
- [ ] 38 testes de feature criados
- [ ] Todos os testes **FALHANDO** (Red Phase)
- [ ] Schema de DB real
- [ ] Fluxo completo do usuário
- [ ] Assertions de alto nível

---

## 🟢 FASE 5: Criar Testes E2E (RED)

### Objetivo
Criar 20 testes E2E com server HTTP real e banco de dados real.

### Características
- Testam fluxo completo com dependências reais
- HTTP server real rodando
- SQLite em arquivo (não em memória)
- Cookies reais, sessions reais
- Tempo: 50-200ms por teste

### Tarefas

#### 5.1 HTTP Auth E2E
**Arquivo:** `tests/e2e/http-auth.test.ts` (8 testes)

```typescript
import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { AuthManager } from '@/auth-manager';
import { SessionGuard } from '@/guards/session-guard';
import { DatabaseUserProvider } from '@/providers/database-provider';
import { SessionManager } from '@ninots/session';
import { BcryptHasher } from '@/hashing/bcrypt-hasher';
import { authenticate } from '@/middleware/authenticate';
import { DatabaseConnection } from '@ninots/orm';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';

describe('E2E: HTTP Authentication', () => {
  let server: Server;
  let dbPath: string;
  let connection: DatabaseConnection;
  let auth: AuthManager;

  beforeEach(async () => {
    // Setup E2E real: HTTP server + SQLite file DB
    dbPath = await mkdtemp(join(tmpdir(), 'auth-e2e-'));
    const dbFile = join(dbPath, 'test.db');
    
    connection = new DatabaseConnection(`sqlite:${dbFile}`);
    await connection.execute(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        remember_token TEXT
      )
    `);
    
    const hasher = new BcryptHasher();
    const provider = new DatabaseUserProvider(connection, hasher, 'users');
    const sessionManager = new SessionManager({ 
      driver: 'file',
      path: join(dbPath, 'sessions')
    });
    
    auth = new AuthManager();
    auth.extend('session', () => {
      const session = sessionManager.build(sessionManager.driver());
      return new SessionGuard('web', provider, session);
    });
    
    // Create real HTTP server with middleware
    const app = new Application();
    app.use(authenticate(auth));
    
    app.get('/protected', (req, res) => {
      return res.json({ user: auth.user() });
    });
    
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const guard = auth.guard('session') as SessionGuard;
      const success = await guard.attempt({ email, password });
      
      if (success) {
        return res.json({ success: true });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    });
    
    server = app.listen(0); // Random port
  });

  afterEach(async () => {
    // Cleanup
    server.close();
    await rm(dbPath, { recursive: true, force: true });
  });

  test('should protect route with authentication', async () => {
    // Test HTTP server real
    const response = await fetch(`http://localhost:${server.port}/protected`);
    
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('should allow authenticated access', async () => {
    // First create user
    const password = await new BcryptHasher().hash('secret123');
    await connection.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      ['user@example.com', password]
    );
    
    // First login
    const loginResponse = await fetch(`http://localhost:${server.port}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'secret123'
      })
    });
    
    const cookies = loginResponse.headers.get('Set-Cookie');
    
    // Then access protected route with cookies
    const protectedResponse = await fetch(`http://localhost:${server.port}/protected`, {
      headers: { Cookie: cookies! }
    });
    
    expect(protectedResponse.status).toBe(200);
    const body = await protectedResponse.json();
    expect(body.user.email).toBe('user@example.com');
  });

  // ... mais 6 testes
});
```

#### 5.2 Session Persistence E2E
**Arquivo:** `tests/e2e/session-persistence.test.ts` (6 testes)

#### 5.3 Remember Me Cookie E2E
**Arquivo:** `tests/e2e/remember-me-cookie.test.ts` (6 testes)

### Critérios de Aceite FASE 5
- [ ] 20 testes E2E criados
- [ ] Todos os testes **FALHANDO** (Red Phase)
- [ ] HTTP server real
- [ ] SQLite file DB
- [ ] Cookies reais
- [ ] Cleanup adequado (afterEach)

---

## 🟢 FASE 6: Implementação (GREEN)

### Objetivo
Implementar código mínimo para passar em TODOS os 163 testes.

### Ordem de Implementação

1. **Mocks e Fixtures** (já feitos nas Fases 1-5)
2. **Contratos** (interfaces)
3. **Implementações** (classes)
4. **Middleware** (funções)

### Tarefas

#### 6.1 Contratos
- [ ] `src/contracts/guard.ts` (Guard, StatefulGuard)
- [ ] `src/contracts/hasher.ts` (Hasher)
- [ ] `src/contracts/user-provider.ts` (UserProvider)
- [ ] `src/contracts/authenticatable.ts` (Authenticatable)

#### 6.2 Implementações Core
- [ ] `src/auth-manager.ts`
- [ ] `src/guards/session-guard.ts`
- [ ] `src/guards/token-guard.ts`
- [ ] `src/providers/database-provider.ts`
- [ ] `src/hashing/bcrypt-hasher.ts`
- [ ] `src/hashing/argon-hasher.ts`

#### 6.3 Middleware
- [ ] `src/middleware/authenticate.ts` (função)
- [ ] `src/middleware/guest.ts` (função)

### Critérios de Aceite FASE 6
- [ ] 163 testes **PASSANDO**
- [ ] 0 falhas
-  

### Objetivo
Definir a API ideal aplicando YAGNI rigorosamente.

### Tarefas
- [ ] Documentar casos de uso essenciais
- [ ] Listar breaking changes explícitos
- [ ] Definir contratos mínimos necessários
- [ ] Criar guia de migração (draft)

### Decisões de Design

#### 1. O que é ESSENCIAL (FICA)
```typescript
// Core
AuthManager.guard(name) → Guard
AuthManager.extend(name, factory) → void

// Guards
SessionGuard.attempt(credentials, remember) → boolean
SessionGuard.user() → User | null
SessionGuard.logout() → void

TokenGuard.authenticate(request) → boolean
TokenGuard.user() → User | null

// Providers
DatabaseUserProvider.retrieveById(id) → User | null
DatabaseUserProvider.retrieveByCredentials(credentials) → User | null
DatabaseUserProvider.validateCredentials(user, password) → boolean

// Hashers
BcryptHasher.hash(password) → string
BcryptHasher.verify(password, hash) → boolean
BcryptHasher.needsRehash(hash) → boolean

ArgonHasher.hash(password) → string
ArgonHasher.verify(password, hash) → boolean
ArgonHasher.needsRehash(hash) → boolean

// Middleware
authenticate(auth) → middleware function
guest(auth) → middleware function
```

#### 2. O que é REMOVIDO (YAGNI)
```typescript
❌ RequestGuard              // Sem caso de uso claro
❌ SessionConnectionInterface // Duplicado
❌ SocialUser contract        // Classe já é suficiente
❌ ProviderConfig export      // Tipo interno
❌ JwtDecoderOptions export   // Tipo interno
❌ AccessTokenResponse        // Tipo interno
❌ 15+ exports de tipos internos
```

#### 3. O que é SEPARADO (Pacotes)
```typescript
📦 Session → @ninots/session
   - Session, SessionManager
   - MemoryDriver, FileDriver, DatabaseDriver

📦 JWT → @ninots/jwt
   - JwtDecoder, JwksCache
   - JwtError, JwksError

📦 Social → @ninots/social
   - SocialManager, AbstractProvider
   - GitHubProvider, SocialUser

📦 Encryption → @ninots/encryption
   - WebEncrypter
   - EncryptException, DecryptException
```

### Entregáveis FASE 0
- [ ] `MIGRATION.md` - Guia de migração completo
- [ ] `API.md` - Documentação da nova API
- [ ] Lista de breaking changes explícita

---

## 🔴 FASE 1: Criar Testes (RED)

### Objetivo
Criar TODOS os testes antes de qualquer implementação.
Todos os testes devem **FALHAR** inicialmente (Red Phase).

### Tarefas

#### 1.1 Core Tests
**Arquivo:** `tests/unit/auth-manager.test.ts`

```typescript
describe('AuthManager', () => {
  test('should resolve default guard', () => {})
  test('should resolve named guard', () => {})
  test('should cache guard instances', () => {})
  test('should throw for unregistered guard name', () => {})
  test('should throw for unsupported driver', () => {})
  test('should extend with custom guard factory', () => {})
  test('should delegate check() to default guard', () => {})
  test('should delegate user() to default guard', () => {})
  test('should delegate id() to default guard', () => {})
})
```

**Arquivo:** `tests/integration/auth-flow.test.ts`

```typescript
describe('Auth Flow - Integration', () => {
  describe('Signup → Login → Logout', () => {
    test('should signup new user and auto-login', () => {})
    test('should login with correct credentials', () => {})
    test('should reject login with wrong password', () => {})
    test('should reject login with non-existent email', () => {})
    test('should logout and clear session', () => {})
  })
  
  describe('Remember Me', () => {
    test('should generate remember token on login', () => {})
    test('should validate user by remember token', () => {})
    test('should clear remember token on logout', () => {})
  })
})
```

#### 1.2 Guard Tests
**Arquivo:** `tests/unit/session-guard.test.ts`

```typescript
describe('SessionGuard', () => {
  test('should return true for guest when no user', () => {})
  test('should return false for check when no user', () => {})
  test('should return null user when not authenticated', () => {})
  test('should attempt login with valid credentials', () => {})
  test('should reject login with invalid password', () => {})
  test('should reject login with non-existent user', () => {})
  test('should login and set user', () => {})
  test('should login and store user id in session', () => {})
  test('should logout and clear user', () => {})
  test('should loginUsingId and retrieve user', () => {})
  test('should return false for loginUsingId with unknown id', () => {})
  test('should validate credentials without login', () => {})
  test('should cache user instance on subsequent calls', () => {})
  test('should support remember me token', () => {})
})
```

**Arquivo:** `tests/unit/token-guard.test.ts`

```typescript
describe('TokenGuard', () => {
  test('should authenticate via Bearer header', () => {})
  test('should authenticate via query parameter', () => {})
  test('should return null user without token', () => {})
  test('should return null user with invalid token', () => {})
  test('should validate token credentials', () => {})
  test('should return false for invalid token in validate', () => {})
  test('should return user id when authenticated', () => {})
  test('should return null id when not authenticated', () => {})
  test('should cache user on subsequent calls', () => {})
  test('should support custom input and storage keys', () => {})
})
```

#### 1.3 Provider Tests
**Arquivo:** `tests/unit/database-provider.test.ts`

```typescript
describe('DatabaseUserProvider', () => {
  test('should retrieve user by ID', () => {})
  test('should return null for unknown ID', () => {})
  test('should retrieve user by token', () => {})
  test('should return null for invalid token', () => {})
  test('should retrieve user by credentials (email)', () => {})
  test('should return null for non-existent credentials', () => {})
  test('should validate credentials with matching password', () => {})
  test('should reject credentials with wrong password', () => {})
  test('should update remember token on user', () => {})
  test('should expose user model class', () => {})
})
```

#### 1.4 Hasher Tests
**Arquivo:** `tests/unit/hashing.test.ts`

```typescript
describe('BcryptHasher', () => {
  test('should instantiate', () => {})
  test('should hash password', () => {})
  test('should verify correct password', () => {})
  test('should reject wrong password', () => {})
  test('should check if rehash is needed', () => {})
  test('should hash with custom rounds', () => {})
  test('should use default rounds when not specified', () => {})
})

describe('ArgonHasher', () => {
  test('should instantiate', () => {})
  test('should hash password', () => {})
  test('should verify correct password', () => {})
  test('should reject wrong password', () => {})
  test('should check if rehash is needed', () => {})
  test('should hash with custom memory and time costs', () => {})
  test('should hash with only memoryCost option', () => {})
  test('should hash with only timeCost option', () => {})
})
```

#### 1.5 Middleware Tests
**Arquivo:** `tests/integration/middleware.test.ts`

```typescript
describe('authenticate middleware', () => {
  test('should pass request when user authenticated', () => {})
  test('should return 401 for unauthenticated JSON request', () => {})
  test('should return 401 text for unauthenticated non-JSON', () => {})
  test('should work as route guard', () => {})
})

describe('guest middleware', () => {
  test('should pass request when user is guest', () => {})
  test('should redirect when user authenticated', () => {})
})
```

### Critérios de Aceite FASE 1
- [ ] 14 arquivos de teste criados
- [ ] 80+ testes escritos
- [ ] Todos os testes **FALHANDO** (verificar com `bun test`)
- [ ] Zero `any` types nos testes
- [ ] Tests seguem padrões consistentes

### Riscos
- **Risco:** Escrever testes sem implementação pode levar a testes incorretos
- **Mitigação:** Revisar testes em pares, garantir que testam comportamento real

---

## 🟢 FASE 2: Implementação Mínima (GREEN)

### Objetivo
Implementar APENAS o necessário para passar em todos os testes.
Cada implementação deve ser a mais simples possível (KISS).

### Tarefas

#### 2.1 Core Implementation
**Arquivo:** `src/auth-manager.ts`

```typescript
interface GuardFactory {
  (name: string): Guard;
}

export class AuthManager {
  private guards: Map<string, Guard> = new Map();
  private factories: Map<string, GuardFactory> = new Map();
  private defaultGuardName: string = 'session';

  guard(name?: string): Guard {
    const guardName = name || this.defaultGuardName;
    
    if (!this.factories.has(guardName)) {
      throw new Error(`Guard "${guardName}" not registered`);
    }
    
    if (!this.guards.has(guardName)) {
      const factory = this.factories.get(guardName)!;
      this.guards.set(guardName, factory(guardName));
    }
    
    return this.guards.get(guardName)!;
  }

  extend(name: string, factory: GuardFactory): void {
    this.factories.set(name, factory);
  }

  // Delegate methods
  async check(): Promise<boolean> {
    return await this.guard().check();
  }

  async user(): Promise<Authenticatable | null> {
    return await this.guard().user();
  }

  async id(): Promise<string | number | null> {
    return await this.guard().id();
  }
}
```

#### 2.2 Guards Implementation
**Arquivo:** `src/guards/session-guard.ts`

```typescript
export class SessionGuard implements StatefulGuard {
  private userInstance: Authenticatable | null = null;
  private userHasRetrieved: boolean = false;

  constructor(
    private name: string,
    private provider: UserProvider,
    private session: SessionInterface
  ) {}

  async check(): Promise<boolean> {
    return !this.guest();
  }

  guest(): boolean {
    if (this.userHasRetrieved) {
      return this.userInstance === null;
    }

    const id = this.session.get(`${this.name}_login`);
    
    if (id === null) {
      this.userHasRetrieved = true;
      this.userInstance = null;
      return true;
    }

    return false;
  }

  async user(): Promise<Authenticatable | null> {
    if (this.userHasRetrieved) {
      return this.userInstance;
    }

    const id = this.session.get(`${this.name}_login`);
    
    if (!id) {
      this.userHasRetrieved = true;
      this.userInstance = null;
      return null;
    }

    this.userInstance = await this.provider.retrieveById(id);
    this.userHasRetrieved = true;

    return this.userInstance;
  }

  async attempt(credentials: Credentials, remember: boolean = false): Promise<boolean> {
    const user = await this.provider.retrieveByCredentials(credentials);
    
    if (!user) {
      return false;
    }

    const valid = await this.provider.validateCredentials(user, credentials.password);
    
    if (!valid) {
      return false;
    }

    await this.login(user, remember);
    return true;
  }

  async login(user: Authenticatable, remember: boolean = false): Promise<void> {
    this.userInstance = user;
    this.userHasRetrieved = true;
    
    this.session.put(`${this.name}_login`, user.getId());
    
    if (remember) {
      const token = crypto.randomUUID();
      await this.provider.updateRememberToken(user, token);
      // Cookie handling would go here
    }
    
    await this.session.save();
  }

  async logout(): Promise<void> {
    this.userInstance = null;
    this.userHasRetrieved = false;
    
    this.session.forget(`${this.name}_login`);
    await this.session.save();
  }

  // ... more methods as needed by tests
}
```

**Arquivo:** `src/guards/token-guard.ts`

```typescript
export class TokenGuard implements Guard {
  private userInstance: Authenticatable | null = null;
  private userHasRetrieved: boolean = false;

  constructor(
    private provider: UserProvider,
    private request: Request,
    private inputKey: string = 'token',
    private storageKey: string = 'token'
  ) {}

  async check(): Promise<boolean> {
    return !this.guest();
  }

  guest(): boolean {
    const token = this.getTokenFromRequest();
    
    if (!token) {
      return true;
    }

    const user = this.provider.retrieveByToken(token);
    return user === null;
  }

  async user(): Promise<Authenticatable | null> {
    if (this.userHasRetrieved) {
      return this.userInstance;
    }

    const token = this.getTokenFromRequest();
    
    if (!token) {
      this.userHasRetrieved = true;
      this.userInstance = null;
      return null;
    }

    this.userInstance = await this.provider.retrieveByToken(token);
    this.userHasRetrieved = true;

    return this.userInstance;
  }

  private getTokenFromRequest(): string | null {
    // Check query param first
    const url = new URL(this.request.url);
    const queryToken = url.searchParams.get(this.inputKey);
    
    if (queryToken) {
      return queryToken;
    }

    // Check Authorization header
    const authHeader = this.request.headers.get('Authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
```

#### 2.3 Provider Implementation
**Arquivo:** `src/providers/database-provider.ts`

```typescript
export class DatabaseUserProvider implements UserProvider {
  constructor(
    private connection: ConnectionInterface,
    private hasher: Hasher,
    private table: string = 'users',
    private userModel: new (data: Record<string, unknown>) => Authenticatable = GenericUser
  ) {}

  async retrieveById(id: string | number): Promise<Authenticatable | null> {
    const results = await this.connection.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );

    if (results.length === 0) {
      return null;
    }

    return new this.userModel(results[0] as Record<string, unknown>);
  }

  async retrieveByToken(id: string | number, token: string): Promise<Authenticatable | null> {
    const results = await this.connection.query(
      `SELECT * FROM ${this.table} WHERE id = ? AND remember_token = ?`,
      [id, token]
    );

    if (results.length === 0) {
      return null;
    }

    return new this.userModel(results[0] as Record<string, unknown>);
  }

  async retrieveByCredentials(credentials: Credentials): Promise<Authenticatable | null> {
    const criteria: string[] = [];
    const params: unknown[] = [];

    // Build dynamic query based on credentials
    for (const [key, value] of Object.entries(credentials)) {
      if (key !== 'password') {
        criteria.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (criteria.length === 0) {
      return null;
    }

    const sql = `SELECT * FROM ${this.table} WHERE ${criteria.join(' AND ')} LIMIT 1`;
    const results = await this.connection.query(sql, params);

    if (results.length === 0) {
      return null;
    }

    return new this.userModel(results[0] as Record<string, unknown>);
  }

  async validateCredentials(user: Authenticatable, password: string): Promise<boolean> {
    const hash = user.getPassword?.();
    
    if (!hash) {
      return false;
    }

    return await this.hasher.verify(password, hash as string);
  }

  async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
    await this.connection.query(
      `UPDATE ${this.table} SET remember_token = ? WHERE id = ?`,
      [token, user.getId()]
    );
  }
}

export class GenericUser implements Authenticatable {
  constructor(private attributes: Record<string, unknown>) {}

  getId(): string | number {
    return this.attributes['id'] as string | number;
  }

  getName(): string | null {
    return (this.attributes['name'] as string) || null;
  }

  getEmail(): string | null {
    return (this.attributes['email'] as string) || null;
  }

  getPassword(): string | null {
    return (this.attributes['password'] as string) || null;
  }

  getRememberToken(): string | null {
    return (this.attributes['remember_token'] as string) || null;
  }
}
```

#### 2.4 Hasher Implementation
**Arquivo:** `src/hashing/bcrypt-hasher.ts`

```typescript
export class BcryptHasher implements Hasher {
  constructor(private rounds: number = 10) {}

  async hash(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: this.rounds,
    });
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }

  async needsRehash(hash: string): Promise<boolean> {
    // Bun.password uses bcrypt by default
    // Check if hash uses different algorithm or cost
    const parts = hash.split('$');
    
    if (parts.length !== 4) {
      return true;
    }

    const cost = parseInt(parts[2], 10);
    return cost !== this.rounds;
  }
}
```

**Arquivo:** `src/hashing/argon-hasher.ts`

```typescript
export class ArgonHasher implements Hasher {
  constructor(
    private memoryCost: number = 65536,
    private timeCost: number = 3,
    private parallelism: number = 4
  ) {}

  async hash(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: 'argon2id',
      memoryCost: this.memoryCost,
      timeCost: this.timeCost,
      parallelism: this.parallelism,
    });
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }

  async needsRehash(hash: string): Promise<boolean> {
    // Argon2 hash format: $argon2id$v=19$m=65536,t=3,p=4$...
    const parts = hash.split('$');
    
    if (parts.length < 5) {
      return true;
    }

    const params = parts[3];
    const match = params.match(/m=(\d+),t=(\d+),p=(\d+)/);
    
    if (!match) {
      return true;
    }

    const [, memory, time, parallelism] = match.map(Number);
    
    return (
      memory !== this.memoryCost ||
      time !== this.timeCost ||
      parallelism !== this.parallelism
    );
  }
}
```

#### 2.5 Middleware Implementation
**Arquivo:** `src/middleware/authenticate.ts`

```typescript
import type { AuthManager } from '../auth-manager';

export function authenticate(auth: AuthManager) {
  return async (
    request: Request,
    next: (req: Request) => Promise<Response>
  ): Promise<Response> => {
    const authenticated = await auth.check();
    
    if (!authenticated) {
      const accept = request.headers.get('Accept') || '';
      
      if (accept.includes('application/json')) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response('Unauthorized', { status: 401 });
    }

    return await next(request);
  };
}
```

**Arquivo:** `src/middleware/guest.ts`

```typescript
import type { AuthManager } from '../auth-manager';

export function guest(auth: AuthManager) {
  return async (
    request: Request,
    next: (req: Request) => Promise<Response>
  ): Promise<Response> => {
    const authenticated = await auth.check();
    
    if (authenticated) {
      const url = new URL(request.url);
      const redirectUrl = url.searchParams.get('redirect') || '/home';
      
      return Response.redirect(redirectUrl, 302);
    }

    return await next(request);
  };
}
```

#### 2.6 Contracts
**Arquivo:** `src/contracts/guard.ts`

```typescript
import type { Authenticatable } from './authenticatable';

export interface Guard {
  check(): Promise<boolean>;
  guest(): boolean;
  user(): Promise<Authenticatable | null>;
  id(): Promise<string | number | null>;
}

export interface StatefulGuard extends Guard {
  login(user: Authenticatable, remember?: boolean): Promise<void>;
  logout(): Promise<void>;
  attempt(credentials: Credentials, remember?: boolean): Promise<boolean>;
  validate(credentials: Credentials): Promise<boolean>;
}

export interface Credentials {
  [key: string]: unknown;
  password?: string;
}
```

### Critérios de Aceite FASE 2
- [ ] Todos os 80+ testes **PASSANDO**
- [ ] Zero `bun test` failures
- [ ] Implementação mínima (KISS)
- [ ] Zero `any` types
- [ ] Code coverage >90%

---

## 🟡 FASE 3: Refatoração SOLID (REFACTOR)

### Objetivo
Aplicar princípios SOLID rigorosamente após os testes estarem verdes.

### Tarefas

#### 3.1 Single Responsibility Principle (SRP)
**Verificar:**
- [ ] `AuthManager` apenas gerencia guards (não faz auth)
- [ ] `SessionGuard` apenas gerencia sessão (não hash)
- [ ] `DatabaseUserProvider` apenas busca usuários (não valida)
- [ ] `Hasher` apenas faz hash/verify (não armazena)
- [ ] `Middleware` apenas intercepta requests (não autentica)

#### 3.2 Open/Closed Principle (OCP)
**Verificar:**
- [ ] Guards extensíveis via `AuthManager.extend()`
- [ ] Hashers extensíveis via interface `Hasher`
- [ ] Providers extensíveis via interface `UserProvider`
- [ ] Middleware extensível via factory functions

#### 3.3 Liskov Substitution Principle (LSP)
**Verificar:**
- [ ] `SessionGuard` substitui `StatefulGuard`
- [ ] `TokenGuard` substitui `Guard`
- [ ] `BcryptHasher` substitui `Hasher`
- [ ] `ArgonHasher` substitui `Hasher`

#### 3.4 Interface Segregation Principle (ISP)
**Verificar:**
- [ ] `Guard` interface pequena (4 métodos)
- [ ] `StatefulGuard` estende `Guard` (métodos stateful)
- [ ] `Hasher` interface mínima (3 métodos)
- [ ] `UserProvider` interface focada (5 métodos)

#### 3.5 Dependency Inversion Principle (DIP)
**Verificar:**
- [ ] Guards recebem `UserProvider` via constructor
- [ ] Guards recebem `Session` via constructor
- [ ] `AuthManager` recebe factories, não cria diretamente
- [ ] Middleware recebe `AuthManager`, não cria

### Critérios de Aceite FASE 3
- [ ] Checklist SOLID completo
- [ ] Todos testes ainda passando
- [ ] Zero regressões
- [ ] Code review focado em princípios

---

## 🟢 FASE 4: Aplicar KISS/YAGNI/DRY

### Objetivo
Simplificar ao máximo, remover desnecessários, consolidar duplicações.

### Tarefas

#### 4.1 KISS (Keep It Simple, Stupid)
**Ações:**
- [ ] Middleware como funções (não classes)
- [ ] Configuração mínima necessária
- [ ] Zero magic strings
- [ ] Error messages claras e diretas

**Verificar:**
```typescript
// ❌ Complexo (antes)
export class Authenticate {
  constructor(private auth: AuthManager) {}
  async handle(request, next) { ... }
}

// ✅ Simples (depois)
export function authenticate(auth: AuthManager) {
  return async (request, next) => { ... };
}
```

#### 4.2 YAGNI (You Ain't Gonna Need It)
**Remover:**
- [ ] `RequestGuard` (sem caso de uso)
- [ ] Tipos internos dos exports (`ProviderConfig`, `AccessTokenResponse`)
- [ ] `SessionConnectionInterface` duplicado
- [ ] Contratos `SocialUser` e `SocialProvider` (movidos para pacote social)
- [ ] Qualquer feature não testada

**Index.ts antes (43 exports):**
```typescript
export { RequestGuard } from './src/guards/request-guard'; // ❌
export type { ProviderConfig } from './src/social/abstract-provider'; // ❌
export type { AccessTokenResponse } from './src/social/abstract-provider'; // ❌
// ... 40+ exports
```

**Index.ts depois (~18 exports):**
```typescript
// Core
export { AuthManager } from './src/auth-manager';
export type { GuardFactory } from './src/auth-manager';

// Guards
export { SessionGuard } from './src/guards/session-guard';
export { TokenGuard } from './src/guards/token-guard';

// Providers
export { DatabaseUserProvider, GenericUser } from './src/providers/database-provider';

// Hashers
export { BcryptHasher } from './src/hashing/bcrypt-hasher';
export { ArgonHasher } from './src/hashing/argon-hasher';

// Middleware
export { authenticate } from './src/middleware/authenticate';
export { guest } from './src/middleware/guest';

// Contracts
export type { Guard, StatefulGuard } from './src/contracts/guard';
export type { Hasher } from './src/contracts/hasher';
export type { UserProvider } from './src/contracts/user-provider';
export type { Authenticatable } from './src/contracts/authenticatable';
export type { Credentials } from './src/contracts/guard';
```

#### 4.3 DRY (Don't Repeat Yourself)
**Consolidar:**
- [ ] Unificar `ConnectionInterface` e `SessionConnectionInterface`
- [ ] Remover duplicação de tipos em contracts
- [ ] Shared test utilities no `setup.ts`
- [ ] Error handling consistente

### Critérios de Aceite FASE 4
- [ ] Exports reduzidos de 43 para ~18 (-58%)
- [ ] LOC reduzido em 30-40%
- [ ] Zero duplicações detectadas por linter
- [ ] Todos testes passando
- [ ] README atualizado com nova API

---

## ⚪ FASE 5: Separar Pacotes (OPCIONAL)

### Objetivo
Isolar sub-módulos em pacotes independentes para apps que não precisam de tudo.

### Tarefas

#### 5.1 @ninots/session
**Extrair de auth:**
```
framework/packages/session/
├── index.ts
├── src/
│   ├── session.ts
│   ├── session-manager.ts
│   ├── types.ts
│   ├── contracts/
│   │   └── session-driver.ts
│   └── drivers/
│       ├── memory-driver.ts
│       ├── file-driver.ts
│       └── database-driver.ts
└── tests/
```

**Dependencies:** Zero (Bun native apenas)

#### 5.2 @ninots/jwt
**Extrair de auth:**
```
framework/packages/jwt/
├── index.ts
├── src/
│   ├── jwt-decoder.ts
│   ├── jwks-cache.ts
│   ├── errors.ts
│   └── types.ts
└── tests/
```

**Dependencies:** Zero (Bun native + Web Crypto)

#### 5.3 @ninots/social
**Extrair de auth:**
```
framework/packages/social/
├── index.ts
├── src/
│   ├── social-manager.ts
│   ├── abstract-provider.ts
│   ├── social-user.ts
│   ├── contracts/
│   │   └── provider.ts
│   └── providers/
│       └── github-provider.ts
└── tests/
```

**Dependencies:** `@ninots/jwt` (para OIDC)

#### 5.4 @ninots/encryption
**Extrair de auth:**
```
framework/packages/encryption/
├── index.ts
├── src/
│   ├── encrypter.ts
│   ├── exceptions.ts
│   └── contracts/
│       └── encryption.ts
└── tests/
```

**Dependencies:** Zero (Bun native Web Crypto)

### Critérios de Aceite FASE 5
- [ ] 4 pacotes criados e independentes
- [ ] Cada pacote com 100% testes
- [ ] Zero cross-package imports
- [ ] `@ninots/auth` importa pacotes separados como dependências
- [ ] Docs de migração para cada pacote

---

## ✅ Validação por Fase

### Comandos de Validação

```bash
# Após FASE 1 (Testes RED)
cd framework
bun test packages/auth
# Esperado: TODOS FALHANDO

# Após FASE 2 (Implementação GREEN)
bun test packages/auth
# Esperado: 80+ pass, 0 fail

bun run verify:no-any
# Esperado: Zero any types

bun run type-check
# Esperado: Zero TypeScript errors

bun run lint
# Esperado: Zero lint errors

# Após FASE 3-4 (Refatoração)
bun test packages/auth --coverage
# Esperado: >90% coverage

# Após FASE 5 (Separação)
bun test packages/auth packages/session packages/jwt packages/social packages/encryption
# Esperado: Todos passando
```

### Métricas de Sucesso

| Fase | Métrica | Target |
|------|---------|--------|
| FASE 1 | Testes criados | 80+ |
| FASE 2 | Testes passando | 100% |
| FASE 3 | Princípios SOLID | 100% aplicados |
| FASE 4 | Exports no index.ts | ~18 (-58%) |
| FASE 4 | LOC reduzido | -30-40% |
| FASE 5 | Pacotes separados | 4 |

---

## ⚠️ Breaking Changes

### Migração Necessária

#### Antes (v0.0.x)
```typescript
import { SessionManager } from '@ninots/session';
import { JwtDecoder } from '@ninots/jwt';
import { SocialManager } from '@ninots/social';
import { RequestGuard } from '@ninots/auth';

export class Authenticate {
  constructor(private auth: AuthManager) {}
  async handle(request, next) { ... }
}
```

#### Depois (v1.0.0)
```typescript
import { SessionGuard, authenticate } from '@ninots/auth';
import { SessionManager } from '@ninots/session'; // pacote separado
import { JwtDecoder } from '@ninots/jwt';         // pacote separado
import { SocialManager } from '@ninots/social';   // pacote separado

// RequestGuard removido
// Authenticate class → function authenticate()

export const authMiddleware = authenticate(auth);
```

---

## 📅 Timeline Estimada

| Fase | Duração | Dependências |
|------|---------|--------------|
| FASE 0 | 1-2h | Nenhuma |
| FASE 1 | 4-6h | FASE 0 completa |
| FASE 2 | 6-8h | FASE 1 completa |
| FASE 3 | 3-4h | FASE 2 completa |
| FASE 4 | 2-3h | FASE 3 completa |
| FASE 5 | 8-12h | FASE 4 completa (opcional) |

**Total:** 24-35 horas (3-5 dias úteis)

---

## 🚀 Decisão Necessária

**Aprovar este plano para execução?**

Opções:
1. ✅ **Executar tudo** (FASE 0-5)
2. ✅ **Executar core** (FASE 0-4, pular separação de pacotes)
3. ⚙️ **Ajustar escopo** (remover/adicionar tarefas específicas)
4. 🎯 **Começar por FASE 0** e revisar após cada fase
