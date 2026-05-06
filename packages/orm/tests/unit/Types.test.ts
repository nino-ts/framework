import { describe, expect, test } from "bun:test";

import type { ModelCreateInput, ModelUpdateInput } from "@/types.ts";

interface UserAttributes {
	id: number;
	name: string;
	email: string;
	is_admin: boolean;
	created_at: Date;
	updated_at: Date;
}

describe("Model Types (Compile-time logic)", () => {
	test("ModelCreateInput should exclude auto-generated fields", () => {
		// We can't easily test TS compilation failures in standard bun test runtime
		// without a separate compilation step.
		// However, we can assert type shapes by assigning to variables and
		// testing their runtime values in a safe way.

		// This is valid:
		const validCreate: ModelCreateInput<UserAttributes> = {
			email: "john@example.com",
			is_admin: false,
			name: "John",
		};

		// @ts-expect-error - 'id' is not allowed in ModelCreateInput
		const invalidCreate: ModelCreateInput<UserAttributes> = {
			email: "john@example.com",
			id: 1,
			is_admin: false,
			name: "John",
		};

		expect(validCreate).toHaveProperty("name");
		expect(invalidCreate).toHaveProperty("id");
	});

	test("ModelUpdateInput should make all remaining fields optional", () => {
		// This is valid:
		const validUpdate: ModelUpdateInput<UserAttributes> = {
			name: "John Doe",
			// email is omitted, which is valid for an update
		};

		// @ts-expect-error - 'id' is not allowed in ModelUpdateInput
		const invalidUpdate: ModelUpdateInput<UserAttributes> = {
			id: 1,
			name: "John Doe",
		};

		expect(validUpdate).toHaveProperty("name");
		expect(invalidUpdate).toHaveProperty("id");
	});
});
