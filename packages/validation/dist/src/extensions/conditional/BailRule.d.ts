/**
 * Regra para validação: para na primeira falha.
 *
 * @packageDocumentation
 * Marca o schema para parar a validação no primeiro erro encontrado.
 * Esta regra é um marcador que deve ser interpretado pelo schema pai.
 */
import type { RuleResult, StandardSchemaRule, ValidationContext } from "../../contracts/StandardSchemaRule";
/**
 * Regra para marcar parada na primeira falha.
 *
 * @example
 * // Para validação no primeiro erro
 * const rule = new BailRule();
 */
export declare class BailRule implements StandardSchemaRule<unknown> {
    /**
     * Nome da regra.
     */
    readonly name = "bail";
    /**
     * Indica que a validação deve parar neste ponto.
     */
    readonly shouldBail = true;
    /**
     * Executa a validação da regra.
     *
     * @param _context - Contexto contendo o valor e metadados da validação
     * @returns Resultado da validação (sempre sucesso, é um marcador)
     */
    validate(_context: ValidationContext<unknown>): RuleResult;
}
