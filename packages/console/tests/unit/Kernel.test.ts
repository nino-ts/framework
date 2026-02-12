/**
 * Unit tests for Kernel.
 *
 * TDD: These tests define the expected behavior BEFORE implementation.
 *
 * @packageDocumentation
 */

import { describe, expect, test } from 'bun:test';
import { Command } from '@/command';
import { Kernel } from '@/kernel';
import { createOutputCapture } from '@/tests/setup';

class GreetCommand extends Command {
    signature = 'greet {name}';
    description = 'Greet someone';

    async handle(): Promise<number> {
        const name = this.argument('name');
        this.info(`Hello, ${name}!`);
        return 0;
    }
}

class ServeCommand extends Command {
    signature = 'serve {--port=3000}';
    description = 'Start the server';

    async handle(): Promise<number> {
        const port = this.option('port');
        this.info(`Server running on port ${port}`);
        return 0;
    }
}

describe('Kernel', () => {
    describe('register()', () => {
        test('should register a command', () => {
            const kernel = new Kernel();

            kernel.register(new GreetCommand());

            expect(kernel.getCommands().length).toBe(1);
        });

        test('should register multiple commands', () => {
            const kernel = new Kernel();

            kernel.register(new GreetCommand());
            kernel.register(new ServeCommand());

            expect(kernel.getCommands().length).toBe(2);
        });
    });

    describe('run()', () => {
        test('should execute command with arguments', async () => {
            const kernel = new Kernel();
            const output = createOutputCapture();
            kernel.setOutput(output);
            kernel.register(new GreetCommand());

            const exitCode = await kernel.run(['greet', 'World']);

            expect(exitCode).toBe(0);
            expect(output.getOutput()).toContain('Hello, World!');
        });

        test('should execute command with options', async () => {
            const kernel = new Kernel();
            const output = createOutputCapture();
            kernel.setOutput(output);
            kernel.register(new ServeCommand());

            const exitCode = await kernel.run(['serve', '--port=8080']);

            expect(exitCode).toBe(0);
            expect(output.getOutput()).toContain('8080');
        });

        test('should return 1 for unknown command', async () => {
            const kernel = new Kernel();
            const output = createOutputCapture();
            kernel.setOutput(output);

            const exitCode = await kernel.run(['unknown']);

            expect(exitCode).toBe(1);
            expect(output.getOutput()).toContain('not found');
        });

        test('should show help when no command provided', async () => {
            const kernel = new Kernel();
            const output = createOutputCapture();
            kernel.setOutput(output);
            kernel.register(new GreetCommand());

            const exitCode = await kernel.run([]);

            expect(exitCode).toBe(0);
            expect(output.getOutput()).toContain('Available commands');
        });
    });

    describe('getCommands()', () => {
        test('should return all registered commands', () => {
            const kernel = new Kernel();
            kernel.register(new GreetCommand());
            kernel.register(new ServeCommand());

            const commands = kernel.getCommands();

            expect(commands.length).toBe(2);
        });
    });

    describe('findCommand()', () => {
        test('should find command by name', () => {
            const kernel = new Kernel();
            kernel.register(new GreetCommand());

            const command = kernel.findCommand('greet');

            expect(command).toBeDefined();
            expect(command?.getDefinition().name).toBe('greet');
        });

        test('should return undefined for unknown command', () => {
            const kernel = new Kernel();

            const command = kernel.findCommand('unknown');

            expect(command).toBeUndefined();
        });
    });
});
