# @ninots/validation

Sistema de validação de dados com API fluente type-safe, Standard Schema V1 compliant, inspirado na DX do Laravel.

## Visão Geral

O `@ninots/validation` fornece uma API fluente moderna para validação de dados com inferência de tipos TypeScript completa. Compatível com o padrão [Standard Schema V1](https://standardschema.dev/), garantindo interoperabilidade com outras bibliotecas.

### Características Principais

- ✅ **API Fluente** - Chainable e expressiva
- ✅ **Type Inference** - Tipos inferidos automaticamente
- ✅ **Standard Schema V1** - Compatível com o padrão da indústria
- ✅ **Zero Dependencies** - Bun-native, sem dependências externas
- ✅ **Transformações** - Transforme dados durante a validação
- ✅ **Validação Aninhada** - Objetos e arrays aninhados

## Instalação

```bash
bun add @ninots/validation
```

## Quick Start

```typescript
import { v } from '@ninots/validation';

// Definir schema
const userSchema = v.object({
    name: v.string().required().min(2),
    email: v.string().email(),
    age: v.number().min(0).optional(),
});

// Validar dados
const result = userSchema.validate({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
});

if (result.success) {
    console.log('Válido:', result.value);
} else {
    console.log('Erros:', result.issues);
}
```

## API Fluente

### `v.string()` - Validação de Strings

```typescript
import { v } from '@ninots/validation';

const schema = v.string()
    .required()      // Não pode ser undefined/null
    .min(3)          // Mínimo 3 caracteres
    .max(50)         // Máximo 50 caracteres
    .email()         // Formato de email
    .uuid()          // Formato UUID
    .url()           // Formato URL
    .trim()          // Remove espaços
    .lowercase();    // Transforma para lowercase

schema.validate('user@example.com');
```

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `.required()` | Marca como obrigatório |
| `.optional()` | Permite undefined |
| `.nullable()` | Permite null |
| `.min(n)` | Comprimento mínimo |
| `.max(n)` | Comprimento máximo |
| `.email()` | Valida formato de email |
| `.uuid()` | Valida formato UUID |
| `.url()` | Valida formato URL |
| `.regex(pattern)` | Valida contra regex |
| `.startsWith(prefix)` | Valida prefixo |
| `.endsWith(suffix)` | Valida sufixo |
| `.contains(str)` | Valida se contém substring |
| `.trim()` | Remove espaços (transform) |
| `.lowercase()` | Converte para lowercase (transform) |
| `.uppercase()` | Converte para uppercase (transform) |
| `.empty()` | Valida se está vazio |
| `.nonEmpty()` | Valida se não está vazio |

### `v.number()` - Validação de Números

```typescript
import { v } from '@ninots/validation';

const schema = v.number()
    .required()
    .min(0)           // Mínimo 0
    .max(100)         // Máximo 100
    .positive()       // Deve ser positivo
    .integer()        // Deve ser inteiro
    .multipleOf(5);   // Múltiplo de 5

schema.validate(25); // ✅
schema.validate(-5); // ❌
```

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `.required()` | Marca como obrigatório |
| `.optional()` | Permite undefined |
| `.nullable()` | Permite null |
| `.min(n)` | Valor mínimo |
| `.max(n)` | Valor máximo |
| `.positive()` | Deve ser > 0 |
| `.negative()` | Deve ser < 0 |
| `.integer()` | Deve ser inteiro |
| `.equal(n)` | Deve ser igual a n |
| `.range(min, max)` | Dentro do intervalo |
| `.multipleOf(n)` | Múltiplo de n |
| `.finite()` | Deve ser finito |
| `.safe()` | Deve ser safe integer |

### `v.boolean()` - Validação de Booleanos

```typescript
import { v } from '@ninots/validation';

const schema = v.boolean()
    .required()
    .true(); // Deve ser true

schema.validate(true);  // ✅
schema.validate(false); // ❌
```

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `.required()` | Marca como obrigatório |
| `.optional()` | Permite undefined |
| `.nullable()` | Permite null |
| `.true()` | Deve ser true |
| `.false()` | Deve ser false |

### `v.array()` - Validação de Arrays

```typescript
import { v } from '@ninots/validation';

// Array de strings
const tagsSchema = v.array(v.string().required())
    .min(1)           // Pelo menos 1 item
    .max(10)          // Máximo 10 itens
    .nonEmpty();      // Não pode ser vazio

// Array de números
const scoresSchema = v.array(v.number().min(0).max(100));

tagsSchema.validate(['tag1', 'tag2']); // ✅
```

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `.min(n)` | Número mínimo de itens |
| `.max(n)` | Número máximo de itens |
| `.length(n)` | Número exato de itens |
| `.nonEmpty()` | Não pode ser vazio |
| `.empty()` | Deve ser vazio |
| `.items(schema)` | Schema para cada item |
| `.includes(value)` | Deve conter valor |
| `.unique()` | Remove duplicados (transform) |

### `v.object()` - Validação de Objetos

```typescript
import { v } from '@ninots/validation';

const userSchema = v.object({
    name: v.string().required(),
    email: v.string().email(),
    address: v.object({
        street: v.string().required(),
        city: v.string().required(),
        zipCode: v.string().regex(/^\d{5}-\d{3}$/),
    }),
    tags: v.array(v.string()).optional(),
});

userSchema.validate({
    name: 'John',
    email: 'john@example.com',
    address: {
        street: 'Main St',
        city: 'NYC',
        zipCode: '10001-123',
    },
});
```

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `.strict()` | Rejeita chaves extras |
| `.passthrough()` | Permite chaves extras (default) |
| `.minKeys(n)` | Mínimo de chaves |
| `.maxKeys(n)` | Máximo de chaves |
| `.extend(shape)` | Estende com novas propriedades |
| `.omit(keys)` | Omite propriedades |
| `.pick(keys)` | Seleciona propriedades |
| `.partial()` | Torna todas opcionais |

## Type Inference

O `@ninots/validation` extrai tipos TypeScript automaticamente dos schemas:

```typescript
import { v, type InferInput, type InferOutput } from '@ninots/validation';

const userSchema = v.object({
    name: v.string().required(),
    email: v.string().email(),
    age: v.number().min(0).optional(),
});

// Inferir tipos
type UserInput = InferInput<typeof userSchema>;
// { name: string; email: string; age?: number | undefined }

type UserOutput = InferOutput<typeof userSchema>;
// { name: string; email: string; age?: number }

// Usar em funções
function createUser(data: InferInput<typeof userSchema>) {
    const result = userSchema.validate(data);
    if (result.success) {
        return result.value; // Tipo: InferOutput<typeof userSchema>
    }
    throw new Error('Validation failed');
}
```

## Nullable e Optional

```typescript
import { v } from '@ninots/validation';

// Optional - permite undefined
const optionalSchema = v.string().optional();
optionalSchema.validate(undefined); // ✅
optionalSchema.validate('value');   // ✅
optionalSchema.validate(null);      // ❌

// Nullable - permite null
const nullableSchema = v.string().nullable();
nullableSchema.validate(null);      // ✅
nullableSchema.validate('value');   // ✅
nullableSchema.validate(undefined); // ❌

// Nullable + Optional
const nullableOptionalSchema = v.string().nullable().optional();
nullableOptionalSchema.validate(null);      // ✅
nullableOptionalSchema.validate(undefined); // ✅
nullableOptionalSchema.validate('value');   // ✅
```

## Standard Schema V1 Compliance

O pacote segue a especificação [Standard Schema V1](https://standardschema.dev/):

```typescript
import { v } from '@ninots/validation';

const schema = v.string().email();

// Acesso ao namespace standard
console.log(schema['~standard'].vendor);  // 'ninots'
console.log(schema['~standard'].version); // '1.0.0'

// Validar usando a interface standard
const result = schema['~standard'].validate('test@example.com');

if (result.success) {
    console.log(result.value);
} else {
    console.log(result.issues);
}
```

## Validações Disponíveis

### String

```typescript
v.string().email()           // user@example.com
v.string().uuid()            // 550e8400-e29b-41d4-a716-446655440000
v.string().url()             // https://example.com
v.string().min(3)            // Mínimo 3 chars
v.string().max(255)          // Máximo 255 chars
v.string().regex(/^[A-Z]+$/) // Regex customizado
v.string().startsWith('https://')
v.string().endsWith('.com')
v.string().contains('admin')
```

### Number

```typescript
v.number().min(0)            // Mínimo 0
v.number().max(100)          // Máximo 100
v.number().positive()        // > 0
v.number().negative()        // < 0
v.number().integer()         // Sem decimais
v.number().range(1, 10)      // Entre 1 e 10
v.number().multipleOf(5)     // Múltiplo de 5
v.number().finite()          // Não Infinity
v.number().safe()            // Safe integer
```

### Array

```typescript
v.array(v.string()).min(1)   // Pelo menos 1 item
v.array(v.number()).max(10)  // Máximo 10 itens
v.array().length(3)          // Exatamente 3 itens
v.array().nonEmpty()         // Não vazio
v.array().unique()           // Remove duplicados
```

### Object

```typescript
v.object({}).strict()        // Rejeita chaves extras
v.object({}).partial()       // Todas opcionais
v.object({}).pick(['name'])  // Apenas 'name'
v.object({}).omit(['password'])
v.object({}).extend({ extra: v.string() })
```

## Exemplos de Uso Real

### Validação de Formulário de Registro

```typescript
import { v, type InferInput } from '@ninots/validation';

const registerSchema = v.object({
    username: v.string()
        .required()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e underscore'),
    email: v.string().email(),
    password: v.string()
        .required()
        .min(8)
        .regex(/[A-Z]/, 'Deve conter letra maiúscula')
        .regex(/[0-9]/, 'Deve conter número'),
    age: v.number().min(18).integer(),
    terms: v.boolean().true(),
});

type RegisterData = InferInput<typeof registerSchema>;

function registerUser(data: RegisterData) {
    const result = registerSchema.validate(data);
    
    if (!result.success) {
        // Retornar erros para o frontend
        return {
            errors: result.issues.map(issue => ({
                field: issue.path?.[0] as string,
                message: issue.message,
            })),
        };
    }
    
    // Dados válidos
    const validData = result.value;
    // Criar usuário...
}
```

### Validação de API Request

```typescript
import { v, type InferInput } from '@ninots/validation';

const createPostSchema = v.object({
    title: v.string().required().min(5).max(100),
    content: v.string().required().min(50),
    tags: v.array(v.string().min(2).max(20)).min(1).max(5),
    published: v.boolean().optional(),
    metadata: v.object({
        author: v.string().required(),
        category: v.string().optional(),
    }).optional(),
});

type CreatePostRequest = InferInput<typeof createPostSchema>;

// Em um handler de API
async function handleCreatePost(request: Request) {
    const body = await request.json();
    const result = createPostSchema.validate(body);
    
    if (!result.success) {
        return new Response(JSON.stringify({ errors: result.issues }), {
            status: 422,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    const data = result.value;
    // Processar post...
}
```

### Validação Aninhada Complexa

```typescript
import { v } from '@ninots/validation';

const orderSchema = v.object({
    customerId: v.string().uuid().required(),
    items: v.array(
        v.object({
            productId: v.string().uuid(),
            quantity: v.number().positive().integer(),
            price: v.number().positive(),
        })
    ).min(1).nonEmpty(),
    shipping: v.object({
        address: v.object({
            street: v.string().required(),
            city: v.string().required(),
            state: v.string().length(2),
            zipCode: v.string().regex(/^\d{5}(-\d{4})?$/),
        }),
        method: v.string().in(['standard', 'express', 'overnight']),
    }),
    payment: v.object({
        method: v.string().in(['credit', 'debit', 'paypal']),
        cardNumber: v.string().regex(/^\d{16}$/).optional(),
    }).optional(),
});
```

## Migração da API Legacy

Se você usava a API antiga baseada em strings:

```typescript
// ❌ Antigo (ainda suportado, mas deprecated)
import { Validator } from '@ninots/validation';

const validator = new Validator(data, {
    name: 'required|string|min:3',
    email: 'required|email',
    age: 'number|min:0',
});

// ✅ Novo (recomendado)
import { v } from '@ninots/validation';

const schema = v.object({
    name: v.string().required().min(3),
    email: v.string().email(),
    age: v.number().min(0),
});
```

## Licença

MIT © Ninots Framework
