/**
 * Módulo de Internacionalização (i18n) do @ninots/validation.
 *
 * @packageDocumentation
 * Sistema de tradução de mensagens de erro com suporte a múltiplos idiomas.
 *
 * @example
 * // Uso básico
 * import { t, setLocale } from '@ninots/validation/i18n';
 *
 * setLocale('pt-BR');
 * const message = t('required', { field: 'email' });
 * // 'O campo email é obrigatório.'
 *
 * @example
 * // Mudar para inglês
 * setLocale('en');
 * const message = t('required', { field: 'email' });
 * // 'The email field is required.'
 */

export {
  Translator,
  translator,
  t,
  setLocale,
  getLocale,
  type TranslateOptions,
} from './Translator';

export {
  locales,
  defaultLocale,
  ptBR,
  en,
  es,
  type Locale,
  type ValidationMessages,
  type LocaleTranslations,
} from './locales';
