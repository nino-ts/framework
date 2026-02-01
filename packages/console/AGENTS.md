# @ninots/console

CLI Framework for Bun.

## Package Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | CLI commands for the framework |
| **Laravel Ref** | [artisan.md](file:///d:/pandowlabs/ninots/laravel-docs/artisan.md) |
| **Dependencies** | None (Bun native only) |

## API

```typescript
import { Command, Kernel, OutputStyle } from '@ninots/console';

// Define a command
class ServeCommand extends Command {
  signature = 'serve {--port=3000}';
  description = 'Start the development server';

  async handle(): Promise<number> {
    const port = this.option('port');
    this.info(`Starting server on port ${port}...`);
    return 0;
  }
}

// Register and run
const kernel = new Kernel();
kernel.register(new ServeCommand());
await kernel.run(process.argv.slice(2));
```

## Built-in Commands

| Command | Description |
|---------|-------------|
| `serve` | Start development server |
| `make:controller` | Create a new controller |
| `make:model` | Create a new model |
| `routes` | List all registered routes |

## Code Style

- **TSDoc**: Document ALL functions
- **Path Aliases**: Use `@/*` for `./src/*`
- **TDD**: Tests written before implementation

## Testing

```bash
bun test           # Run all tests
bun test unit/     # Run unit tests only
```
