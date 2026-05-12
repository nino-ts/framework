/**
 * Fixtures de Dados de Validação Genéricos.
 *
 * @packageDocumentation
 * Dados de teste reutilizáveis para diversos cenários de validação.
 */

// ============================================
// Strings
// ============================================

/**
 * Strings válidas genéricas.
 */
export const validStrings = {
    emoji: "Hello 👋 World 🌍",
    long: "a".repeat(1000),
    nonEmpty: "hello world",
    unicode: "你好世界",
    withSpaces: "  trimmed  ",
    withSpecialChars: "hello@world!",
};

/**
 * Strings inválidas genéricas.
 */
export const invalidStrings = {
    empty: "",
    null: null,
    onlySpaces: "   ",
    undefined: undefined,
};

// ============================================
// Emails
// ============================================

/**
 * Emails válidos para testes.
 */
export const validEmails = [
    "simple@example.com",
    "user.name@domain.org",
    "user+tag@subdomain.example.co.uk",
    "test123@test.io",
    "admin@localhost",
    "first.last@company.com",
];

/**
 * Emails inválidos para testes.
 */
export const invalidEmails = [
    "",
    "invalid",
    "invalid@",
    "@example.com",
    "test@",
    "test @example.com",
    "test@example",
    "test..test@example.com",
    "test@example.c",
];

// ============================================
// URLs
// ============================================

/**
 * URLs válidas para testes.
 */
export const validUrls = [
    "https://example.com",
    "http://localhost:3000",
    "https://subdomain.example.co.uk/path?query=value#hash",
    "ftp://files.example.com",
    "https://example.com:8080",
];

/**
 * URLs inválidas para testes.
 */
export const invalidUrls = ["", "not-a-url", "example.com", "www.example.com", "https://", "http://"];

// ============================================
// UUIDs
// ============================================

/**
 * UUIDs válidos para testes.
 */
export const validUuids = [
    "550e8400-e29b-41d4-a716-446655440000",
    "123e4567-e89b-12d3-a456-426614174000",
    "00000000-0000-0000-0000-000000000000",
    "ffffffff-ffff-ffff-ffff-ffffffffffff",
    "550E8400-E29B-41D4-A716-446655440000", // uppercase
];

/**
 * UUIDs inválidos para testes.
 */
export const invalidUuids = [
    "",
    "not-a-uuid",
    "550e8400-e29b-41d4-a716",
    "invalid-uuid-format",
    "550e8400e29b41d4a716446655440000", // no dashes
    "550e8400-e29b-41d4-a716-44665544000g", // invalid char
];

// ============================================
// Números
// ============================================

/**
 * Números válidos para testes.
 */
export const validNumbers = {
    float: Math.PI,
    large: Number.MAX_SAFE_INTEGER,
    negative: -50,
    positive: 100,
    scientific: 1e10,
    small: Number.MIN_SAFE_INTEGER,
    zero: 0,
};

/**
 * Números inválidos para testes.
 */
export const invalidNumbers = {
    array: [],
    infinity: Infinity,
    nan: NaN,
    negativeInfinity: -Infinity,
    null: null,
    object: {},
    string: "not-a-number",
    undefined: undefined,
};

// ============================================
// Arrays
// ============================================

/**
 * Arrays válidos para testes.
 */
export const validArrays = {
    empty: [],
    mixed: [1, "two", true, null],
    multipleItems: [1, 2, 3, 4, 5],
    nested: [
        [1, 2],
        [3, 4],
    ],
    objects: [{ id: 1 }, { id: 2 }],
    singleItem: [1],
};

/**
 * Arrays inválidos para testes.
 */
export const invalidArrays = {
    null: null,
    number: 123,
    object: { 0: "a", 1: "b" },
    string: "not-array",
    undefined: undefined,
};

// ============================================
// Datas
// ============================================

/**
 * Datas válidas para testes.
 */
export const validDates = {
    iso: "2024-06-15T10:30:00Z",
    now: new Date(),
    string: "2024-01-01",
    timestamp: 1704067200000,
};

