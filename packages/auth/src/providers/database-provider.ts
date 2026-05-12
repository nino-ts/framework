import type { Authenticatable } from "@/contracts/authenticatable";
import type { ConnectionInterface } from "@/contracts/connection-interface";
import type { Hasher } from "@/contracts/hasher";
import type { UserProvider } from "@/contracts/user-provider";

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
    userModel?: new (
        data: Record<string, unknown>,
    ) => Authenticatable;
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
export class DatabaseUserProvider implements UserProvider {
    private readonly table: string;
    private readonly allowedCredentialColumns: Record<string, string> = {
        email: "email",
        id: "id",
        name: "name",
        username: "username",
    };
    private readonly userModel: new (
        data: Record<string, unknown>,
    ) => Authenticatable;

    /**
     * Cria uma nova instância do DatabaseUserProvider.
     *
     * @param connection - Conexão com o banco de dados
     * @param hasher - Implementação de hash para validação de senhas
     * @param table - Nome da tabela (padrão: "users")
     * @param userModel - Classe do modelo de usuário (padrão: GenericUser)
     */
    constructor(
        private readonly connection: ConnectionInterface,
        private readonly hasher: Hasher,
        table?: string,
        userModel?: new (data: Record<string, unknown>) => Authenticatable,
    ) {
        this.table = table ?? "users";
        this.userModel = userModel ?? GenericUser;
    }

    /**
     * Recupera um usuário pelo seu identificador único.
     *
     * @param id - O identificador único do usuário
     * @returns O usuário encontrado ou null se não existir
     */
    async retrieveById(id: string | number): Promise<Authenticatable | null> {
        const results = await this.connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);

        if (results.length === 0) {
            return null;
        }

        return new this.userModel(results[0] as Record<string, unknown>);
    }

    /**
     * Recupera um usuário pelo identificador e token "remember me".
     *
     * @param id - O identificador único do usuário
     * @param token - O token "remember me"
     * @returns O usuário encontrado ou null se não existir ou token inválido
     */
    async retrieveByToken(id: string | number, token: string): Promise<Authenticatable | null> {
        const results = await this.connection.query(`SELECT * FROM ${this.table} WHERE id = ? AND remember_token = ?`, [
            id,
            token,
        ]);

        if (results.length === 0) {
            return null;
        }

        return new this.userModel(results[0] as Record<string, unknown>);
    }

    /**
     * Recupera um usuário apenas pelo token "remember me".
     *
     * @param token - O token "remember me"
     * @returns O usuário encontrado ou null se não existir
     */
    async retrieveByTokenOnly(token: string): Promise<Authenticatable | null> {
        const results = await this.connection.query(`SELECT * FROM ${this.table} WHERE remember_token = ?`, [token]);

        if (results.length === 0) {
            return null;
        }

        return new this.userModel(results[0] as Record<string, unknown>);
    }

    /**
     * Recupera um usuário pelas credenciais fornecidas.
     *
     * @param credentials - Credenciais para busca (ex: { email: "test@example.com" })
     * @returns O usuário encontrado ou null se não existir
     */
    async retrieveByCredentials(credentials: Record<string, unknown>): Promise<Authenticatable | null> {
        const criteria: string[] = [];
        const params: unknown[] = [];

        for (const [key, value] of Object.entries(credentials)) {
            if (key === "password") {
                continue;
            }

            const column = this.allowedCredentialColumns[key];

            if (!column) {
                throw new Error(`Unsupported credential field: ${key}`);
            }

            criteria.push(`${column} = ?`);
            params.push(value);
        }

        if (criteria.length === 0) {
            return null;
        }

        const sql = `SELECT * FROM ${this.table} WHERE ${criteria.join(" AND ")} LIMIT 1`;
        const results = await this.connection.query(sql, params);

        if (results.length === 0) {
            return null;
        }

        return new this.userModel(results[0] as Record<string, unknown>);
    }

    /**
     * Valida as credenciais de um usuário.
     *
     * @param user - O usuário a ser validado
     * @param credentials - Credenciais contendo a senha para validação
     * @returns True se as credenciais forem válidas, false caso contrário
     */
    async validateCredentials(user: Authenticatable, credentials: Record<string, unknown>): Promise<boolean> {
        const hash = user.getAuthPassword();
        const passwordValue = credentials.password;
        const password = typeof passwordValue === "string" ? passwordValue : undefined;

        if (!hash || !password) {
            return false;
        }

        return this.hasher.verify(password, hash);
    }

    /**
     * Atualiza o token "remember me" do usuário no banco de dados.
     *
     * @param user - O usuário cujo token será atualizado
     * @param token - O novo token "remember me"
     */
    async updateRememberToken(user: Authenticatable, token: string): Promise<void> {
        await this.connection.query(`UPDATE ${this.table} SET remember_token = ? WHERE id = ?`, [
            token,
            user.getAuthIdentifier(),
        ]);
    }
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
export class GenericUser implements Authenticatable {
    /**
     * Cria uma nova instância do GenericUser.
     *
     * @param attributes - Atributos do usuário vindos do banco de dados
     */
    constructor(private attributes: GenericUserAttributes) {}

    /**
     * Obtém o nome da coluna do identificador único.
     *
     * @returns O nome da coluna do identificador
     */
    getAuthIdentifierName(): string {
        return "id";
    }

    /**
     * Obtém o identificador único do usuário.
     *
     * @returns O identificador único
     */
    getAuthIdentifier(): string | number {
        return this.attributes.id as string | number;
    }

    /**
     * Obtém a senha hasheada do usuário.
     *
     * @returns A senha hasheada ou string vazia se não existir
     */
    getAuthPassword(): string {
        return this.attributes.password ?? "";
    }

    /**
     * Obtém o nome da coluna da senha.
     *
     * @returns O nome da coluna da senha
     */
    getAuthPasswordName(): string {
        return "password";
    }

    /**
     * Obtém o token "remember me" do usuário.
     *
     * @returns O token ou null se não existir
     */
    getRememberToken(): string | null {
        return this.attributes.remember_token ?? null;
    }

    /**
     * Define o token "remember me" do usuário.
     *
     * @param value - O novo token "remember me"
     */
    setRememberToken(value: string | null): void {
        this.attributes.remember_token = value;
    }

    /**
     * Obtém o nome da coluna do token "remember me".
     *
     * @returns O nome da coluna do token
     */
    getRememberTokenName(): string {
        return "remember_token";
    }

    getId(): string | number {
        return this.attributes.id as string | number;
    }

    getEmail(): string | null {
        return this.attributes.email ?? null;
    }

    getName(): string | null {
        return this.attributes.name ?? null;
    }

    getPassword(): string | null {
        return this.attributes.password ?? null;
    }
}
