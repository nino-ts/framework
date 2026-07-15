/**
 * Schema fluente para validação de strings.
 *
 * @packageDocumentation
 * Fornece uma API fluente type-safe para validação de strings
 * com suporte a email, URL, UUID, minLength, maxLength e mais.
 */
import { BaseSchema } from "./BaseSchema";
/**
 * Schema fluente para validação de strings.
 *
 * @example
 * const schema = v.string().required().email();
 * const result = schema.validate('user@example.com');
 * // { success: true, value: 'user@example.com' }
 *
 * @example
 * const schema = v.string().min(3).max(50);
 * const result = schema.validate('John');
 * // { success: true, value: 'John' }
 */
export declare class StringSchema extends BaseSchema<string, string> {
    /**
     * Cria uma nova instância de StringSchema.
     */
    constructor();
    /**
     * Marca a string como obrigatória (não vazia).
     * Adiciona validação de required específica para strings.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().required()
     */
    required(): this;
    /**
     * Valida se a string é um email válido.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().email()
     */
    email(): this;
    /**
     * Valida o comprimento mínimo da string.
     *
     * @param length - Comprimento mínimo
     * @returns Este schema para chaining
     * @example
     * v.string().min(3)
     */
    min(length: number): this;
    /**
     * Valida o comprimento máximo da string.
     *
     * @param length - Comprimento máximo
     * @returns Este schema para chaining
     * @example
     * v.string().max(255)
     */
    max(length: number): this;
    /**
     * Valida se a string é um UUID válido.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().uuid()
     */
    uuid(): this;
    /**
     * Valida se a string é uma URL válida.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().url()
     */
    url(): this;
    /**
     * Valida se a string contém apenas letras.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().alpha()
     */
    alpha(): this;
    /**
     * Valida se a string contém apenas letras e números.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().alphaNum()
     */
    alphaNum(): this;
    /**
     * Valida se a string contém apenas letras, números, dashes e underscores.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().alphaDash()
     */
    alphaDash(): this;
    /**
     * Valida se a string é uma URL ativa.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().activeUrl()
     */
    activeUrl(): this;
    /**
     * Valida se a string tem exatamente N dígitos.
     *
     * @param length - Número exato de dígitos
     * @returns Este schema para chaining
     * @example
     * v.string().digits(5)
     */
    digits(length: number): this;
    /**
     * Valida se a string tem entre X e Y dígitos.
     *
     * @param min - Mínimo de dígitos
     * @param max - Máximo de dígitos
     * @returns Este schema para chaining
     * @example
     * v.string().digitsBetween(3, 5)
     */
    digitsBetween(min: number, max: number): this;
    /**
     * Valida se a string é um endereço IP válido.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().ip()
     */
    ip(): this;
    /**
     * Valida se o valor está em uma lista de valores permitidos.
     *
     * @param values - Valores permitidos
     * @returns Este schema para chaining
     * @example
     * v.string().in(['admin', 'user'])
     */
    in(...values: unknown[]): this;
    /**
     * Valida se o valor NÃO está em uma lista de valores proibidos.
     *
     * @param values - Valores proibidos
     * @returns Este schema para chaining
     * @example
     * v.string().notIn(['banned', 'spam'])
     */
    notIn(...values: unknown[]): this;
    /**
     * Valida se a string está vazia.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().empty()
     */
    empty(): this;
    /**
     * Valida se a string não está vazia.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().nonEmpty()
     */
    nonEmpty(): this;
    /**
     * Valida se a string corresponde a um padrão regex.
     *
     * @param pattern - Expressão regular ou string de padrão
     * @param message - Mensagem de erro personalizada (opcional)
     * @returns Este schema para chaining
     * @example
     * v.string().regex(/^[A-Z]+$/)
     */
    regex(pattern: RegExp, message?: string): this;
    /**
     * Valida se a string começa com um prefixo específico.
     *
     * @param prefix - Prefixo esperado
     * @returns Este schema para chaining
     * @example
     * v.string().startsWith('https://')
     */
    startsWith(prefix: string): this;
    /**
     * Valida se a string termina com um sufixo específico.
     *
     * @param suffix - Sufixo esperado
     * @returns Este schema para chaining
     * @example
     * v.string().endsWith('.com')
     */
    endsWith(suffix: string): this;
    /**
     * Valida se a string contém uma substring específica.
     *
     * @param substring - Substring esperada
     * @returns Este schema para chaining
     * @example
     * v.string().contains('admin')
     */
    contains(substring: string): this;
    /**
     * Transforma a string para lowercase.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().lowercase()
     */
    lowercase(): this;
    /**
     * Transforma a string para uppercase.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().uppercase()
     */
    uppercase(): this;
    /**
     * Remove espaços em branco do início e fim da string.
     *
     * @returns Este schema para chaining
     * @example
     * v.string().trim()
     */
    trim(): this;
}