/**
 * Datas inválidas para testes.
 */
export const invalidDates = {
    empty: "",
    invalidDay: "2024-02-30",
    invalidMonth: "2024-13-01",
    invalidString: "not-a-date",
    null: null,
    undefined: undefined,
};

// ============================================
// Booleans
// ============================================

/**
 * Booleans válidos para testes.
 */
export const validBooleans = {
    false: false,
    true: true,
};

/**
 * Booleans inválidos para testes.
 */
export const invalidBooleans = {
    array: [],
    null: null,
    number: 1,
    object: {},
    string: "true",
    undefined: undefined,
};

// ============================================
// Objetos
// ============================================

/**
 * Objetos válidos para testes.
 */
export const validObjects = {
    array: [1, 2, 3],
    empty: {},
    nested: { outer: { inner: "value" } },
    simple: { key: "value" },
};

/**
 * Objetos inválidos para testes.
 */
export const invalidObjects = {
    null: null,
    number: 123,
    string: "not-object",
    undefined: undefined,
};

// ============================================
// IPs
// ============================================

/**
 * IPs válidos para testes.
 */
export const validIps = {
    ipv4: ["192.168.1.1", "10.0.0.1", "255.255.255.255", "0.0.0.0"],
    ipv6: ["::1", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::1"],
};

/**
 * IPs inválidos para testes.
 */
export const invalidIps = ["", "256.256.256.256", "192.168.1", "192.168.1.1.1", "invalid", "2001:db8:::1"];

// ============================================
// Phones
// ============================================

/**
 * Phones válidos para testes (formato BR).
 */
export const validPhones = ["(11) 99999-9999", "11999999999", "+55 11 99999-9999", "5511999999999", "(21) 8888-8888"];

/**
 * Phones inválidos para testes.
 */
export const invalidPhones = [
    "",
    "123",
    "not-a-phone",
    "(11) 9999-999",
    "1199999999", // 9 digits
];

// ============================================
// CPF/CNPJ
// ============================================

/**
 * CPFs válidos para testes.
 */
export const validCpfs = ["123.456.789-09", "12345678909", "529.982.247-25"];

/**
 * CPFs inválidos para testes.
 */
export const invalidCpfs = ["", "123.456.789-00", "000.000.000-00", "111.111.111-11", "123456789"];

/**
 * CNPJs válidos para testes.
 */
export const validCnpjs = ["12.345.678/0001-90", "12345678000190"];

/**
 * CNPJs inválidos para testes.
 */
export const invalidCnpjs = ["", "12.345.678/0001-00", "00.000.000/0001-00", "12345678"];

// ============================================
// Passwords
// ============================================

/**
 * Senhas válidas para testes.
 */
export const validPasswords = {
    long: "aB1".repeat(20),
    strong: "SecurePass123!",
    withSymbols: "P@ssw0rd!",
};

/**
 * Senhas inválidas para testes.
 */
export const invalidPasswords = {
    empty: "",
    noLowercase: "PASSWORD123!",
    noNumbers: "Password!",
    noSymbols: "Password123",
    noUppercase: "password123!",
    onlyLetters: "password",
    onlyNumbers: "12345678",
    short: "123",
};

// ============================================
// Files (mock)
// ============================================

/**
 * File mock válido para testes.
 */
export const validFile = {
    lastModified: Date.now(),
    name: "image.jpg",
    size: 1024 * 500, // 500KB
    type: "image/jpeg",
};

/**
 * File mock inválido para testes.
 */
export const invalidFile = {
    name: "",
    size: 0,
    type: "invalid/type",
};

// ============================================
// Timezones
// ============================================

/**
 * Timezones válidos para testes.
 */
export const validTimezones = ["UTC", "America/Sao_Paulo", "America/New_York", "Europe/London", "Asia/Tokyo"];

/**
 * Timezones inválidos para testes.
 */
export const invalidTimezones = ["", "Invalid/Timezone", "UTC+1", "GMT"];
