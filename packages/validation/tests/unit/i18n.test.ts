/**
 * Testes Unitários para Sistema i18n.
 *
 * @packageDocumentation
 * Testes para tradução de mensagens em pt-BR, en e es.
 */

import { describe, expect, test } from 'bun:test';
import { Translator, t, setLocale, getLocale, locales, ptBR, en, es } from '../../src/i18n';

describe('FASE 11: i18n System', () => {
  describe('Translator Class', () => {
    test('should translate required message in pt-BR', () => {
      const translator = new Translator('pt-BR');
      const message = translator.translate('required', { attributes: { field: 'email' } });
      expect(message).toBe('O campo email é obrigatório.');
    });

    test('should translate required message in en', () => {
      const translator = new Translator('en');
      const message = translator.translate('required', { attributes: { field: 'email' } });
      expect(message).toBe('The email field is required.');
    });

    test('should translate required message in es', () => {
      const translator = new Translator('es');
      const message = translator.translate('required', { attributes: { field: 'email' } });
      expect(message).toBe('El campo email es obligatorio.');
    });

    test('should translate min_length with multiple placeholders', () => {
      const translator = new Translator('pt-BR');
      const message = translator.translate('min_length', { attributes: { field: 'password', min: 8 } });
      expect(message).toBe('O campo password deve ter pelo menos 8 caracteres.');
    });

    test('should translate max_length with multiple placeholders', () => {
      const translator = new Translator('en');
      const message = translator.translate('max_length', { attributes: { field: 'name', max: 50 } });
      expect(message).toBe('The name field must be at most 50 characters.');
    });

    test('should change locale dynamically', () => {
      const translator = new Translator('pt-BR');
      expect(translator.getLocale()).toBe('pt-BR');

      translator.setLocale('en');
      expect(translator.getLocale()).toBe('en');

      const message = translator.translate('email', { attributes: { field: 'user_email' } });
      expect(message).toBe('The user_email field must be a valid email address.');
    });

    test('should use default locale when locale not found', () => {
      const translator = new Translator('pt-BR');
      // @ts-expect-error - Testing invalid locale
      const message = translator.translate('required', { locale: 'invalid' as 'pt-BR', attributes: { field: 'test' } });
      expect(message).toContain('test');
    });

    test('should translateMany messages', () => {
      const translator = new Translator('pt-BR');
      const messages = translator.translateMany(['required', 'email', 'min_length'], {
        attributes: { field: 'email', min: 3 },
      });

      expect(messages.required).toBe('O campo email é obrigatório.');
      expect(messages.email).toBe('O campo email deve ser um email válido.');
      expect(messages.min_length).toBe('O campo email deve ter pelo menos 3 caracteres.');
    });

    test('should get all messages for a locale', () => {
      const translator = new Translator('pt-BR');
      const messages = translator.getMessages();

      expect(messages).toHaveProperty('required');
      expect(messages).toHaveProperty('email');
      expect(messages.required).toContain(':field');
    });

    test('should register custom locale', () => {
      const translator = new Translator();
      translator.registerLocale('custom', {
        required: 'Custom required message for :field',
      });

      const message = translator.translate('required', { locale: 'custom' as 'pt-BR', attributes: { field: 'test' } });
      expect(message).toBe('Custom required message for test');
    });
  });

  describe('Global Functions', () => {
    test('should use global t() function', () => {
      setLocale('pt-BR');
      const message = t('required', { attributes: { field: 'name' } });
      expect(message).toBe('O campo name é obrigatório.');
    });

    test('should get global locale', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');
    });

    test('should change global locale', () => {
      setLocale('es');
      const message = t('email', { attributes: { field: 'correo' } });
      expect(message).toBe('El campo correo debe ser una dirección de email válida.');
    });
  });

  describe('Message Coverage', () => {
    test('should have all messages in pt-BR', () => {
      const messages = ptBR;
      expect(Object.keys(messages).length).toBeGreaterThanOrEqual(79);
      expect(messages.required).toContain(':field');
    });

    test('should have all messages in en', () => {
      const messages = en;
      expect(Object.keys(messages).length).toBeGreaterThanOrEqual(79);
      expect(messages.required).toContain(':field');
    });

    test('should have all messages in es', () => {
      const messages = es;
      expect(Object.keys(messages).length).toBeGreaterThanOrEqual(79);
      expect(messages.required).toContain(':field');
    });

    test('should have consistent message keys across locales', () => {
      const ptKeys = Object.keys(ptBR).sort();
      const enKeys = Object.keys(en).sort();
      const esKeys = Object.keys(es).sort();

      expect(ptKeys).toEqual(enKeys);
      expect(ptKeys).toEqual(esKeys);
    });
  });

  describe('Placeholder Replacement', () => {
    test('should replace single placeholder', () => {
      const translator = new Translator('pt-BR');
      const message = translator.translate('required', { attributes: { field: 'username' } });
      expect(message).toBe('O campo username é obrigatório.');
    });

    test('should replace multiple placeholders', () => {
      const translator = new Translator('pt-BR');
      const message = translator.translate('digits_between', { attributes: { field: 'phone', min: 10, max: 11 } });
      expect(message).toBe('O campo phone deve ter entre 10 e 11 dígitos.');
    });

    test('should handle missing placeholder', () => {
      const translator = new Translator('pt-BR');
      const message = translator.translate('required', { attributes: {} });
      expect(message).toBe('O campo :field é obrigatório.');
    });

    test('should handle array values', () => {
      const translator = new Translator('pt-BR');
      const message = translator.translate('required_with', { attributes: { field: 'email', values: 'username' } });
      expect(message).toBe('O campo email é obrigatório quando username está presente.');
    });
  });
});
