# @ninots/validation - Implementation Plan

## Overview

Implementação do pacote de validação com **API fluente como interface PRIMÁRIA**, construída sobre Standard Schema V1.

- ✅ **API Fluente** - Interface primária de uso (`v.string().required().email()`)
- ✅ **Standard Schema V1** - Base de implementação (interno)
- ❌ **SEM parser de string rules** (`'required|email'`)
- ❌ **SEM `Validator.make()`** como API primária
- ✅ **Type inference automático**
- ✅ **Zero dependências externas**

> **Nota Arquitetural:** A API fluente (`v.*`) é a interface **PRIMÁRIA** que os usuários utilizarão. Standard Schema V1 é a base técnica (importante para interoperabilidade, mas interno). Regras individuais (`RequiredRule`, `EmailRule`) são detalhes de implementação não expostos na documentação pública.

---

## Architecture

```
@ninots/validation/
├── src/
│   ├── types.ts                # StandardSchemaV1 types
│   ├── utilities.ts            # InferInput, InferOutput
│   ├── v.ts                    # API fluente entrypoint (v.string(), v.number(), etc)
│   ├── object.ts               # v.object() para schemas compostos
│   ├── fluent/
│   │   ├── BaseSchema.ts       # Classe base com ~standard
│   │   ├── StringSchema.ts     # .required(), .email(), .min(), .max()
│   │   ├── NumberSchema.ts     # .min(), .max(), .positive()
│   │   ├── BooleanSchema.ts    # .boolean()
│   │   ├── ArraySchema.ts      # .array(itemSchema)
│   │   └── ObjectSchema.ts     # .object(shape)
│   ├── rules/
│   │   ├── RequiredRule.ts     # StandardSchemaV1 (interno)
│   │   ├── EmailRule.ts        # StandardSchemaV1 (interno)
│   │   ├── MinRule.ts          # StandardSchemaV1 (interno)
│   │   ├── MaxRule.ts          # StandardSchemaV1 (interno)
│   │   └── ...                 # Outras regras (internas)
│   ├── exceptions/
│   │   └── ValidationException.ts
│   └── index.ts                # Public API exports
├── tests/
│   ├── setup.ts
│   └── unit/
│       ├── fluent/
│       │   └── v.test.ts       # Tests da API fluente
│       └── integration/
│           └── schemas.test.ts # Tests de integração
└── package.json
```

### Removed/Deprecated

- ❌ `src/Validator.ts` - Parser de string rules (DEPRECATED)
- ❌ `src/contracts/ValidationRule.ts` - Contrato legacy (`passes()`, `message()`)
- ❌ `src/contracts/ValidatorInterface.ts` - Interface legacy
- ❌ `src/parsers/` - Parser de string rules

---

## Implementation Phases

### Fase 0: Foundation Standard Schema (3-4h)
**Status:** ⏳ Pendente

- [ ] 0.1 Criar `src/types.ts` com tipos StandardSchemaV1
- [ ] 0.2 Criar `src/utilities.ts` com `InferInput`, `InferOutput`
- [ ] 0.3 Criar contrato `StandardSchemaRule`

### Fase 1: API Fluente Core (6-8h)
**Status:** ⏳ Pendente

- [ ] 1.1 Criar `src/v.ts` entrypoint (`v.string()`, `v.number()`, etc)
- [ ] 1.2 Criar `src/object.ts` para schemas compostos
- [ ] 1.3 Criar `src/fluent/BaseSchema.ts` (classe base com `~standard`)
- [ ] 1.4 Criar `src/fluent/StringSchema.ts` (`.required()`, `.email()`, `.min()`, `.max()`)
- [ ] 1.5 Criar `src/fluent/NumberSchema.ts` (`.min()`, `.max()`, `.positive()`)
- [ ] 1.6 Criar `src/fluent/BooleanSchema.ts`
- [ ] 1.7 Criar `src/fluent/ArraySchema.ts`
- [ ] 1.8 Criar `src/fluent/ObjectSchema.ts`

### Fase 2: Refatorar 10 Regras (6-8h)
**Status:** ⏳ Pendente

- [ ] 2.1 RequiredRule → StandardSchemaV1
- [ ] 2.2 StringRule → StandardSchemaV1
- [ ] 2.3 NumberRule → StandardSchemaV1
- [ ] 2.4 BooleanRule → StandardSchemaV1
- [ ] 2.5 ArrayRule → StandardSchemaV1
- [ ] 2.6 EmailRule → StandardSchemaV1
- [ ] 2.7 UuidRule → StandardSchemaV1
- [ ] 2.8 MaxRule → StandardSchemaV1
- [ ] 2.9 MinRule → StandardSchemaV1
- [ ] 2.10 InRule → StandardSchemaV1

