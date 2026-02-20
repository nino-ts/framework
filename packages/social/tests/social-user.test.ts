import { describe, expect, it } from 'bun:test';
import { SocialUser } from '@/social-user.ts';

describe('SocialUser', () => {
  describe('instance creation', () => {
    it('should create with all properties', () => {
      const user = new SocialUser(
        '123',
        'John',
        'john@example.com',
        'https://example.com/avatar.jpg',
        'access_token_123',
        'refresh_token_456',
        3600,
        { id: '123' },
      );

      expect(user.id).toBe('123');
      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
      expect(user.avatar).toBe('https://example.com/avatar.jpg');
      expect(user.token).toBe('access_token_123');
      expect(user.refreshToken).toBe('refresh_token_456');
      expect(user.expiresIn).toBe(3600);
      expect(user.raw).toEqual({ id: '123' });
    });

    it('should create with default optional properties', () => {
      const user = new SocialUser('1', 'Jane', 'jane@example.com', 'avatar', 'token');

      expect(user.refreshToken).toBeNull();
      expect(user.expiresIn).toBeNull();
      expect(user.raw).toEqual({});
    });
  });

  describe('getter methods', () => {
    const user = new SocialUser(
      'user_123',
      'Test User',
      'test@example.com',
      'https://example.com/test.jpg',
      'token_abc',
      'refresh_xyz',
      7200,
      { provider: 'github' },
    );

    it('getId() returns id', () => {
      expect(user.getId()).toBe('user_123');
    });

    it('getName() returns name', () => {
      expect(user.getName()).toBe('Test User');
    });

    it('getEmail() returns email', () => {
      expect(user.getEmail()).toBe('test@example.com');
    });

    it('getAvatar() returns avatar', () => {
      expect(user.getAvatar()).toBe('https://example.com/test.jpg');
    });

    it('getToken() returns token', () => {
      expect(user.getToken()).toBe('token_abc');
    });

    it('getRefreshToken() returns refreshToken', () => {
      expect(user.getRefreshToken()).toBe('refresh_xyz');
    });

    it('getExpiresIn() returns expiresIn', () => {
      expect(user.getExpiresIn()).toBe(7200);
    });

    it('getRaw() returns raw data', () => {
      expect(user.getRaw()).toEqual({ provider: 'github' });
    });
  });
});
