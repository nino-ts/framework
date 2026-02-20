import type { Command } from '@/command.ts';

/**
 * Contract for the Console Kernel.
 */
export interface KernelInterface {
  register(command: Command): this;
  run(argv: string[]): Promise<number>;
  findCommand(name: string): Command | undefined;
  getCommands(): Command[];
}
