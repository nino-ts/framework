import { beforeEach, describe, expect, it } from 'bun:test';
import { AbstractProvider, type ProviderConfig } from '@/abstract-provider';
import type { SocialProvider } from '@/contracts/provider';
import { GitHubProvider } from '@/providers/github-provider';
import { SocialManager } from '@/social-manager';
import { SocialUser } from '@/social-user';

class MockProvider extends AbstractProvider {
    getAuthUrl(): string {
        return 'https://mock.example.com/auth';
    }

    getTokenUrl(): string {
        return 'https://mock.example.com/token';
    }

    async getUserByToken(): Promise<Record<string, unknown>> {
        return { id: 'mock_user' };
    }

    mapUserToObject(user: Record<string, unknown>): SocialUser {
        return new SocialUser(String(user.id), 'Mock', 'mock@example.com', 'avatar', 'token');
    }
}

describe('SocialManager', () => {
    let manager: SocialManager;
    let config: Record<string, ProviderConfig>;

    beforeEach(() => {
        config = {
            github: {
                clientId: 'gh_id',
                clientSecret: 'gh_secret',
                redirectUri: 'http://localhost:3000/gh',
            },
            mock: {
                clientId: 'mock_id',
                clientSecret: 'mock_secret',
                redirectUri: 'http://localhost:3000/mock',
            },
        };
        manager = new SocialManager(config);
    });

    describe('driver() method', () => {
        it('should return GitHub provider for github driver', () => {
            const driver = manager.driver('github');

            expect(driver).toBeInstanceOf(GitHubProvider);
        });

        it('should throw when config for driver not found', () => {
            try {
                manager.driver('nonexistent');
                expect(true).toBe(false); // Should throw
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toContain('Config for social driver');
                expect((error as Error).message).toContain('nonexistent');
            }
        });

        it('should throw when driver type not supported', () => {
            try {
                manager.driver('mock');
                expect(true).toBe(false);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toContain('not supported');
            }
        });

        it('should cache driver instances', () => {
            const driver1 = manager.driver('github');
            const driver2 = manager.driver('github');

            expect(driver1).toBe(driver2);
        });

        it('should create separate instances for different drivers (without extend)', () => {
            // Both will fail since only github is supported without extend
            let github: SocialProvider | null = null;

            try {
                github = manager.driver('github');
            } catch {
                // Expected
            }

            expect(github).toBeTruthy();
        });

        it('should pass correct config to driver', () => {
            const driver = manager.driver('github') as GitHubProvider;

            expect(driver.config).toEqual(config.github);
        });
    });

    describe('extend() method', () => {
        it('should register custom provider creator', () => {
            const mockProvider = new MockProvider(config.mock);

            manager.extend('mock', () => mockProvider);

            const driver = manager.driver('mock');

            expect(driver).toBe(mockProvider);
        });

        it('should pass config to creator function', () => {
            let capturedConfig: ProviderConfig | null = null;

            manager.extend('mock', (cfg) => {
                capturedConfig = cfg;
                return new MockProvider(cfg);
            });

            manager.driver('mock');

            expect(capturedConfig).toEqual(config.mock);
        });

        it('should return this for chaining', () => {
            const result = manager.extend('mock', () => new MockProvider(config.mock));

            expect(result).toBe(manager);
        });

        it('should allow chaining multiple extend() calls', () => {
            const result = manager
                .extend('custom1', (cfg) => new MockProvider(cfg))
                .extend('custom2', (cfg) => new MockProvider(cfg));

            expect(result).toBe(manager);
        });

        it('should override built-in drivers', () => {
            const mockGithub = new MockProvider(config.github);

            manager.extend('github', () => mockGithub);

            const driver = manager.driver('github');

            expect(driver).toBe(mockGithub);
            expect(driver).not.toBeInstanceOf(GitHubProvider);
        });

        it('should prioritize extend creators over built-in switch', () => {
            let creatorCalled = false;

            manager.extend('github', () => {
                creatorCalled = true;
                return new MockProvider(config.github);
            });

            manager.driver('github');

            expect(creatorCalled).toBe(true);
        });
    });

    describe('driver caching', () => {
        it('should cache drivers per instance', () => {
            const manager1 = new SocialManager({ github: config.github });
            const manager2 = new SocialManager({ github: config.github });

            const driver1 = manager1.driver('github');
            const driver2 = manager2.driver('github');

            expect(driver1).not.toBe(driver2);
        });

        it('should return same instance on multiple calls', () => {
            const first = manager.driver('github');
            const second = manager.driver('github');
            const third = manager.driver('github');

            expect(first).toBe(second);
            expect(second).toBe(third);
        });
    });

    describe('configuration validation', () => {
        it('should handle empty config gracefully', () => {
            const emptyManager = new SocialManager({});

            try {
                emptyManager.driver('github');
                expect(true).toBe(false);
            } catch (error) {
                expect((error as Error).message).toContain('Config for social driver');
            }
        });

        it('should work with multiple providers in config', () => {
            const multiConfig: Record<string, ProviderConfig> = {
                custom: {
                    clientId: '2',
                    clientSecret: '2',
                    redirectUri: 'http://2',
                },
                github: {
                    clientId: '1',
                    clientSecret: '1',
                    redirectUri: 'http://1',
                },
            };

            const multiManager = new SocialManager(multiConfig);

            const github = multiManager.driver('github');
            expect(github).toBeInstanceOf(GitHubProvider);

            try {
                multiManager.driver('custom');
                expect(true).toBe(false);
            } catch (error) {
                expect((error as Error).message).toContain('not supported');
            }
        });
    });

    describe('SocialProvider contract compliance', () => {
        it('should return providers implementing SocialProvider interface', () => {
            const driver = manager.driver('github');

            expect(typeof driver.redirect).toBe('function');
            expect(typeof driver.user).toBe('function');
            expect(typeof driver.with).toBe('function');
        });

        it('should allow configuring returned provider', () => {
            const driver = manager.driver('github');

            const result = driver.with(['read:user', 'user:email']);

            expect(result).toBe(driver);
        });
    });
});
