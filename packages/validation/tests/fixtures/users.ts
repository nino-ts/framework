/**
 * Fixtures de Usuários para Testes.
 *
 * @packageDocumentation
 * Dados de teste reutilizáveis para cenários de validação de usuário.
 */

/**
 * Usuário válido para testes.
 */
export const validUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 30,
  active: true,
  roles: ['user'],
  createdAt: '2024-01-01T00:00:00Z',
};

/**
 * Usuário inválido para testes (múltiplos erros).
 */
export const invalidUser = {
  id: 'not-a-number',
  name: '',
  email: 'invalid-email',
  age: -5,
  active: 'not-boolean',
  roles: 'not-array',
  createdAt: 'not-a-date',
};

/**
 * Usuário com dados faltantes.
 */
export const incompleteUser = {
  id: 1,
  name: 'John',
  // email missing
  // age missing
};

/**
 * Usuário admin para testes.
 */
export const adminUser = {
  id: 2,
  name: 'Admin User',
  email: 'admin@example.com',
  age: 35,
  active: true,
  roles: ['admin', 'user'],
  createdAt: '2023-01-01T00:00:00Z',
};

/**
 * Array de usuários válidos.
 */
export const validUsers = [validUser, adminUser];

/**
 * Dados de registro válidos.
 */
export const validRegistration = {
  name: 'New User',
  email: 'newuser@example.com',
  password: 'SecurePass123!',
  password_confirmation: 'SecurePass123!',
  terms: true,
};

/**
 * Dados de registro inválidos.
 */
export const invalidRegistration = {
  name: '',
  email: 'invalid',
  password: '123',
  password_confirmation: 'different',
  terms: false,
};

/**
 * Dados de profile update válidos.
 */
export const validProfileUpdate = {
  name: 'Updated Name',
  email: 'updated@example.com',
  bio: 'Developer',
  website: 'https://example.com',
};

/**
 * Dados de profile update inválidos.
 */
export const invalidProfileUpdate = {
  name: '',
  email: 'not-email',
  bio: '',
  website: 'not-url',
};
