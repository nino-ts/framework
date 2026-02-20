# Testing Patterns & Standards

> **Coverage Target**: Minimum 90% mandatory on all pull requests.
> **Last Updated**: 19 Feb 2026 | **Coverage**: 95.96% (896/923 effective tests)

## Quick Start

### Run Tests

```bash
# Run all tests
bun test

# Run with coverage report
bun test --coverage

# Run specific file
bun test packages/http/tests/

# Watch mode
bun test --watch

# With grep filter
bun test --grep "should handle errors"
```

### Coverage Thresholds

```bash
# Enforce minimum 80% coverage (Phase 2)
bun test --coverage --min=80

# Enforce minimum 85% coverage (Phase 3)
bun test --coverage --min=85

# Enforce minimum 90% coverage (Phase 4 - CI/CD)
bun test --coverage --min=90

# Or use npm scripts
bun run test:coverage:80
bun run test:coverage:85
bun run test:coverage:90
```

---

## Directory Structure

Each package follows this test organization:

```
packages/{name}/
├── tests/
│   ├── setup.ts                    # Shared test helpers & fixtures
│   ├── unit/                       # Pure unit tests (no I/O)
│   │   ├── Feature.test.ts
│   │   ├── Handler.test.ts
│   │   └── ...
│   └── feature/                    # Integration tests
│       ├── Authentication.test.ts
│       ├── ErrorHandling.test.ts
│       └── ...
├── src/
│   └── ...
└── package.json
```

### Unit vs Feature Tests

**Unit Tests** (`tests/unit/`):
- Test a single function/method in isolation
- No database, no HTTP calls, no file I/O
- Use mocks for dependencies
- Fast execution (< 10ms per test)

**Feature Tests** (`tests/feature/`):
- Test integrated functionality
- May use real database (with setup/teardown)
- Test request → response flows
- Test cross-module interactions

---

## Writing Tests

### Basic Test Structure

```typescript
import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { MyFunction } from '@/my-function.ts';
import { createTestHelper } from '@/tests/setup.ts';

describe('MyFunction', () => {
    let helper: TestHelper;

    beforeEach(() => {
        // Setup before each test
        helper = createTestHelper();
    });

    afterEach(() => {
        // Cleanup after each test
        helper.cleanup();
    });

    test('should perform expected behavior', () => {
        // Arrange: Set up test data
        const input = { value: 42 };

        // Act: Call the function
        const result = MyFunction(input);

        // Assert: Verify results
        expect(result).toBe(expected);
    });
});
```

### Naming Conventions

- **Describe blocks**: Use PascalCase for the feature being tested
  ```typescript
  describe('Container', () => {
      describe('bind()', () => {
          // ...
      });
  });
  ```

- **Test names**: Use `should + action + expected outcome`
  ```typescript
  test('should throw when binding abstract without factory', () => {
      // ...
  });

  test('should return singleton instance on multiple calls', () => {
      // ...
  });
  ```

### Assertion Patterns

```typescript
// Equality
expect(value).toBe(42);
expect(obj).toEqual({ name: 'test' });
expect(arr).toContain('item');

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(count).toBeGreaterThan(10);
expect(count).toBeLessThanOrEqual(100);

// Strings
expect(text).toMatch(/pattern/);
expect(text).toContain('substring');

// Arrays
expect(arr).toHaveLength(3);
expect(arr).toContain('item');

// Functions
expect(() => {
    throw new Error('fail');
}).toThrow('fail');

// Async
await expect(Promise.resolve(1)).resolves.toBe(1);
await expect(Promise.reject('err')).rejects.toBe('err');
```

---

## Setup Helpers

Each package's `tests/setup.ts` provides utilities:

### Container Setup

```typescript
import { createTestContainer } from '@ninots/container/tests/setup.ts';

const container = createTestContainer();
container.bind('service', () => new MyService());
const service = container.make('service');
```

### HTTP Setup

