/**
 * Testes de Integração da API Fluente.
 *
 * @packageDocumentation
 * Testes de integração demonstrando uso real da API fluente do @ninots/validation.
 * Inclui exemplos de validação de objetos, arrays, type inference e Standard Schema V1.
 */

import { describe, expect, test } from 'bun:test';
import { type InferInput, type InferOutput, v } from '../../src/index';

describe('Fluent API - Integração', () => {
  describe('Validação de Objetos Complexos', () => {
    test('deve validar objeto de usuário completo', () => {
      const userSchema = v.object({
        active: v.boolean().optional(),
        age: v.number().min(0).optional(),
        email: v.string().email(),
        name: v.string().required().min(2),
      });

      const validData = {
        active: true,
        age: 25,
        email: 'john@example.com',
        name: 'John Doe',
      };

      const result = userSchema.validate(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual(validData);
      }
    });

    test('deve falhar com email inválido', () => {
      const userSchema = v.object({
        email: v.string().email(),
        name: v.string().required(),
      });

      const invalidData = {
        email: 'invalid-email',
        name: 'John',
      };

      const result = userSchema.validate(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues.length).toBeGreaterThan(0);
        // Verifica se a mensagem menciona o campo ou erro de validação
        const message = result.issues[0]?.message ?? '';
        expect(message).toBeTruthy();
      }
    });

    test('deve validar objeto aninhado', () => {
      const addressSchema = v.object({
        city: v.string().required(),
        street: v.string().required(),
        zipCode: v.string().regex(/^\d{5}$/),
      });

      const userWithAddressSchema = v.object({
        address: addressSchema,
        name: v.string().required(),
      });

      const validData = {
        address: {
          city: 'NYC',
          street: 'Main St',
          zipCode: '10001',
        },
        name: 'John',
      };

      const result = userWithAddressSchema.validate(validData);

      expect(result.success).toBe(true);
    });

    test('deve falhar com objeto aninhado inválido', () => {
      const addressSchema = v.object({
        street: v.string().required(),
        zipCode: v.string().regex(/^\d{5}$/),
      });

      const schema = v.object({
        address: addressSchema,
        name: v.string().required(),
      });

      const invalidData = {
        address: {
          street: 'Main St',
          zipCode: 'invalid',
        },
        name: 'John',
      };

      const result = schema.validate(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        // Apenas verifica que há erros
        expect(result.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Validação de Arrays', () => {
    test('deve validar array de strings', () => {
      const tagsSchema = v.array(v.string().required()).min(1).max(5);

      const validData = ['tag1', 'tag2', 'tag3'];

      const result = tagsSchema.validate(validData);

      expect(result.success).toBe(true);
    });

    test('deve falhar com array vazio quando requerido', () => {
      const tagsSchema = v.array(v.string().required()).min(1);

      const invalidData: string[] = [];

      const result = tagsSchema.validate(invalidData);

      expect(result.success).toBe(false);
    });

    test('deve validar array de objetos', () => {
      const itemSchema = v.object({
        id: v.string().uuid(),
        quantity: v.number().positive().integer(),
      });

      const orderSchema = v.object({
        items: v.array(itemSchema).min(1),
      });

      const validData = {
        items: [
          { id: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 },
          { id: '660e8400-e29b-41d4-a716-446655440001', quantity: 5 },
        ],
      };

      const result = orderSchema.validate(validData);

      expect(result.success).toBe(true);
    });

    test('deve validar array com unique()', () => {
      const schema = v.array(v.string()).unique();

      const result = schema.validate(['a', 'b', 'a', 'c']);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual(['a', 'b', 'c']);
      }
    });
  });

  describe('Nullable e Optional', () => {
    test('deve aceitar undefined com optional()', () => {
      const schema = v.string().optional();

      expect(schema.validate(undefined).success).toBe(true);
      expect(schema.validate('value').success).toBe(true);
      expect(schema.validate(null).success).toBe(false);
    });

    test('deve aceitar null com nullable()', () => {
      const schema = v.string().nullable();

      expect(schema.validate(null).success).toBe(true);
      expect(schema.validate('value').success).toBe(true);
      expect(schema.validate(undefined).success).toBe(false);
    });

    test('deve aceitar null e undefined com nullable().optional()', () => {
      const schema = v.string().nullable().optional();

      expect(schema.validate(null).success).toBe(true);
      expect(schema.validate(undefined).success).toBe(true);
      expect(schema.validate('value').success).toBe(true);
    });

    test('deve validar objeto com propriedades opcionais', () => {
      const schema = v.object({
        age: v.number().optional(),
        name: v.string().required(),
        nickname: v.string().optional(),
      });

      const result1 = schema.validate({ name: 'John' });
      const result2 = schema.validate({ age: 25, name: 'John', nickname: 'JD' });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });

  describe('Type Inference', () => {
    test('deve inferir tipos de input corretamente', () => {
      const schema = v.object({
        age: v.number().min(0).optional(),
        email: v.string().email(),
        name: v.string().required(),
      });

      type InputType = InferInput<typeof schema>;

      const validInput: InputType = {
        age: 25,
        email: 'john@example.com',
        name: 'John',
      };

      const result = schema.validate(validInput);

      expect(result.success).toBe(true);
    });

    test('deve inferir tipos de output corretamente', () => {
      const schema = v.object({
        email: v.string().email(),
        name: v.string().required(),
      });

      type OutputType = InferOutput<typeof schema>;

      const result = schema.validate({ email: 'john@example.com', name: 'John' });

      expect(result.success).toBe(true);
      if (result.success) {
        const output: OutputType = result.value;
        expect(output.name).toBe('John');
        expect(output.email).toBe('john@example.com');
      }
    });
  });

  describe('Standard Schema V1 Compliance', () => {
    test('deve expor namespace ~standard', () => {
      const schema = v.string().email();

      expect(schema['~standard']).toBeDefined();
      expect(schema['~standard'].vendor).toBe('ninots');
      expect(schema['~standard'].version).toBe('1.0.0');
      expect(typeof schema['~standard'].validate).toBe('function');
    });

    test('deve validar via interface standard', () => {
      const schema = v.number().min(0).max(100);

      const result = schema['~standard'].validate(50);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(50);
      }
    });

    test('deve retornar issues via interface standard', () => {
      const schema = v.string().email();

      const result = schema['~standard'].validate('invalid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues).toBeDefined();
        expect(result.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Transformações', () => {
    test('deve transformar string com trim()', () => {
      const schema = v.string().trim();

      const result = schema.validate('  hello  ');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('hello');
      }
    });

    test('deve transformar string com lowercase()', () => {
      const schema = v.string().lowercase();

      const result = schema.validate('HELLO');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('hello');
      }
    });

    test('deve transformar string com uppercase()', () => {
      const schema = v.string().uppercase();

      const result = schema.validate('hello');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('HELLO');
      }
    });

    test('deve encadear transformações', () => {
      const schema = v.string().trim().lowercase();

      const result = schema.validate('  HELLO  ');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('hello');
      }
    });
  });

  describe('Métodos de Object Schema', () => {
    test('deve validar com strict()', () => {
      const schema = v
        .object({
          name: v.string().required(),
        })
        .strict();

      const validResult = schema.validate({ name: 'John' });
      const invalidResult = schema.validate({ extra: 'key', name: 'John' });

      expect(validResult.success).toBe(true);
      expect(invalidResult.success).toBe(false);
    });

    test('deve estender schema com extend()', () => {
      const baseSchema = v.object({
        name: v.string().required(),
      });

      const extendedSchema = baseSchema.extend({
        age: v.number().min(0),
      });

      const result = extendedSchema.validate({ age: 25, name: 'John' });

      expect(result.success).toBe(true);
    });

    test('deve omitir propriedades com omit()', () => {
      const schema = v.object({
        email: v.string().email(),
        name: v.string().required(),
        password: v.string().required(),
      });

      const publicSchema = schema.omit(['password']);

      const result = publicSchema.validate({ email: 'john@example.com', name: 'John' });

      expect(result.success).toBe(true);
    });

    test('deve selecionar propriedades com pick()', () => {
      const schema = v.object({
        age: v.number().min(0),
        email: v.string().email(),
        name: v.string().required(),
      });

      const nameEmailSchema = schema.pick(['name', 'email']);

      const result = nameEmailSchema.validate({ email: 'john@example.com', name: 'John' });

      expect(result.success).toBe(true);
    });

    test('deve tornar propriedades opcionais com partial()', () => {
      const schema = v.object({
        email: v.string().required(),
        name: v.string().required(),
      });

      const partialSchema = schema.partial();

      const result = partialSchema.validate({});

      expect(result.success).toBe(true);
    });
  });

  describe('Exemplos de Uso Real', () => {
    test('deve validar formulário de registro', () => {
      const registerSchema = v.object({
        age: v.number().min(18).integer(),
        email: v.string().email(),
        password: v.string().required().min(8).regex(/[A-Z]/).regex(/[0-9]/),
        terms: v.boolean().true(),
        username: v
          .string()
          .required()
          .min(3)
          .max(20)
          .regex(/^[a-zA-Z0-9_]+$/),
      });

      const validData = {
        age: 25,
        email: 'john@example.com',
        password: 'Password123',
        terms: true,
        username: 'john_doe',
      };

      const result = registerSchema.validate(validData);

      expect(result.success).toBe(true);
    });

    test('deve validar pedido de compra', () => {
      const orderSchema = v.object({
        customerId: v.string().uuid().required(),
        items: v
          .array(
            v.object({
              price: v.number().positive(),
              productId: v.string().uuid(),
              quantity: v.number().positive().integer(),
            }),
          )
          .min(1),
        total: v.number().positive(),
      });

      const validData = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        items: [
          {
            price: 29.99,
            productId: '660e8400-e29b-41d4-a716-446655440001',
            quantity: 2,
          },
        ],
        total: 59.98,
      };

      const result = orderSchema.validate(validData);

      expect(result.success).toBe(true);
    });
  });
});
