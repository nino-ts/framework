/**
 * Tradutor de Mensagens de Validação.
 *
 * @packageDocumentation
 * Fornece tradução de mensagens de erro com suporte a placeholders.
 */

import type { Locale, ValidationMessages } from './locales';
import { locales, defaultLocale } from './locales';

/**
 * Opções para tradução.
 */
export interface TranslateOptions {
  /**
   * Locale para tradução.
   * @default 'pt-BR'
   */
  locale?: Locale;

  /**
   * Valores para substituir placeholders.
   * @example
   * { field: 'email', min: 3, max: 255 }
   */
  attributes?: Record<string, unknown>;
}

/**
 * Tradutor de mensagens de validação.
 *
 * @example
 * // Uso básico
 * const translator = new Translator();
 * const message = translator.translate('required', { field: 'email' });
 * // 'O campo email é obrigatório.'
 *
 * @example
 * // Com locale diferente
 * const translator = new Translator('en');
 * const message = translator.translate('required', { field: 'email' });
 * // 'The email field is required.'
 */
export class Translator {
  /**
   * Locale atual.
   */
  private currentLocale: Locale;

  /**
   * Cria uma nova instância do Translator.
   *
   * @param locale - Locale padrão (opcional)
   */
  public constructor(locale: Locale = defaultLocale) {
    this.currentLocale = locale;
  }

  /**
   * Define o locale atual.
   *
   * @param locale - Novo locale
   * @returns Este tradutor para chaining
   *
   * @example
   * translator.setLocale('en').translate('required', { field: 'email' });
   */
  public setLocale(locale: Locale): this {
    this.currentLocale = locale;
    return this;
  }

  /**
   * Obtém o locale atual.
   *
   * @returns Locale atual
   */
  public getLocale(): Locale {
    return this.currentLocale;
  }

  /**
   * Traduz uma mensagem de erro.
   *
   * @param key - Chave da mensagem (código de erro)
   * @param options - Opções de tradução
   * @returns Mensagem traduzida
   *
   * @example
   * translator.translate('required', { field: 'email' });
   * // 'O campo email é obrigatório.'
   *
   * @example
   * translator.translate('min_length', { field: 'password', min: 8 });
   * // 'O campo password deve ter pelo menos 8 caracteres.'
   */
  public translate(key: keyof ValidationMessages, options?: TranslateOptions): string {
    const locale = options?.locale ?? this.currentLocale;
    const attributes = options?.attributes ?? {};
    const messages = locales[locale] ?? locales[defaultLocale];
    const template = messages[key] ?? messages.required;

    return this.replacePlaceholders(template, attributes);
  }

  /**
   * Traduz múltiplas mensagens de erro.
   *
   * @param keys - Array de chaves de mensagem
   * @param options - Opções de tradução
   * @returns Mapa de mensagens traduzidas
   *
   * @example
   * translator.translateMany(['required', 'email'], { field: 'email' });
   * // { required: 'O campo email é obrigatório.', email: 'O campo email deve ser um email válido.' }
   */
  public translateMany(keys: (keyof ValidationMessages)[], options?: TranslateOptions): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key of keys) {
      result[key] = this.translate(key, options);
    }

    return result;
  }

  /**
   * Obtém todas as mensagens de um locale.
   *
   * @param locale - Locale (opcional, usa o atual se não fornecido)
   * @returns Todas as mensagens do locale
   */
  public getMessages(locale?: Locale): ValidationMessages {
    const targetLocale = locale ?? this.currentLocale;
    return locales[targetLocale] ?? locales[defaultLocale];
  }

  /**
   * Registra um novo locale.
   *
   * @param locale - Nome do locale
   * @param messages - Mensagens do locale
   *
   * @example
   * translator.registerLocale('fr', { required: 'Le champ :field est requis.', ... });
   */
  public registerLocale(locale: string, messages: Partial<ValidationMessages>): void {
    locales[locale] = {
      ...locales[defaultLocale],
      ...messages,
    } as ValidationMessages;
  }

  /**
   * Substitui placeholders em uma mensagem.
   *
   * @param template - Template da mensagem
   * @param attributes - Atributos para substituição
   * @returns Mensagem com placeholders substituídos
   *
   * @private
   */
  private replacePlaceholders(template: string, attributes: Record<string, unknown>): string {
    return template.replace(/:(\w+)/g, (_, key) => {
      const value = attributes[key];

      if (value === undefined || value === null) {
        return `:${key}`;
      }

      return String(value);
    });
  }
}

/**
 * Instância global do tradutor.
 */
export const translator = new Translator();

/**
 * Função utilitária para traduzir mensagens.
 *
 * @param key - Chave da mensagem
 * @param options - Opções de tradução
 * @returns Mensagem traduzida
 *
 * @example
 * t('required', { field: 'email' });
 * // 'O campo email é obrigatório.'
 */
export function t(key: keyof ValidationMessages, options?: TranslateOptions): string {
  return translator.translate(key, options);
}

/**
 * Define o locale global.
 *
 * @param locale - Novo locale
 *
 * @example
 * setLocale('en');
 * t('required', { field: 'email' });
 * // 'The email field is required.'
 */
export function setLocale(locale: Locale): void {
  translator.setLocale(locale);
}

/**
 * Obtém o locale global atual.
 *
 * @returns Locale atual
 */
export function getLocale(): Locale {
  return translator.getLocale();
}
