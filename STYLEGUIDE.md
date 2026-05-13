# ninoTS TypeScript Style Guide

> **Version:** 1.0.0  
> **Target:** TypeScript 6.x+, Bun native, Biome (formatter + linter)  
> **Based on:** [ts.dev/style](https://ts.dev/style/) + [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)  
> **Maintained by:** [@joaovjo](https://github.com/joaovjo) & [@vgeruso](https://github.com/vgeruso) — [pandowLABS](https://github.com/pandowlabs)

---

## Índice

1. [Filosofia](#filosofia)
2. [Tooling — Biome](#tooling--biome)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Sintaxe](#sintaxe)
   - [Identificadores & Nomenclatura](#identificadores--nomenclatura)
   - [Codificação e Encoding](#codificação-e-encoding)
   - [Formatação](#formatação)
   - [Comentários & Documentação](#comentários--documentação)
5. [Regras de Linguagem](#regras-de-linguagem)
   - [Variáveis](#variáveis)
   - [Tipos Primitivos & Wrappers](#tipos-primitivos--wrappers)
   - [Classes](#classes)
   - [Funções](#funções)
   - [Iteração](#iteração)
   - [Exceções](#exceções)
   - [Módulos & Imports](#módulos--imports)
   - [Exports](#exports)
6. [Sistema de Tipos](#sistema-de-tipos)
   - [Inferência de Tipos](#inferência-de-tipos)
   - [null vs undefined](#null-vs-undefined)
   - [Interfaces vs Type Aliases](#interfaces-vs-type-aliases)
   - [any, unknown e never](#any-unknown-e-never)
   - [Generics](#generics)
   - [Enums](#enums)
7. [Recursos do TypeScript 6.x+](#recursos-do-typescript-6x)
8. [Práticas Específicas: Bun Nativas](#práticas-específicas-bun-nativas)
9. [Observabilidade e Logs](#observabilidade-e-logs)
10. [Consistência](#consistência)

---

## Filosofia

Este guia de estilo é o padrão oficial do **ninoTS** e de todos os repositórios da **pandowLABS**. Ele une as melhores práticas das referências canônicas de TypeScript (ts.dev e Google), adaptando-as para:

- **TypeScript 6.x+** com modo estrito ativado.
- **Bun native** como único runtime — nenhuma referência a Node.js ou Deno.
- **Biome** como ferramenta unificada de formatação e linting (sem ESLint, sem Prettier).
- **Zero dependências externas** no código de produção do framework.

Este guia usa a terminologia do [RFC 2119](https://tools.ietf.org/html/rfc2119): **DEVE**, **NÃO DEVE**, **OBRIGATÓRIO**, **PODE**, **NÃO PODE**, **RECOMENDADO**, **TALVEZ** e **OPCIONAL**.

> **Regra de ouro:** Se não está neste guia, siga os padrões já estabelecidos nos arquivos existentes do projeto. Prefira clareza à brevidade.

---

## Tooling — Biome

O ninoTS usa [Biome](https://biomejs.dev/) como toolchain unificada. Biome substitui ESLint + Prettier em uma única ferramenta escrita em Rust, com suporte nativo a TypeScript.

### Configuração padrão (`biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.14/schema.json",
  "root": true,
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**/*.ts", "**/*.tsx", "**/*.json"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 4,
    "lineWidth": 120,
    "lineEnding": "lf",
    "semicolons": "always",
    "quoteStyle": "double"
  },
  "organizeImports": {
    "enabled": true
  },
  "assist": {
    "enabled": true,
    "actions": {
      "recommended": true
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noForEach": "error",
        "useArrowFunction": "error",
        "noUselessUndefinedInitialization": "error",
        "noUselessConstructor": "error",
        "useOptionalChain": "warn"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error",
        "noUnusedFunctionParameters": "warn"
      },
      "style": {
        "noNonNullAssertion": "warn",
        "useConst": "error",
        "useBlockStatements": "error",
        "noParameterAssign": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noConsole": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false
    }
  }
}
```

> **`"root": true`** — indica que este é o arquivo de configuração raiz do projeto Biome (especialmente importante no monorepo do ninoTS). Pacotes internos podem ter seu próprio `biome.json` com `"root": false` e `"extends"` para herdar a config base.

#### Configuração para pacotes internos do monorepo

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.14/schema.json",
  "root": false,
  "extends": ["../../biome.json"]
}
```

### Comandos

```bash
# Verificar formatação e linting
bun biome check .

# Aplicar correções automáticas
bun biome check --write .

# Somente formatar
bun biome format --write .

# Somente lint
bun biome lint .
```

### Supressão de regras

Use supressões apenas quando absolutamente necessário. Sempre inclua uma justificativa:

```typescript
// biome-ignore lint/suspicious/noExplicitAny: necessário para compatibilidade com a API do Bun
function handle(value: any): void { ... }
```

Nunca use `// @ts-ignore`. Prefira `// @ts-expect-error` com uma justificativa quando absolutamente necessário.

```typescript
// ❌ Proibido
// @ts-ignore

// ✅ Permitido em casos extremos, com justificativa
// @ts-expect-error: tipo interno do Bun ainda não exposto na tipagem pública
const socket = Bun._internal.getSocket();
```

---

## Estrutura de Arquivos

Todo arquivo TypeScript deve seguir esta ordem:

1. Informação de copyright (se aplicável).
2. TSDoc com `@packageDocumentation` (se aplicável).
3. Imports.
4. Implementação.

Exatamente **uma linha em branco** separa cada seção presente.

```typescript
/**
 * Servidor HTTP do ninoTS.
 *
 * @remarks
 * Responsável por inicializar e gerenciar o ciclo de vida das requisições.
 *
 * @packageDocumentation
 */

import type { BunRequest } from "bun";
import { Router } from "../router";

export class HttpServer {
  // ...
}
```

### Nomenclatura de arquivos

- Arquivos de código-fonte: `kebab-case.ts` (ex: `http-server.ts`, `route-matcher.ts`).
- Arquivos de teste: `kebab-case.test.ts` (ex: `http-server.test.ts`).
- Arquivos de tipos/interfaces: podem usar o mesmo padrão (`types.ts`, `http.types.ts`).
- **Nunca** use `PascalCase` ou `camelCase` para nomes de arquivos.

---

## Sintaxe

### Identificadores & Nomenclatura

Use apenas letras ASCII, dígitos, underscores e `$`. Nenhum identificador válido deve usar `_` como prefixo ou sufixo.

| Estilo | Categoria |
|--------|-----------|
| `UpperCamelCase` | classe, interface, type alias, enum, decorator, parâmetros de tipo |
| `lowerCamelCase` | variável, parâmetro, função, método, propriedade, alias de módulo |
| `CONSTANT_CASE` | constantes globais, valores de enum |

#### Abreviações

Trate abreviações como palavras completas:

```typescript
// ✅
loadHttpUrl()
parseJsonBody()

// ❌
loadHTTPURL()
parseJSONBody()
```

Exceção: quando exigido por nome de plataforma (ex: `XMLHttpRequest`).

#### Nomenclatura semântica, descritiva e autoexplicativa

A **nomenclatura semântica sempre deve prevalecer** sobre a brevidade. Os nomes **DEVEM** ser **autoexplicativos, coerentes, com clareza e significado definidos**. Evite nomes genéricos (como `data`, `info`, `item`, `val`) ou ambíguos. Não use abreviações ambíguas ou que deletem letras de uma palavra. O objetivo é que o identificador revele imediatamente a sua intenção e conteúdo para um novo leitor.

```typescript
// ✅
const errorMessage = "Something went wrong";
const requestHandler = (req: Request) => { ... };
const activeUsersList = ["joao", "maria"];

// ❌
const errMsg = "Something went wrong";
const rh = (r: Request) => { ... };
const data = ["joao", "maria"];
```

**Exceção:** Variáveis no escopo por 10 linhas ou menos, incluindo argumentos não exportados, **TALVEZ** usar nomes curtos (até uma letra).

#### `$` e Observables

O uso de `$` como sufixo para Observables é uma convenção válida, mas deve ser consistente dentro do projeto.

#### Aliases locais

Ao criar um alias local de um símbolo existente, use o mesmo formato do identificador original:

```typescript
const { Foo } = SomeType;
const CAPACITY = 5;

class Teapot {
  readonly BrewStateEnum = BrewStateEnum;
  readonly CAPACITY = CAPACITY;
}
```

---

### Codificação e Encoding

- Todos os arquivos são codificados em **UTF-8**.
- Para caracteres não-ASCII, use o caractere Unicode diretamente (`μs`, não `\u03bcs`).
- Para caracteres não-imprimíveis, use escapes hex/Unicode com comentário explicativo.
- Sequências de escape especiais (`\n`, `\t`, etc.) devem ser usadas em vez dos equivalentes numéricos.

```typescript
// ✅
const units = "μs";
const output = "\ufeff" + content; // byte order mark

// ❌
const units = "\u03bcs";
```

---

### Formatação

A formatação é **completamente automatizada pelo Biome**. Não discuta posicionamento de vírgulas ou espaços em code reviews — rode `bun biome check --write .` e siga em frente.

Regras aplicadas pelo Biome (não negocie manualmente):

- **Indentação:** 4 espaços.
- **Aspas:** duplas (`"`).
- **Ponto e vírgula:** obrigatório.
- **Vírgula final (trailing comma):** em todos os contextos multi-linha (`"all"`).
- **Parênteses em arrow functions:** sempre (`(x) => x`, não `x => x`).
- **Largura de linha:** 120 caracteres.

Em situações raras de conflito semântico ou literais multilinhas muito longos, use supressão de formatação com justificativa:

```typescript
// biome-ignore format: literal de SQL multilinhas mantido para legibilidade
const query = `
  SELECT u.id, u.name, u.email
  FROM   users u
  WHERE  u.deleted_at IS NULL
    AND  u.role = 'admin'
`;
```

---

### Comentários & Documentação

O ninoTS usa **[TSDoc](https://tsdoc.org/)** — não JSDoc — como padrão de documentação. TSDoc é uma especificação rigorosa sobre como estruturar comentários de documentação em TypeScript, garantindo interoperabilidade entre ferramentas como TypeDoc, API Extractor e editores.

#### TSDoc vs comentários inline

- Use `/** TSDoc */` para documentação pública — comentários que o usuário do código deve ler.
- Use `// comentário de linha` para comentários de implementação interna.

```typescript
/**
 * Cria um servidor HTTP usando as APIs nativas do Bun.
 *
 * @param port - Porta em que o servidor irá escutar.
 * @returns A instância do servidor Bun criada e em execução.
 */
export function createServer(port: number): BunServer {
  // Internamente usa Bun.serve, que é a API nativa de servidor HTTP do Bun
  return Bun.serve({ port, fetch: handleRequest });
}
```

> **Atenção ao formato de `@param`:** TSDoc exige um traço (`-`) separando o nome do parâmetro da sua descrição. `@param port - Descrição`, não `@param port Descrição`.

#### Tags TSDoc utilizadas no ninoTS

| Tag | Uso |
|-----|-----|
| `@param name - desc` | Documenta um parâmetro de função |
| `@returns desc` | Documenta o valor de retorno |
| `@throws {ErrorType} desc` | Documenta exceções lançadas |
| `@remarks` | Informações adicionais além do sumário |
| `@example` | Bloco de exemplo de uso |
| `@typeParam T - desc` | Documenta parâmetros de tipo genérico |
| `@deprecated message` | Marca como obsoleto, com alternativa |
| `@defaultValue value` | Valor padrão de um parâmetro ou propriedade |
| `{@link Symbol}` | Referência inline a outro símbolo |
| `@see` | Referência relacionada (não inline) |
| `@alpha` / `@beta` | Estágio de release do símbolo |
| `@internal` | Indica que o símbolo é interno e não faz parte da API pública |
| `@packageDocumentation` | Documentação de nível de arquivo (no topo, após imports) |

#### Documente todos os exports top-level

Use TSDoc em todos os símbolos exportados do módulo. Evite apenas repetir o nome do parâmetro — adicione informação real:

```typescript
// ❌ Redundante — não adiciona informação além do nome
/**
 * @param port - A porta.
 */

// ✅ Útil — explica restrições e comportamento
/**
 * @param port - Porta TCP. Deve estar no intervalo 1024–65535.
 */
```

#### Estrutura completa de um comentário TSDoc

```typescript
/**
 * Sumário em uma linha — aparece em hovers e índices de documentação.
 *
 * @remarks
 * Descrição detalhada, comportamento esperado, edge cases.
 * Use `@remarks` para tudo que vai além do sumário.
 *
 * @typeParam TRequest - O tipo da requisição a ser processada.
 * @typeParam TResponse - O tipo da resposta produzida.
 *
 * @param handler - Função que processa a requisição e retorna uma resposta.
 * @param options - Opções de configuração do servidor.
 * @param options.port - Porta TCP. Padrão: `3000`.
 * @param options.timeout - Timeout em ms. Padrão: `30000`.
 *
 * @returns A instância do servidor, já em execução.
 *
 * @throws {@link HttpError} Se a porta já estiver em uso.
 * @throws {@link ConfigError} Se `options` for inválido.
 *
 * @example
 * Criando um servidor simples:
 * ```typescript
 * const server = createServer(handleRequest, { port: 8080 });
 * console.log(`Listening on port ${server.port}`);
 * ```
 *
 * @see {@link Router} para configurar rotas antes de iniciar o servidor.
 */
export function createServer<TRequest, TResponse>(
  handler: RequestHandler<TRequest, TResponse>,
  options: ServerOptions,
): BunServer { ... }
```

#### Omita comentários redundantes com TypeScript

Não inclua tipos entre chaves em `@param` ou `@returns` — o TypeScript já carrega essa informação. Não escreva `@implements`, `@enum`, `@private` quando o código já usa as keywords correspondentes:

```typescript
// ❌ — tipo redundante; TypeScript já sabe que é string
/**
 * @param {string} name - O nome.
 * @returns {string} O resultado.
 */

// ✅ — TSDoc puro, sem anotações de tipo
/**
 * Gera uma saudação personalizada para o usuário.
 * @param name - Nome do usuário. Não pode ser vazio.
 * @returns A saudação formatada.
 */
function greet(name: string): string { ... }
```

#### `@deprecated`

Sempre inclua uma mensagem de migração ao deprecar um símbolo:

```typescript
/**
 * @deprecated Use {@link createHttpServer} em vez disso.
 * Será removido na versão 2.0.
 */
export function startServer(port: number): void { ... }
```

#### `@internal`

Use `@internal` para símbolos que fazem parte do pacote mas não devem ser consumidos por usuários externos. Ferramentas como API Extractor os excluem do output público:

```typescript
/**
 * Normaliza o path de uma rota removendo barras duplicadas.
 *
 * @internal
 */
export function normalizePath(path: string): string { ... }
```

#### `@packageDocumentation`

Para documentar um arquivo/módulo inteiro, use `@packageDocumentation` **no primeiro comentário TSDoc do arquivo**, geralmente antes dos imports (ou após, caso haja imports de efeito colateral).

```typescript
/**
 * Módulo de roteamento do ninoTS.
 *
 * @remarks
 * Expõe a classe {@link Router} e os helpers de definição de rotas.
 *
 * @packageDocumentation
 */

import type { RouteHandler } from "./types";
```

#### `{@link}` para referências inline

Use `{@link Symbol}` para referenciar outros símbolos dentro de comentários TSDoc:

```typescript
/**
 * Registra um middleware global.
 *
 * @remarks
 * Middlewares são executados na ordem de registro.
 * Para middlewares específicos de rota, use {@link Router.use}.
 *
 * @see {@link MiddlewareHandler} para a assinatura do callback.
 */
export function use(middleware: MiddlewareHandler): void { ... }
```

#### Não use `@override` TSDoc

TSDoc possui a tag `@override`, mas ela não é verificada pelo compilador. Use a keyword `override` nativa do TypeScript (enforçada por `noImplicitOverride: true` no `tsconfig.json`):

```typescript
// ❌ — tag não verificada pelo compilador
/** @override */
greet() { ... }

// ✅ — keyword verificada pelo compilador
override greet(): string { ... }
```

#### Decorators e TSDoc

Sempre escreva o comentário TSDoc **antes** do decorator:

```typescript
// ✅
/** Controlador HTTP responsável pelos endpoints de usuário. */
@Controller("/users")
export class UserController { ... }

// ❌
@Controller("/users")
/** Controlador HTTP responsável pelos endpoints de usuário. */
export class UserController { ... }
```

#### Parameter properties — comentando com `@param`

Para parameter properties em construtores, use `@param` no TSDoc do construtor:

```typescript
/** Gerenciador de conexões do banco de dados. */
export class DatabaseManager {
  /**
   * @param pool - Pool de conexões configurado.
   * @param logger - Logger para registrar queries e erros.
   */
  constructor(
    private readonly pool: ConnectionPool,
    private readonly logger: Logger,
  ) {}
}
```

---

## Regras de Linguagem

### Zero JavaScript
É terminantemente proibido o uso de arquivos `.js`. O projeto é 100% TypeScript e a flag `"allowJs": false` garante que nenhum código legado ou não tipado passe pelo compilador.

### Variáveis

Sempre use `const` ou `let`. Use `const` por padrão; use `let` somente quando a variável precisar ser reatribuída. **Nunca use `var`.**

```typescript
// ✅
const baseUrl = "https://api.ninots.dev";
let retryCount = 0;

// ❌
var timeout = 5000;
```

Declare uma variável por declaração:

```typescript
// ✅
const a = 1;
const b = 2;

// ❌
let a = 1, b = 2;
```

Variáveis **MUST NOT** ser usadas antes de sua declaração.

---

### Tipos Primitivos & Wrappers

Nunca instancie as classes wrapper dos tipos primitivos (`String`, `Boolean`, `Number`):

```typescript
// ❌
const s = new String("hello");
const b = new Boolean(false);

// ✅
const s = "hello";
const b = false;
```

#### Coerção de tipos

Use `String()`, `Boolean()` (sem `new`), template literals ou `!!` para coerção:

```typescript
const str = String(aNumber);
const bool = !!str;
const display = `Resultado: ${bool}`;
```

Para parsear números, use `Number()` e verifique `NaN`:

```typescript
// ✅
const n = Number(input);
if (isNaN(n)) throw new Error("Entrada inválida: não é um número");

// ❌ — ignora caracteres inválidos no final
const n = parseInt(input, 10);

// ❌ — coerção com unário
const n = +input;
```

Use `parseInt` apenas para strings em bases não-decimais, e sempre verifique o input antes:

```typescript
if (!/^[a-fA-F0-9]+$/.test(hexString)) throw new Error("Hex inválido");
const n = parseInt(hexString, 16);
```

Não use coerção booleana explícita em cláusulas que já têm coerção implícita:

```typescript
// ❌
if (!!foo) { ... }

// ✅
if (foo) { ... }

// ✅ — comparação explícita quando necessária para clareza
if (arr.length > 0) { ... }
```

#### Arrays

Nunca use o construtor `Array()`:

```typescript
// ❌
const a = new Array(2);

// ✅
const a: string[] = [];
a.length = 2;

// ✅ — para array com tamanho e valor inicial
const zeros = Array.from<number>({ length: 5 }).fill(0);
```

Não defina propriedades não-numéricas em arrays. Use `Map` ou `Object` se precisar de chaves.

---

### Classes

#### Visibilidade

Restrinja a visibilidade ao máximo possível. O padrão em TypeScript é `public` — não use o modificador `public` explicitamente exceto em parâmetros de construtor não-readonly:

```typescript
// ❌
class Foo {
  public bar = new Bar();
  constructor(public readonly baz: Baz) {}
}

// ✅
class Foo {
  bar = new Bar();
  constructor(public baz: Baz) {}
}
```

#### Não use `#private`

Use as anotações de visibilidade do TypeScript (`private`, `protected`). Os campos privados com `#` causam regressões de performance e tamanho de emit.

```typescript
// ❌
class Foo {
  #ident = 1;
}

// ✅
class Foo {
  private ident = 1;
}
```

#### `readonly`

Marque propriedades que nunca são reatribuídas fora do construtor com `readonly`:

```typescript
class HttpServer {
  private readonly router: Router;

  constructor(router: Router) {
    this.router = router;
  }
}
```

#### Parameter properties

Use parameter properties do TypeScript para evitar boilerplate:

```typescript
// ❌
class Foo {
  private readonly barService: BarService;

  constructor(barService: BarService) {
    this.barService = barService;
  }
}

// ✅
class Foo {
  constructor(private readonly barService: BarService) {}
}
```

#### Inicialização de campos

Inicialize campos na declaração quando possível:

```typescript
// ❌
class Foo {
  private readonly userList: string[];
  constructor() {
    this.userList = [];
  }
}

// ✅
class Foo {
  private readonly userList: string[] = [];
}
```

#### Construtores

Construtores **MUST** usar parênteses, mesmo sem argumentos:

```typescript
// ❌
const x = new Foo;

// ✅
const x = new Foo();
```

Omita construtores vazios e os que apenas delegam ao pai — ES2015 já fornece o construtor padrão. Mantenha construtores com parameter properties, modificadores ou decorators mesmo se o corpo estiver vazio.

#### Getters e Setters

Use getters/setters com moderação. O getter **MUST** ser uma função pura (sem side effects). Não crie acessores "pass-through" apenas para esconder uma propriedade — torne-a `public` ou `readonly` diretamente.

```typescript
// ✅ — getter com lógica
class Foo {
  private wrappedBar = "";

  get bar(): string {
    return this.wrappedBar || "default";
  }

  set bar(value: string) {
    this.wrappedBar = value.trim();
  }
}

// ❌ — pass-through sem lógica; apenas torne public
class Bar {
  private barInternal = "";
  get bar() { return this.barInternal; }
  set bar(v: string) { this.barInternal = v; }
}
```

#### Declarações de classe e métodos

Declarações de classe **MUST NOT** ser terminadas com ponto e vírgula. Métodos devem ser separados por uma linha em branco:

```typescript
class Foo {
  doThing(): void {
    console.log("A");
  }

  getOtherThing(): number {
    return 4;
  }
}
```

---

### Funções

#### Declarações vs expressões

Prefira declarações de função para funções nomeadas de nível de módulo:

```typescript
// ✅
export function createRouter(): Router { ... }
```

Use arrow functions em expressões, especialmente como callbacks:

```typescript
// ✅
const handler = (req: Request): Response => { ... };
const doubled = [1, 2, 3].map((n) => n * 2);
```

#### Corpo de expressão vs bloco

Use corpo de expressão apenas quando a função é uma transformação simples e de uma linha:

```typescript
// ✅ — expressão clara
const double = (n: number) => n * 2;

// ✅ — bloco necessário para lógica
const process = (n: number) => {
  const result = n * 2;
  return result + 1;
};
```

#### Sem rebinding de `this`

Prefira arrow functions a `.bind(this)`:

```typescript
// ❌
setTimeout(function() { this.doSomething(); }.bind(this), 1000);

// ✅
setTimeout(() => { this.doSomething(); }, 1000);
```

#### Arrow functions como propriedades

Evite definir arrow functions como propriedades de classe — elas criam uma instância por objeto. Use métodos de instância e arrow functions apenas quando precisar capturar `this` em callbacks:

```typescript
// ❌ — cria função para cada instância
class Foo {
  private readonly bar = () => { ... };
}

// ✅ — método compartilhado no prototype
class Foo {
  private bar() { ... }
}
```

#### Semicolons

O uso de ponto e vírgula (`;`) é **estritamente obrigatório** no final de todas as declarações (statements). Embora o Biome os insira automaticamente durante a formatação, você nunca deve omiti-los intencionalmente no código-fonte. O ninoTS rejeita totalmente o uso de ASI (Automatic Semicolon Insertion).

---

### Iteração

#### Iterando objetos

Nunca use `for...in` sem filtro — incluirá propriedades do prototype chain:

```typescript
// ❌
for (const key in obj) { ... }

// ✅
for (const key of Object.keys(obj)) { ... }
for (const [key, value] of Object.entries(obj)) { ... }

// ✅ — com guarda explícita
for (const key in obj) {
  if (!Object.hasOwn(obj, key)) continue;
  // ...
}
```

#### Iterando arrays

Use `for...of` ou `for` com índice. Nunca use `for...in` em arrays:

```typescript
// ❌ — dá índices como strings, não valores
for (const x in arr) { ... }

// ✅
for (const item of arr) { ... }
for (let i = 0; i < arr.length; i++) { ... }
for (const [i, item] of arr.entries()) { ... }
```

Evite `Array.prototype.forEach` — dificulta debug e pode enganar a análise de fluxo do compilador. Prefira `for...of`.

```typescript
// ❌
arr.forEach((item) => { someFn(item); });

// ✅
for (const item of arr) {
  someFn(item);
}
```

---

### Exceções

Sempre use `new Error()`:

```typescript
// ✅
throw new Error("Porta inválida: deve estar entre 1024 e 65535");

// ❌
throw Error("Porta inválida");
```

Crie subclasses de `Error` para erros específicos do domínio:

```typescript
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}
```

---

### Módulos & Imports

#### Paths

Use paths relativos para imports dentro do mesmo projeto lógico ou utilize subpaths configurados (`@/`).

```typescript
// ✅
import { Router } from "./router";
import { createServer } from "@/http";

// ❌ — relativo excessivo
import { Foo } from "../../../../core/foo";
```

#### Named imports vs namespace imports

Prefira named imports para símbolos usados frequentemente. Use namespace imports para módulos grandes com muitos símbolos:

```typescript
// ✅ — named para uso frequente
import { describe, it, expect } from "bun:test";

// ✅ — namespace para módulo grande
import * as path from "node:path";
```

#### Renomeação de imports

Renomeie imports apenas para evitar colisões ou quando o nome original é ambíguo:

```typescript
import { createServer as createHttpServer } from "./http";
import { createServer as createWsServer } from "./websocket";
```

#### `import type` e `export type`

Use `import type` quando o símbolo importado é usado exclusivamente como tipo:

```typescript
import type { Request, Response } from "./types";
import { Router } from "./router";

// Inline
import { type RequestHandler, Server } from "./http";
```

Use `export type` ao re-exportar tipos:

```typescript
export type { RequestHandler } from "./http";
```

#### Proibições

Não use `namespace` (exceto para interoperabilidade com libs externas), `require()`, ou `/// <reference>`:

```typescript
// ❌
namespace MyApp { ... }
import x = require("foo");
/// <reference path="..." />

// ✅
import { foo } from "./foo";
```

---

### Exports

Use **named exports** em todo o código. Nunca use default exports:

```typescript
// ✅
export class Router { ... }
export function createServer(port: number): Server { ... }
export const VERSION = "1.0.0";

// ❌
export default class Router { ... }
```

#### Visibilidade de exports

Exporte apenas o que é usado fora do módulo. Minimize a superfície pública da API.

#### Exports mutáveis

Não use `export let`. Se precisar de um binding mutável externamente, use uma função getter explícita:

```typescript
// ❌
export let currentPort = 3000;

// ✅
let currentPort = 3000;
export function getCurrentPort(): number {
  return currentPort;
}
```

#### Container classes

Não crie classes container com métodos/propriedades estáticos apenas para namespacing. Use exports individuais:

```typescript
// ❌
export class HttpUtils {
  static readonly DEFAULT_PORT = 3000;
  static parseUrl(url: string) { ... }
}

// ✅
export const DEFAULT_PORT = 3000;
export function parseUrl(url: string) { ... }
```

---

## Sistema de Tipos

### Inferência de Tipos

Confie na inferência do TypeScript — não declare tipos onde são óbvios:

```typescript
// ❌ — redundante
const port: number = 3000;
const routes: string[] = [];

// ✅
const port = 3000;
const routes: string[] = []; // aqui o tipo é necessário para inicialização vazia
```

#### Tipos de retorno

Declare o tipo de retorno em funções exportadas e métodos públicos — melhora a legibilidade e documenta a API:

```typescript
// ✅
export function createServer(port: number): BunServer {
  return Bun.serve({ port, fetch: handleRequest });
}

// Para funções internas simples, inferência é aceitável
const double = (n: number) => n * 2;
```

---

### null vs undefined

Use `undefined` para ausência de valor. Use `null` somente quando explicitamente necessário para interoperabilidade com APIs externas que retornam `null`.

```typescript
// ✅
interface UserOptions {
  timeout?: number; // undefined por padrão
}

// ✅ — null apenas quando a API externa exige
function findUser(id: string): User | null { ... }
```

Não crie type aliases para tipos anuláveis — torna o código menos legível:

```typescript
// ❌
type MaybeUser = User | null | undefined;

// ✅ — seja explícito no uso
function getUser(id: string): User | undefined { ... }
```

---

### Interfaces vs Type Aliases

Use `interface` para descrever a forma de objetos e contratos de classes. Use `type` para union types, intersection types, tipos mapeados, condicionais e aliases de primitivos:

```typescript
// ✅ — interface para contrato de objeto
interface RequestHandler {
  handle(req: Request): Promise<Response>;
}

// ✅ — type para composição
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Middleware = (req: Request, next: () => Promise<Response>) => Promise<Response>;
type ReadonlyRecord<K extends string, V> = Readonly<Record<K, V>>;
```

Não use prefixo `I` em interfaces (`IRouter` → `Router`). Nomeie interfaces pelo que elas expressam:

```typescript
// ❌
interface IRouter { ... }

// ✅
interface Router { ... }
interface RouterConfig { ... }
interface Serializable { ... }
```

---

### any, unknown e never

Evite `any`. Prefira `unknown` para valores de tipo desconhecido e faça narrowing explícito:

```typescript
// ❌
function parse(input: any): any { ... }

// ✅
function parse(input: unknown): ParsedResult {
  if (typeof input !== "string") throw new Error("Esperado string");
  return JSON.parse(input) as ParsedResult;
}
```

Use `never` para representar estados impossíveis e garantir exhaustiveness em switches:

```typescript
function assertNever(value: never): never {
  throw new Error(`Caso não tratado: ${JSON.stringify(value)}`);
}

function handleMethod(method: HttpMethod): string {
  switch (method) {
    case "GET": return "read";
    case "POST": return "create";
    // ... outros casos
    default: return assertNever(method); // TypeScript garante que todos os casos foram tratados
  }
}
```

Quando `any` for absolutamente necessário (ex: interoperabilidade interna do Bun), supressione com comentário:

```typescript
// biome-ignore lint/suspicious/noExplicitAny: API interna do Bun sem tipagem pública
function bindSocket(handle: any): void { ... }
```

---

### Generics

Parâmetros de tipo **MAY** usar uma única letra maiúscula (`T`, `K`, `V`) ou `UpperCamelCase`. Prefira nomes descritivos quando o contexto não é óbvio:

```typescript
// ✅ — T é suficientemente claro em Array
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// ✅ — nomes descritivos para tipos complexos
function mapValues<TKey extends string, TValue, TResult>(
  record: Record<TKey, TValue>,
  transform: (value: TValue, key: TKey) => TResult,
): Record<TKey, TResult> { ... }
```

Evite generics que só aparecem no tipo de retorno — geralmente indicam design problemático:

```typescript
// ❌ — T não é inferido; o caller precisa passar explicitamente
function parse<T>(): T { ... }

// ✅ — T é inferido a partir do parâmetro
function parse<T>(schema: Schema<T>, input: unknown): T { ... }
```

---

### Enums

Prefira `const enum` para enums de valores simples usados somente em TypeScript — evita emit de JavaScript desnecessário:

```typescript
// ✅ — para enums internos
const enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  InternalError = 500,
}

// ✅ — enum regular quando o objeto precisa existir em runtime
enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
}
```

Use `CONSTANT_CASE` para valores de enum. Não use enums para namespacing — use objetos `const` ou módulos.

---

## Recursos do TypeScript 6.x+

O ninoTS requer **TypeScript 6.x ou superior**. Aproveite as funcionalidades modernas:

### `tsconfig.json` recomendado

```json
{
  "compilerOptions": {
    // Ambiente e features modernas
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "types": ["bun"],

    // Modo bundler (necessário para Bun)
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    // Boas práticas obrigatórias
    "strict": true,
    "allowJs": false,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // Extras obrigatórios no ninoTS
    "exactOptionalPropertyTypes": true,
    "isolatedDeclarations": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

> **`"types": ["bun"]`** — obrigatório no TypeScript 6+. A partir desta versão, o campo `types` não auto-descobre pacotes `@types/*` automaticamente — é necessário declarar explicitamente. Sem isso, o compilador não reconhecerá `Bun`, `Request`, `Response` e outros globais do runtime.
>
> Instale os tipos com: `bun add -d @types/bun`

> **`"noEmit": true`** — o Bun executa TypeScript diretamente, sem transpilação prévia. O `tsc` é usado apenas para verificação de tipos (`bun tsc --noEmit` ou via editor). Nunca configure o projeto para emitir arquivos `.js` a partir do `tsc`.

### `override` explícito

Com `noImplicitOverride: true`, sempre declare `override` ao sobrescrever métodos:

```typescript
class BaseServer {
  protected handleError(error: Error): void { ... }
}

class HttpServer extends BaseServer {
  override protected handleError(error: Error): void {
    super.handleError(error);
    // ...
  }
}
```

### `verbatimModuleSyntax`

Com `verbatimModuleSyntax: true`, use `import type` e `export type` corretamente para todos os imports que são somente tipo:

```typescript
import type { User } from "./models";
import { createUser } from "./services";
```

### `noUncheckedIndexedAccess`

Com esta opção ativa, acessos a arrays e index signatures retornam `T | undefined`. Sempre trate o caso undefined:

```typescript
const routes: string[] = getRoutes();

// ❌ — não trata undefined
const first = routes[0].toUpperCase();

// ✅
const first = routes[0]?.toUpperCase() ?? "";
```

### `exactOptionalPropertyTypes`

Propriedades opcionais não aceitam `undefined` explícito — são simplesmente ausentes ou presentes:

```typescript
interface Config {
  timeout?: number;
}

// ❌ — com exactOptionalPropertyTypes, isso é erro
const config: Config = { timeout: undefined };

// ✅
const config: Config = {};
const configWithTimeout: Config = { timeout: 5000 };
```

### `isolatedDeclarations`

Todos os exports devem ter tipos anotados explicitamente (necessário para builds incrementais e ferramentas de bundling):

```typescript
// ❌ — tipo inferido não exportável com isolatedDeclarations
export const server = createServer(3000);

// ✅
export const server: BunServer = createServer(3000);
export function createServer(port: number): BunServer { ... }
```

### Spread de tipos

TypeScript 6.x+ melhora a ergonomia de spread em tipos. Use-o para composição:

```typescript
type BaseConfig = { port: number; host: string };
type TlsConfig = { cert: string; key: string };
type SecureConfig = BaseConfig & TlsConfig;
```

---

## Práticas Específicas: Bun Nativas

O ambiente de execução principal diferencia o ninoTS das bibliotecas convencionais.

- **`this` context-sensitivity (TS 6.x)**: Métodos que não utilizam `this` recebem inferência muito mais poderosa no TS 6.0+. Prefira não forçar tipagem em objetos que implementam callbacks; deixe o compilador atuar.
- **APIs Nativas do Bun**:
  - Para leitura/escrita de arquivos, utilize `Bun.file()` ao invés do módulo `fs` nativo do Node.js.
  - Para testes, utilize estritamente `bun:test`. Não importaremos Jest, Mocha ou afins.
  - O uso do `bun:sqlite` deve seguir a regra de injeção de dependência e sanitização para prevenir SQL Injection, usando o template helper tag `` SQL`...` `` (se disponível/aplicável) ou parameterized queries.

---

## Observabilidade e Logs

Nós não usamos *console.log* espalhados para debugar fluxo de código. Baseados na filosofia de que ["logs tradicionais mentem"](https://loggingsucks.com/), adotamos o padrão de **Wide Events (Canonical Log Lines)**.

O objetivo não é fazer *string search* no momento de um incidente, mas rodar analytics nos dados de produção.

- **Um Evento por Request/Ação**: Em vez de disparar 15 logs isolados durante o ciclo de vida de uma request, construa um único objeto de contexto (o *Wide Event*) e emita-o apenas **uma vez**, no final da request.
- **Alta Dimensionalidade e Cardinalidade**: Injete o máximo de contexto de negócio possível (IDs de usuário, tenant, flags ativas, versão do deploy, duração em ms, itens no carrinho).
- **Tratamento no Middleware**: Inicialize o evento no middleware mais externo, adicione metadados em cada etapa (handler, validações, serviços externos) e registre (log) no bloco `finally` do request.

```typescript
// ✅ Correto: Construção de um Wide Event
export async function checkoutHandler(ctx) {
    const wideEvent = ctx.get("wideEvent");
    const start = Date.now();
    
    try {
        // ... processamento do negócio
        wideEvent.user_subscription = "premium";
        wideEvent.cart_items = 3;
        wideEvent.status_code = 200;
    } catch (error) {
        wideEvent.status_code = 500;
        wideEvent.error_type = error.name;
        throw error;
    } finally {
        wideEvent.duration_ms = Date.now() - start;
        logger.info(wideEvent); // Emissão única!
    }
}
```

- **Tail Sampling (Amostragem Inteligente)**: Para não explodir os custos de logging com 50 propriedades por requisição, implemente amostragem na saída: armazene **100% dos erros**, **100% das requisições lentas** e **100% de usuários VIP/flagged**, mas aplique *random sampling* (ex: 5%) em requisições de sucesso rápido.

---

## Consistência

Acima de tudo, seja **consistente**. Ao modificar código existente, siga os padrões do arquivo em questão, mesmo que difiram deste guia em detalhes menores. A consistência local supera a conformidade teórica.

Ao introduzir padrões novos em uma área do codebase, aplique-os de forma abrangente naquela área em um único commit/PR.

---

## Referências

- [ts.dev/style — TypeScript Style Guide](https://ts.dev/style/)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [TypeScript 6.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [TSDoc — Especificação de comentários TypeScript](https://tsdoc.org/)
- [Biome — Formatter & Linter](https://biomejs.dev/)
- [Biome Schema 2.4.13](https://biomejs.dev/schemas/2.4.13/schema.json)
- [Bun — TypeScript](https://bun.com/docs/typescript)
- [Bun — TypeScript 6 e 7](https://bun.com/docs/typescript-6)
- [ninoTS Framework](https://github.com/nino-ts)

---

*Mantido por [@joaovjo](https://github.com/joaovjo) e [@vgeruso](https://github.com/vgeruso) — [pandowLABS](https://github.com/pandowlabs)*  
*Licença: [MIT](https://github.com/nino-ts/nino/blob/main/LICENSE)*
