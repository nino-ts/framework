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
    active: true,
    age: 30,
    createdAt: "2024-01-01T00:00:00Z",
    email: "john.doe@example.com",
    id: 1,
    name: "John Doe",
    roles: ["user"],
};

/**
 * Usuário inválido para testes (múltiplos erros).
 */
export const invalidUser = {
    active: "not-boolean",
    age: -5,
    createdAt: "not-a-date",
    email: "invalid-email",
    id: "not-a-number",
    name: "",
    roles: "not-array",
};

/**
 * Usuário com dados faltantes.
 */
export const incompleteUser = {
    id: 1,
    name: "John",
    // email missing
    // age missing
};

/**
 * Usuário admin para testes.
 */
export const adminUser = {
    active: true,
    age: 35,
    createdAt: "2023-01-01T00:00:00Z",
    email: "admin@example.com",
    id: 2,
    name: "Admin User",
    roles: ["admin", "user"],
};

/**
 * Array de usuários válidos.
 */
export const validUsers = [validUser, adminUser];

/**
 * Dados de registro válidos.
 */
export const validRegistration = {
    email: "newuser@example.com",
    name: "New User",
    password: "SecurePass123!",
    password_confirmation: "SecurePass123!",
    terms: true,
};

/**
 * Dados de registro inválidos.
 */
export const invalidRegistration = {
    email: "invalid",
    name: "",
    password: "123",
    password_confirmation: "different",
    terms: false,
};

/**
 * Dados de profile update válidos.
 */
export const validProfileUpdate = {
    bio: "Developer",
    email: "updated@example.com",
    name: "Updated Name",
    website: "https://example.com",
};

/**
 * Dados de profile update inválidos.
 */
export const invalidProfileUpdate = {
    bio: "",
    email: "not-email",
    name: "",
    website: "not-url",
};
