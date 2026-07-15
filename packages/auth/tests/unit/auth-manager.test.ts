import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { GuardFactory } from "../../src/auth-manager";
import { AuthManager } from "../../src/auth-manager";
import { SessionGuard } from "../../src/guards/session-guard";
import { TokenGuard } from "../../src/guards/token-guard";
import { createMockGuard, createMockProvider, createMockSession, createMockUser } from "../mocks";

describe("AuthManager", () => {
    let authManager: AuthManager;

    beforeEach(() => {
        authManager = new AuthManager();
    });

    test("should resolve default guard", () => {
        // Arrange
        authManager.extend("session", () => {
            const provider = createMockProvider();
            const session = createMockSession();
            return new SessionGuard("web", provider, session);
        });

        // Act
        const guard = authManager.guard();

        // Assert
        expect(guard).toBeDefined();
        expect(guard).toBeInstanceOf(SessionGuard);
    });

    test("should resolve named guard", () => {
        // Arrange
        authManager.extend("token", () => {
            const provider = createMockProvider();
            return new TokenGuard(provider, new Request("http://test.com"));
        });

        // Act
        const guard = authManager.guard("token");

        // Assert
        expect(guard).toBeDefined();
        expect(guard).toBeInstanceOf(TokenGuard);
    });

    test("should cache guard instances", () => {
        // Arrange
        let callCount = 0;
        authManager.extend("session", () => {
            callCount++;
            const provider = createMockProvider();
            const session = createMockSession();
            return new SessionGuard("web", provider, session);
        });

        // Act
        authManager.guard("session");
        authManager.guard("session");

        // Assert
        expect(callCount).toBe(1); // Factory chamada apenas uma vez
    });

    test("should throw for unregistered guard name", () => {
        // Act & Assert
        expect(() => authManager.guard("nonexistent")).toThrow();
    });

    test("should throw for unsupported guard driver", () => {
        // Act & Assert
        expect(() => authManager.extend("invalid", null as unknown as GuardFactory)).toThrow();
    });

    test("should extend with custom guard factory", () => {
        // Arrange
        const customGuard = createMockGuard();
        const factory = mock(() => customGuard);

        // Act
        authManager.extend("custom", factory);
        const guard = authManager.guard("custom");

        // Assert
        expect(guard).toBe(customGuard);
        expect(factory).toHaveBeenCalled();
    });

    test("should delegate check() to default guard", async () => {
        // Arrange
        const mockGuard = createMockGuard();
        mockGuard.check = mock().mockResolvedValue(true);
        authManager.extend("session", () => mockGuard);

        // Act
        const result = await authManager.check();

        // Assert
        expect(result).toBe(true);
        expect(mockGuard.check).toHaveBeenCalled();
    });

    test("should delegate user() to default guard", async () => {
        // Arrange
        const mockUser = createMockUser({ email: "test@example.com", id: 1 });
        const mockGuard = createMockGuard();
        mockGuard.user = mock().mockResolvedValue(mockUser);
        authManager.extend("session", () => mockGuard);

        // Act
        const result = await authManager.user();

        // Assert
        expect(result).toBe(mockUser);
        expect(mockGuard.user).toHaveBeenCalled();
    });

    test("should delegate id() to default guard", async () => {
        // Arrange
        const mockGuard = createMockGuard();
        mockGuard.id = mock().mockResolvedValue(123);
        authManager.extend("session", () => mockGuard);

        // Act
        const result = await authManager.id();

        // Assert
        expect(result).toBe(123);
        expect(mockGuard.id).toHaveBeenCalled();
    });
});