```typescript
import { createMockRequest, createJsonRequest } from '@ninots/http/tests/setup.ts';

const request = createMockRequest('/api/users');
const jsonReq = createJsonRequest('/api/users', { name: 'John' });
```

### ORM Setup

```typescript
import { createTestDatabase } from '@ninots/orm/tests/setup.ts';

const db = createTestDatabase();
const user = await db.query('users').insert({ name: 'John' });
```

---

## Common Test Patterns

### Testing Error Handling

```typescript
test('should throw ValidationError for invalid input', () => {
    expect(() => {
        validateEmail('invalid');
    }).toThrow(ValidationError);
});

test('should reject with error message', async () => {
    await expect(
        fetchUser(-1)
    ).rejects.toThrow('User ID must be positive');
});
```

### Testing Async Functions

```typescript
test('should resolve with user data', async () => {
    const user = await fetchUser(1);
    expect(user.name).toBe('John');
});

test('should support concurrent requests', async () => {
    const [user1, user2] = await Promise.all([
        fetchUser(1),
        fetchUser(2),
    ]);
    expect(user1).toBeDefined();
    expect(user2).toBeDefined();
});
```

### Testing Callbacks & Events

```typescript
test('should call callback on success', () => {
    const callback = (value) => value;
    const spy = mock(callback);

    processItem(data, spy);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expectedValue);
});
```

### Testing with Setup/Teardown

```typescript
describe('Database Operations', () => {
    let db: Database;

    beforeAll(async () => {
        // Setup once for all tests in this describe
        db = await createDatabase('test');
        await db.migrate();
    });

    afterEach(async () => {
        // Cleanup after each test
        await db.truncate('users');
    });

    afterAll(async () => {
        // Final cleanup
        await db.close();
    });

    test('should insert user', async () => {
        const user = await db.query('users').insert({ name: 'John' });
        expect(user.id).toBeDefined();
    });
});
```

---

## Test Quality Rules (Biome Enforcement)

These rules are automatically enforced by Biome. Your tests will fail linting if:

### ❌ Skipped Tests
```typescript
// BAD: Test is skipped
test.skip('should do something', () => {
    expect(true).toBe(true);
});

// GOOD: Remove when complete
test('should do something', () => {
    expect(true).toBe(true);
});
```

**Why**: Skipped tests in main branch hide untested code. Use `.skip` only for temporary debugging.

### ❌ Focused Tests  
```typescript
// BAD: Only this test runs
test.only('should do something', () => {
    expect(true).toBe(true);
});

// GOOD: Run all tests
test('should do something', () => {
    expect(true).toBe(true);
});
```

**Why**: `.only` accidentally committed breaks CI by ignoring other tests.

### ❌ Conditional Logic in Tests
```typescript
// BAD: Conditional assertions
test('should handle both cases', () => {
    const result = compute();
    if (result > 10) {
        expect(result).toBeGreaterThan(5);
    } else {
        expect(result).toBeLessThanOrEqual(10);
    }
});

// GOOD: Split into separate tests
test('should return value greater than 5', () => {
    const result = compute(data1);
    expect(result).toBeGreaterThan(5);
});

test('should return value less than or equal to 10', () => {
    const result = compute(data2);
    expect(result).toBeLessThanOrEqual(10);
});
```

**Why**: Conditional logic makes tests unpredictable and hard to debug failures.

### ❌ Done Callbacks
```typescript
// BAD: Using done callback
test('should fetch data', (done) => {
    fetchData().then(() => {
        done();
    });
});

// GOOD: Use async/await
test('should fetch data', async () => {
    await fetchData();
});
```

**Why**: Async/await is clearer and prevents missing `done()` calls.

### ❌ Excessive Nesting
```typescript
// BAD: Too many nested describe blocks
describe('Level 1', () => {
    describe('Level 2', () => {
        describe('Level 3', () => {
            describe('Level 4', () => {
                describe('Level 5', () => {
                    test('deeply nested', () => {});
                });
            });
        });
    });
});

// GOOD: Keep max 3-4 levels
describe('Container', () => {
    describe('bind()', () => {
        test('should register binding', () => {});
    });
});
```

