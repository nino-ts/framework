#!/usr/bin/env bun

/**
 * Runs the test suite with Docker-backed databases.
 *
 * @remarks
 * Starts the containers, waits for readiness, executes the tests, and tears everything down.
 */

import { $ } from "bun";

const COMPOSE_FILE = "docker-compose.yml";

async function main(): Promise<void> {
	const testArguments = process.argv.slice(2);

	try {
		// Start containers in background.
		await $`docker compose -f ${COMPOSE_FILE} up -d --wait`.quiet();

		// Run tests with any extra arguments passed to the script.
		const testProcess = Bun.spawn(["bun", "test", ...testArguments], {
			cwd: process.cwd(),
			env: {
				...process.env,
				MYSQL_URL: "mysql://ninots:ninots@localhost:3306/ninots_test",
				POSTGRES_URL: "postgres://ninots:ninots@localhost:5432/ninots_test",
			},
			stdio: ["inherit", "inherit", "inherit"],
		});

		const exitCode = await testProcess.exited;
		await $`docker compose -f ${COMPOSE_FILE} down -v --remove-orphans`.quiet();
		process.exit(exitCode);
	} catch (_error) {
		await $`docker compose -f ${COMPOSE_FILE} down -v --remove-orphans`.quiet();

		process.exit(1);
	}
}

main();
