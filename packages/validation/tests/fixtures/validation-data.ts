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
  nonEmpty: 'hello world',
  withSpaces: '  trimmed  ',
  withSpecialChars: 'hello@world!',
  unicode: '你好世界',
  emoji: 'Hello 👋 World 🌍',
  long: 'a'.repeat(1000),
};

/**
 * Strings inválidas genéricas.
 */
export const invalidStrings = {
  empty: '',
  onlySpaces: '   ',
  null: null,
  undefined: undefined,
};

// ============================================
// Emails
// ============================================

/**
 * Emails válidos para testes.
 */
export const validEmails = [
  'simple@example.com',
  'user.name@domain.org',
  'user+tag@subdomain.example.co.uk',
  'test123@test.io',
  'admin@localhost',
  'first.last@company.com',
];

/**
 * Emails inválidos para testes.
 */
export const invalidEmails = [
  '',
  'invalid',
  'invalid@',
  '@example.com',
  'test@',
  'test @example.com',
  'test@example',
  'test..test@example.com',
  'test@example.c',
];

// ============================================
// URLs
// ============================================

/**
 * URLs válidas para testes.
 */
export const validUrls = [
  'https://example.com',
  'http://localhost:3000',
  'https://subdomain.example.co.uk/path?query=value#hash',
  'ftp://files.example.com',
  'https://example.com:8080',
];

/**
 * URLs inválidas para testes.
 */
export const invalidUrls = [
  '',
  'not-a-url',
  'example.com',
  'www.example.com',
  'https://',
  'http://',
];

// ============================================
// UUIDs
// ============================================

/**
 * UUIDs válidos para testes.
 */
export const validUuids = [
  '550e8400-e29b-41d4-a716-446655440000',
  '123e4567-e89b-12d3-a456-426614174000',
  '00000000-0000-0000-0000-000000000000',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '550E8400-E29B-41D4-A716-446655440000', // uppercase
];

/**
 * UUIDs inválidos para testes.
 */
export const invalidUuids = [
  '',
  'not-a-uuid',
  '550e8400-e29b-41d4-a716',
  'invalid-uuid-format',
  '550e8400e29b41d4a716446655440000', // no dashes
  '550e8400-e29b-41d4-a716-44665544000g', // invalid char
];

// ============================================
// Números
// ============================================

/**
 * Números válidos para testes.
 */
export const validNumbers = {
  zero: 0,
  positive: 100,
  negative: -50,
  float: 3.14159,
  large: Number.MAX_SAFE_INTEGER,
  small: Number.MIN_SAFE_INTEGER,
  scientific: 1e10,
};

/**
 * Números inválidos para testes.
 */
export const invalidNumbers = {
  nan: NaN,
  infinity: Infinity,
  negativeInfinity: -Infinity,
  string: 'not-a-number',
  object: {},
  array: [],
  null: null,
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
  singleItem: [1],
  multipleItems: [1, 2, 3, 4, 5],
  mixed: [1, 'two', true, null],
  nested: [[1, 2], [3, 4]],
  objects: [{ id: 1 }, { id: 2 }],
};

/**
 * Arrays inválidos para testes.
 */
export const invalidArrays = {
  string: 'not-array',
  number: 123,
  object: { 0: 'a', 1: 'b' },
  null: null,
  undefined: undefined,
};

// ============================================
// Datas
// ============================================

/**
 * Datas válidas para testes.
 */
export const validDates = {
  now: new Date(),
  string: '2024-01-01',
  iso: '2024-06-15T10:30:00Z',
  timestamp: 1704067200000,
};

/**
 * Datas inválidas para testes.
 */
export const invalidDates = {
  invalidString: 'not-a-date',
  invalidMonth: '2024-13-01',
  invalidDay: '2024-02-30',
  empty: '',
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
  true: true,
  false: false,
};

/**
 * Booleans inválidos para testes.
 */
export const invalidBooleans = {
  number: 1,
  string: 'true',
  object: {},
  array: [],
  null: null,
  undefined: undefined,
};

// ============================================
// Objetos
// ============================================

/**
 * Objetos válidos para testes.
 */
export const validObjects = {
  empty: {},
  simple: { key: 'value' },
  nested: { outer: { inner: 'value' } },
  array: [1, 2, 3],
};

/**
 * Objetos inválidos para testes.
 */
export const invalidObjects = {
  string: 'not-object',
  number: 123,
  null: null,
  undefined: undefined,
};

// ============================================
// IPs
// ============================================

/**
 * IPs válidos para testes.
 */
export const validIps = {
  ipv4: ['192.168.1.1', '10.0.0.1', '255.255.255.255', '0.0.0.0'],
  ipv6: ['::1', '2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'fe80::1'],
};

/**
 * IPs inválidos para testes.
 */
export const invalidIps = [
  '',
  '256.256.256.256',
  '192.168.1',
  '192.168.1.1.1',
  'invalid',
  '2001:db8:::1',
];

// ============================================
// Phones
// ============================================

/**
 * Phones válidos para testes (formato BR).
 */
export const validPhones = [
  '(11) 99999-9999',
  '11999999999',
  '+55 11 99999-9999',
  '5511999999999',
  '(21) 8888-8888',
];

/**
 * Phones inválidos para testes.
 */
export const invalidPhones = [
  '',
  '123',
  'not-a-phone',
  '(11) 9999-999',
  '1199999999', // 9 digits
];

// ============================================
// CPF/CNPJ
// ============================================

/**
 * CPFs válidos para testes.
 */
export const validCpfs = [
  '123.456.789-09',
  '12345678909',
  '529.982.247-25',
];

/**
 * CPFs inválidos para testes.
 */
export const invalidCpfs = [
  '',
  '123.456.789-00',
  '000.000.000-00',
  '111.111.111-11',
  '123456789',
];

/**
 * CNPJs válidos para testes.
 */
export const validCnpjs = [
  '12.345.678/0001-90',
  '12345678000190',
];

/**
 * CNPJs inválidos para testes.
 */
export const invalidCnpjs = [
  '',
  '12.345.678/0001-00',
  '00.000.000/0001-00',
  '12345678',
];

// ============================================
// Passwords
// ============================================

/**
 * Senhas válidas para testes.
 */
export const validPasswords = {
  strong: 'SecurePass123!',
  withSymbols: 'P@ssw0rd!',
  long: 'aB1'.repeat(20),
};

/**
 * Senhas inválidas para testes.
 */
export const invalidPasswords = {
  empty: '',
  short: '123',
  onlyLetters: 'password',
  onlyNumbers: '12345678',
  noUppercase: 'password123!',
  noLowercase: 'PASSWORD123!',
  noNumbers: 'Password!',
  noSymbols: 'Password123',
};

// ============================================
// Files (mock)
// ============================================

/**
 * File mock válido para testes.
 */
export const validFile = {
  name: 'image.jpg',
  type: 'image/jpeg',
  size: 1024 * 500, // 500KB
  lastModified: Date.now(),
};

/**
 * File mock inválido para testes.
 */
export const invalidFile = {
  name: '',
  type: 'invalid/type',
  size: 0,
};

// ============================================
// Timezones
// ============================================

/**
 * Timezones válidos para testes.
 */
export const validTimezones = [
  'UTC',
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
];

/**
 * Timezones inválidos para testes.
 */
export const invalidTimezones = [
  '',
  'Invalid/Timezone',
  'UTC+1',
  'GMT',
];