**Why**: Deep nesting makes test output hard to read.

---

## Mocking & Test Doubles

### Web API Mocks (Bun Native)

```typescript
import { describe, test, expect, mock } from 'bun:test';

// Mock fetch for HTTP testing
test('should handle API errors', async () => {
    const mockFetch = mock(async (url) => {
        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
        });
    });

    // Replace global fetch temporarily
    globalThis.fetch = mockFetch;

    try {
        const result = await fetchUser(1);
    } finally {
        // Restore
        globalThis.fetch = undefined;
    }
});
```

### Mocking Container Bindings

```typescript
import { describe, test, expect } from 'bun:test';
import { createTestContainer } from '@/tests/setup.ts';

test('should use mock service', () => {
    const container = createTestContainer();
    const mockService = {
        getData: () => ({ id: 1, name: 'Mock' }),
    };

    container.instance('service', mockService);
    const service = container.make('service');

    expect(service.getData()).toEqual({ id: 1, name: 'Mock' });
});
```

---

## Performance Considerations

### Test Execution Time

- **Unit tests**: Target < 10ms per test
- **Feature tests**: Target < 100ms per test
- **Database tests**: Use setup/teardown to minimize overhead

### Global Test Metrics

- **Total tests**: 896 (target: +40 new tests in Phases 2-3)
- **Coverage**: 95.96% lines, 89.46% functions
- **Execution time**: ~6.3 seconds for full suite

---

## Continuous Integration

Coverage is enforced in GitHub Actions on every PR:

```bash
# All PRs must pass these checks:
bun run verify:all          # no-any + type-check + lint + test
bun test --coverage --min=90  # Minimum 90% coverage
```

---

## Debugging Failed Tests

### Verbose Output

```bash
# Show detailed test output with source locations
bun test --bail            # Stop on first failure
bun test --timeout 10000   # Increase timeout for slow tests
```

### Using `console.log` in Tests

```typescript
test('debug output', () => {
    const value = someFunction();
    console.log('Intermediate value:', value);  // Visible with --verbose
    expect(value).toBe(expected);
});
```

### Isolating Failures

```typescript
// Run only tests matching pattern
bun test --grep "Container > bind"

// Run single file
bun test packages/container/tests/unit/Container.test.ts
```

---

## Coverage Gaps by Package

Current gaps (from 95.96% → 90% target):

| Package | Current | Gap | Priority |
|---------|---------|-----|----------|
| http | 100% | Complete | ✅ |
| foundation | 80% | Add 6+ tests | 🔴 High |
| routing | 100% | Complete | ✅ |
| middleware | 100% | Complete | ✅ |
| orm | 97% | Edge cases only | 🟡 |
| container | 85% | Type tests needed | 🟡 |

---

## Next Steps

### Phase 2 (85% Target)
- [ ] Expand @ninots/foundation tests (+6)
- [ ] Improve @ninots/http edge cases (+3)
- [ ] Add @ninots/console tests (+2)

### Phase 3 (90% Target)
- [ ] Complete @ninots/routing coverage (+4)
- [ ] Finalize @ninots/middleware tests (+3)
- [ ] Add type tests to @ninots/container (+3)

### Phase 4 (CI/CD Enforcement)
- [ ] GitHub Actions PR checks for `--min=90`
- [ ] Coverage badge in README
- [ ] Release notes with coverage updates

---

## Resources

- [Bun Testing Docs](https://bun.sh/docs/runtime/testing)
- [Web APIs in Bun](https://bun.sh/docs/runtime/web-apis)
- [Node.js Compatibility](https://bun.sh/docs/runtime/nodejs-compat)
- [Test Coverage Report](./framework/coverage)

## Questions?

For test-related questions, refer to package-specific test setup files or ask in `#testing` discussion.
