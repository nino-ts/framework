/**
 * Testes unitários do DatabaseUserProvider.
 *
 * Testa a implementação do provedor de usuários baseado em banco de dados.
 *
 * @packageDocumentation
 */

import { beforeEach, describe, expect, type mock, test } from "bun:test";
import type { ConnectionInterface } from "../../src/contracts/connection-interface";
import type { Hasher } from "../../src/contracts/hasher";
import { DatabaseUserProvider, GenericUser } from "../../src/providers/database-provider";
import { createMockConnection, createMockHasher, createMockUser } from "../mocks/unit-mocks";

describe("DatabaseUserProvider", () => {
    let connection: ConnectionInterface & { query: ReturnType<typeof mock> };
    let hasher: Hasher & {
        hash: ReturnType<typeof mock>;
        verify: ReturnType<typeof mock>;
        needsRehash: ReturnType<typeof mock>;
    };
    let provider: DatabaseUserProvider;

    beforeEach(() => {
        connection = createMockConnection();
        hasher = createMockHasher();
        provider = new DatabaseUserProvider(connection, hasher, "users");
    });

    test("should retrieve user by ID", async () => {
        connection.query.mockResolvedValue([{ email: "test@example.com", id: 1, name: "Test User" }]);

        const user = await provider.retrieveById(1);

        expect(user).not.toBeNull();
        expect(user?.getId()).toBe(1);
        expect(connection.query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = ?", [1]);
    });

    test("should return null for unknown ID", async () => {
        connection.query.mockResolvedValue([]);

        const user = await provider.retrieveById(999);

        expect(user).toBeNull();
    });

    test("should retrieve user by token", async () => {
        connection.query.mockResolvedValue([{ email: "test@example.com", id: 1, remember_token: "token123" }]);

        const user = await provider.retrieveByToken(1, "token123");

        expect(user).not.toBeNull();
        expect(user?.getId()).toBe(1);
    });

    test("should return null for invalid token", async () => {
        connection.query.mockResolvedValue([]);

        const user = await provider.retrieveByToken(1, "invalid");

        expect(user).toBeNull();
    });

    test("should retrieve user by credentials (email)", async () => {
        connection.query.mockResolvedValue([{ email: "test@example.com", id: 1, password: "hashed:secret" }]);

        const user = await provider.retrieveByCredentials({
            email: "test@example.com",
        });

        expect(user).not.toBeNull();
        expect(user?.getEmail()).toBe("test@example.com");
    });

    test("should return null for non-existent credentials", async () => {
        connection.query.mockResolvedValue([]);

        const user = await provider.retrieveByCredentials({
            email: "nonexistent@example.com",
        });

        expect(user).toBeNull();
    });

    test("should reject unsupported credential fields", async () => {
        await expect(
            provider.retrieveByCredentials({
                email: "test@example.com",
                role: "admin",
            }),
        ).rejects.toThrow("Unsupported credential field: role");
    });

    test("should validate credentials with matching password", async () => {
        const mockUser = createMockUser({ id: 1, password: "hashed:secret" });
        hasher.verify.mockResolvedValue(true);

        const valid = await provider.validateCredentials(mockUser, {
            password: "secret",
        });

        expect(valid).toBe(true);
        expect(hasher.verify).toHaveBeenCalledWith("secret", "hashed:secret");
    });

    test("should reject credentials with wrong password", async () => {
        const mockUser = createMockUser({ id: 1, password: "hashed:secret" });
        hasher.verify.mockResolvedValue(false);

        const valid = await provider.validateCredentials(mockUser, {
            password: "wrong",
        });

        expect(valid).toBe(false);
    });

    test("should update remember token on user", async () => {
        const mockUser = createMockUser({ id: 1 });
        connection.query.mockResolvedValue([]);

        await provider.updateRememberToken(mockUser, "new-token");

        expect(connection.query).toHaveBeenCalledWith("UPDATE users SET remember_token = ? WHERE id = ?", [
            "new-token",
            1,
        ]);
    });

    test("should expose user model class", () => {
        const userData = { email: "test@example.com", id: 1, name: "Test" };
        const user = new GenericUser(userData);

        expect(user.getId()).toBe(1);
        expect(user.getEmail()).toBe("test@example.com");
        expect(user.getName()).toBe("Test");
    });
});