### Fase 3: Type Inference & Chaining (4-6h)
**Status:** ⏳ Pendente

- [ ] 3.1 Type intersection para regras compostas
- [ ] 3.2 Chaining type-safe (`.required().email()`)
- [ ] 3.3 Type constraints (`.email()` só em string)
- [ ] 3.4 Recursive types para objetos aninhados

### Fase 4: Finalização (3-4h)
**Status:** ⏳ Pendente

- [ ] 4.1 Exports completos em `src/index.ts`
- [ ] 4.2 TSDoc em todas as APIs públicas
- [ ] 4.3 README com exemplos de API fluente
- [ ] 4.4 Tests de integração
- [ ] 4.5 `bun run verify:all`

---

## Standard Schema V1 Interface

```typescript
/**
 * The Standard Schema interface.
 * @see https://standardschema.dev/schema
 */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': StandardSchemaV1.Props<Input, Output>;
}

export declare namespace StandardSchemaV1 {
  export interface Props<Input = unknown, Output = Input> {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
      options?: Options | undefined
    ) => Result<Output> | Promise<Result<Output>>;
    readonly types?: Types<Input, Output> | undefined;
  }

  export type Result<Output> = SuccessResult<Output> | FailureResult;

  export interface SuccessResult<Output> {
    readonly value: Output;
    readonly issues?: undefined;
  }

  export interface FailureResult {
    readonly issues: ReadonlyArray<Issue>;
  }

  export interface Issue {
    readonly message: string;
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
  }

  export interface PathSegment {
    readonly key: PropertyKey;
  }

  export interface Options {
    readonly libraryOptions?: Record<string, unknown> | undefined;
  }

  export interface Types<Input = unknown, Output = Input> {
    readonly input: Input;
    readonly output: Output;
  }

  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['input'];

  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['output'];
}
```

---

## Usage Examples (API Fluente)

### Basic Validation

```typescript
import { v, InferOutput } from '@ninots/validation';

// Schema definition
const emailSchema = v.string().required().email().max(255);

// Type inference
type Email = InferOutput<typeof emailSchema>; // string

// Validation
const result = emailSchema['~standard'].validate('test@example.com');

if (result.issues) {
  console.error('Validation failed:', result.issues);
} else {
  console.log('Validated:', result.value);
}
```

### Object Validation

```typescript
import { v, InferOutput } from '@ninots/validation';

const userSchema = v.object({
  name: v.string().min(2).required(),
  email: v.string().email().required(),
  age: v.number().min(18).max(100).optional(),
  roles: v.array(v.string()).min(1).max(5),
  address: v.object({
    street: v.string().required(),
    city: v.string().required(),
    zipCode: v.string().regex(/^\d{5}-\d{3}$/),
  }),
});

type User = InferOutput<typeof userSchema>;
// {
//   name: string,
//   email: string,
//   age?: number,
//   roles: string[],
//   address: {
//     street: string,
//     city: string,
//     zipCode: string
//   }
// }

const result = userSchema['~standard'].validate(userData);
```

### Nullable and Optional

```typescript
import { v } from '@ninots/validation';

const schema = v.object({
  // Required field (cannot be null/undefined)
  name: v.string().required(),
  
  // Optional field (can be undefined)
  nickname: v.string().optional(),
  
  // Nullable field (can be null)
  bio: v.string().nullable(),
  
  // Both (can be null or undefined)
  website: v.string().nullable().optional(),
});
```

### Array Validation

```typescript
import { v } from '@ninots/validation';

const tagsSchema = v.array(v.string().min(1).max(50)).min(1).max(10);

const result = tagsSchema['~standard'].validate(['typescript', 'validation']);
```

---

## Fluent API Methods

### String Methods

| Method | Description | Example |
|--------|-------------|---------|
| `v.string()` | String schema | `v.string()` |
| `.required()` | Required field | `v.string().required()` |
| `.optional()` | Can be undefined | `v.string().optional()` |
| `.nullable()` | Can be null | `v.string().nullable()` |
| `.email()` | Email format | `v.string().email()` |
| `.uuid()` | UUID format | `v.string().uuid()` |
| `.min(n)` | Minimum length | `v.string().min(3)` |
| `.max(n)` | Maximum length | `v.string().max(255)` |
| `.length(n)` | Exact length | `v.string().length(11)` |
| `.regex(pattern)` | Pattern match | `v.string().regex(/^\d+$/)` |
| `.url()` | URL format | `v.string().url()` |

### Number Methods

| Method | Description | Example |
|--------|-------------|---------|
| `v.number()` | Number schema | `v.number()` |
| `.required()` | Required field | `v.number().required()` |
| `.optional()` | Can be undefined | `v.number().optional()` |
| `.min(n)` | Minimum value | `v.number().min(18)` |
| `.max(n)` | Maximum value | `v.number().max(100)` |
| `.positive()` | Must be positive | `v.number().positive()` |
| `.negative()` | Must be negative | `v.number().negative()` |
| `.integer()` | Must be integer | `v.number().integer()` |

