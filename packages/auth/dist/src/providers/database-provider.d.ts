import type { Authenticatable } from "../contracts/authenticatable";
import type { ConnectionInterface } from "../contracts/connection-interface";
import type { Hasher } from "../contracts/hasher";
import type { UserProvider } from "../contracts/user-provider";
/**
 * Configuração do DatabaseUserProvider.
 *
 * @interface DatabaseUserProviderConfig
 */
export interface DatabaseUserProviderConfig {
    /**
     * Nome da tabela no banco de dados.
     */
    table?: string;
    /**
     * Classe do modelo de usuário.
     */
    userModel?: new (data: Record<string, unknown>) => Authenticatable;
}
interface GenericUserAttributes {
    id?: string | number;
    password?: string;
    remember_token?: string | null;
    email?: string | null;
    name?: string | null;
    [key: string]: unknown;
}
/**
 * Provedor de usuários baseado em banco de dados.
 *
 * Implementa a interface UserProvider para recuperar e validar usuários
 * a partir de um banco de dados relacional.
 *
 * @example
 * ```typescript
 * const provider = new DatabaseUserProvider(connection, hasher, "users");
 * const user = await provider.retrieveById(1);
 * ```
 */
export declare class DatabaseUserProvider implements UserProvider {
    private readonly connection;
    private readonly hasher;
    private readonly table;
    private readonly allowedCredentialColumns;
    private readonly userModel;
    /**
     * Cria uma nova instância do DatabaseUserProvider.
     *
     * @param connection - Conexão com o banco de dados
     * @param hasher - Implementação de hash para validação de senhas
     * @param table - Nome da tabela (padrão: "users")
     * @param userModel - Classe do modelo de usuário (padrão: GenericUser)
     */
    constructor(connection: ConnectionInterface, hasher: Hasher, table?: string, userModel?: new (data: Record<string, unknown>) => Authenticatable);
    /**
     * Recupera um usuário pelo seu identificador único.
     *
     * @param id - O identificador único do usuário
     * @returns O usuário encontrado ou null se não existir
     */
    retrieveById(id: string | number): Promise<Authenticatable | null>;
    /**
     * Recupera um usuário pelo identificador e token "remember me".
     *
     * @param id - O identificador único do usuário
     * @param token - O token "remember me"
     * @returns O usuário encontrado ou null se não existir ou token inválido
     */
    retrieveByToken(id: string | number, token: string): Promise<Authenticatable | null>;
    /**
     * Recupera um usuário apenas pelo token "remember me".
     *
     * @param token - O token "remember me"
     * @returns O usuário encontrado ou null se não existir
     */
    retrieveByTokenOnly(token: string): Promise<Authenticatable | null>;
    /**
     * Recupera um usuário pelas credenciais fornecidas.
     *
     * @param credentials - Credenciais para busca (ex: { email: "test@example.com" })
     * @returns O usuário encontrado ou null se não existir
     */
    retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null>;
    /**
     * Valida as credenciais de um usuário.
     *
     * @param user - O usuário a ser validado
     * @param credentials - Credenciais contendo a senha para validação
     * @returns True se as credenciais forem válidas, false caso contrário
     */
    validateCredentials(user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean>;
    /**
     * Atualiza o token "remember me" do usuário no banco de dados.
     *
     * @param user - O usuário cujo token será atualizado
     * @param token - O novo token "remember me"
     */
    updateRememberToken(user: Authenticatable, token: string): Promise<void>;
}
/**
 * Usuário genérico para encapsular resultados do banco de dados.
 *
 * Implementa a interface Authenticatable para fornecer acesso
 * aos atributos do usuário de forma padronizada.
 *
 * @example
 * ```typescript
 * const user = new GenericUser({ id: 1, email: "test@example.com", name: "Test" });
 * console.log(user.getEmail()); // "test@example.com"
 * ```
 */
export declare class GenericUser implements Authenticatable {
    private attributes;
    /**
     * Cria uma nova instância do GenericUser.
     *
     * @param attributes - Atributos do usuário vindos do banco de dados
     */
    constructor(attributes: GenericUserAttributes);
    /**
     * Obtém o nome da coluna do identificador único.
     *
     * @returns O nome da coluna do identificador
     */
    getAuthIdentifierName(): string;
    /**
     * Obtém o identificador único do usuário.
     *
     * @returns O identificador único
     */
    getAuthIdentifier(): string | number;
    /**
     * Obtém a senha hasheada do usuário.
     *
     * @returns A senha hasheada ou string vazia se não existir
     */
    getAuthPassword(): string;
    /**
     * Obtém o nome da coluna da senha.
     *
     * @returns O nome da coluna da senha
     */
    getAuthPasswordName(): string;
    /**
     * Obtém o token "remember me" do usuário.
     *
     * @returns O token ou null se não existir
     */
    getRememberToken(): string | null;
    /**
     * Define o token "remember me" do usuário.
     *
     * @param value - O novo token "remember me"
     */
    setRememberToken(value: string | null): void;
    /**
     * Obtém o nome da coluna do token "remember me".
     *
     * @returns O nome da coluna do token
     */
    getRememberTokenName(): string;
    getId(): string | number;
    getEmail(): string | null;
    getName(): string | null;
    getPassword(): string | null;
}
export {};