### Boolean Methods

| Method | Description | Example |
|--------|-------------|---------|
| `v.boolean()` | Boolean schema | `v.boolean()` |
| `.required()` | Required field | `v.boolean().required()` |
| `.optional()` | Can be undefined | `v.boolean().optional()` |

### Array Methods

| Method | Description | Example |
|--------|-------------|---------|
| `v.array(schema)` | Array schema | `v.array(v.string())` |
| `.min(n)` | Minimum items | `v.array(v.string()).min(1)` |
| `.max(n)` | Maximum items | `v.array(v.string()).max(10)` |
| `.length(n)` | Exact items count | `v.array(v.string()).length(3)` |

### Object Methods

| Method | Description | Example |
|--------|-------------|---------|
| `v.object(shape)` | Object schema | `v.object({ name: v.string() })` |
| `.required()` | Required object | `v.object({...}).required()` |
| `.optional()` | Optional object | `v.object({...}).optional()` |

---

## Type Inference

```typescript
import { v, InferInput, InferOutput } from '@ninots/validation';

// Simple inference
const emailSchema = v.string().email().required();
type Email = InferOutput<typeof emailSchema>; // string

// Object inference
const userSchema = v.object({
  name: v.string().required(),
  age: v.number().min(18),
  roles: v.array(v.string()),
});

type UserInput = InferInput<typeof userSchema>;
// { name?: string, age?: number, roles?: string[] }

type UserOutput = InferOutput<typeof userSchema>;
// { name: string, age: number, roles: string[] }

// Nested inference
const postSchema = v.object({
  author: userSchema,
  content: v.string().required(),
  tags: v.array(v.string()),
});

type Post = InferOutput<typeof postSchema>;
// {
//   author: { name: string, age: number, roles: string[] },
//   content: string,
//   tags: string[]
// }
```

---

## Acceptance Criteria

1. ✅ **API Fluente Funcional:** `v.string()`, `v.number()`, `v.boolean()`, `v.array()`, `v.object()`
2. ✅ **Chaining Methods:** `.required()`, `.optional()`, `.nullable()`, `.email()`, `.min()`, `.max()`, etc.
3. ✅ **Type Inference:** `InferInput`, `InferOutput` funcionam corretamente
4. ✅ **Chaining Type-Safe:** TypeScript previne chaining inválido (`.number().email()` erro)
5. ✅ **Standard Schema V1:** Todos schemas implementam `~standard.validate()`
6. ✅ **10 Regras Refatoradas:** Todas implementando StandardSchemaV1 (internas)
7. ✅ **Testes Passando:** Tests para API fluente e integração
8. ✅ **TSDoc Completo:** Documentação em todas as APIs públicas
9. ✅ **Verify All:** `bun run verify:all` passando
10. ✅ **Zero `any`:** `bun run verify:no-any` passando
11. ✅ **Zero Dependências:** Nenhuma dependência externa

---

## Development Commands

```bash
cd framework/packages/validation

# Install dependencies
bun install

# Run tests
bun test

# Run tests (watch mode)
bun test --watch

# Lint
bun run lint

# Format
bun run format

# Type check
bun run type-check

# Verify no `any` types
bun run verify:no-any

# Full verification
bun run verify:all
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Type inference complexo em chaining | Alto | Testar extensivamente com strict mode, começar simples |
| Chaining fluente performance | Médio | Early exit na validação, lazy evaluation |
| Breaking changes na API | Alto | Versionamento semântico claro, docs de migração |
| Curva de aprendizado | Baixo | Documentação focada em exemplos práticos |
| Recursive types para objetos aninhados | Médio | Usar type helpers, testar casos complexos |

---

## Estimated Timeline

| Fase | Estimativa | Complexidade |
|------|-----------|-------------|
| Fase 0: Foundation | 3-4h | Baixa |
| Fase 1: API Fluente Core | 6-8h | Média-Alta |
| Fase 2: Refatorar Regras | 6-8h | Média |
| Fase 3: Type Inference | 4-6h | Alta |
| Fase 4: Finalização | 3-4h | Baixa |
| **Total** | **22-30h** | **Média-Alta** |

---

## References

- **Standard Schema:** https://standardschema.dev/schema
- **Standard Schema Spec:** https://github.com/standard-schema/standard-schema
- **NPM Package:** https://www.npmjs.com/package/@standard-schema/spec

---

**Last Updated:** 2026-03-28  
**Status:** Planning Complete - Ready for Implementation (API Fluente como interface PRIMÁRIA)
