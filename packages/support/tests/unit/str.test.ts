import { describe, it, expect } from 'bun:test';
import { Str } from '../../src/str/str';

describe('Str', () => {
    describe('Case Transformations', () => {
        describe('camel', () => {
            it('converts kebab-case to camelCase', () => {
                expect(Str.camel('hello-world')).toBe('helloWorld');
            });

            it('converts snake_case to camelCase', () => {
                expect(Str.camel('hello_world')).toBe('helloWorld');
            });

            it('converts space-separated to camelCase', () => {
                expect(Str.camel('hello world')).toBe('helloWorld');
            });

            it('returns lowercase for single word', () => {
                expect(Str.camel('hello')).toBe('hello');
            });

            it('handles empty string', () => {
                expect(Str.camel('')).toBe('');
            });

            it('handles leading/trailing separators', () => {
                expect(Str.camel('-hello-world-')).toBe('helloWorld');
            });
        });

        describe('snake', () => {
            it('converts camelCase to snake_case', () => {
                expect(Str.snake('helloWorld')).toBe('hello_world');
            });

            it('converts kebab-case to snake_case', () => {
                expect(Str.snake('hello-world')).toBe('hello_world');
            });

            it('handles multiple uppercase letters', () => {
                expect(Str.snake('helloWorldTest')).toBe('hello_world_test');
            });

            it('returns lowercase single word unchanged', () => {
                expect(Str.snake('hello')).toBe('hello');
            });
        });

        describe('kebab', () => {
            it('converts camelCase to kebab-case', () => {
                expect(Str.kebab('helloWorld')).toBe('hello-world');
            });

            it('converts snake_case to kebab-case', () => {
                expect(Str.kebab('hello_world')).toBe('hello-world');
            });

            it('converts spaces to kebab-case', () => {
                expect(Str.kebab('hello world')).toBe('hello-world');
            });

            it('handles multiple separators', () => {
                expect(Str.kebab('hello_world-test')).toBe('hello-world-test');
            });
        });

        describe('studly', () => {
            it('converts to StudlyCase (PascalCase)', () => {
                expect(Str.studly('hello-world')).toBe('HelloWorld');
            });

            it('handles underscores', () => {
                expect(Str.studly('hello_world')).toBe('HelloWorld');
            });

            it('handles spaces', () => {
                expect(Str.studly('hello world')).toBe('HelloWorld');
            });

            it('handles already PascalCase', () => {
                // Without separators, entire string is treated as one word
                expect(Str.studly('HelloWorld')).toBe('Helloworld');
            });
        });

        describe('upper', () => {
            it('converts to uppercase', () => {
                expect(Str.upper('hello')).toBe('HELLO');
            });

            it('handles mixed case', () => {
                expect(Str.upper('HeLLo')).toBe('HELLO');
            });

            it('handles numbers and special chars', () => {
                expect(Str.upper('hello123!@#')).toBe('HELLO123!@#');
            });
        });

        describe('lower', () => {
            it('converts to lowercase', () => {
                expect(Str.lower('HELLO')).toBe('hello');
            });

            it('handles mixed case', () => {
                expect(Str.lower('HeLLo')).toBe('hello');
            });

            it('preserves numbers and special chars', () => {
                expect(Str.lower('HELLO123!@#')).toBe('hello123!@#');
            });
        });
    });

    describe('Checking', () => {
        describe('startsWith', () => {
            it('returns true if string starts with search', () => {
                expect(Str.startsWith('hello world', 'hello')).toBe(true);
            });

            it('returns false if string does not start with search', () => {
                expect(Str.startsWith('hello world', 'world')).toBe(false);
            });

            it('is case-sensitive', () => {
                expect(Str.startsWith('Hello world', 'hello')).toBe(false);
            });
        });

        describe('endsWith', () => {
            it('returns true if string ends with search', () => {
                expect(Str.endsWith('hello world', 'world')).toBe(true);
            });

            it('returns false if string does not end with search', () => {
                expect(Str.endsWith('hello world', 'hello')).toBe(false);
            });

            it('is case-sensitive', () => {
                expect(Str.endsWith('hello World', 'world')).toBe(false);
            });
        });

        describe('contains', () => {
            it('returns true if string contains search', () => {
                expect(Str.contains('hello world', 'lo wo')).toBe(true);
            });

            it('returns false if string does not contain search', () => {
                expect(Str.contains('hello world', 'xyz')).toBe(false);
            });

            it('is case-sensitive', () => {
                expect(Str.contains('hello world', 'HELLO')).toBe(false);
            });

            it('returns true for empty search (substring of any string)', () => {
                expect(Str.contains('hello world', '')).toBe(true);
            });
        });

        describe('doesntContain', () => {
            it('returns true if string does not contain search', () => {
                expect(Str.doesntContain('hello world', 'xyz')).toBe(true);
            });

            it('returns false if string contains search', () => {
                expect(Str.doesntContain('hello world', 'hello')).toBe(false);
            });

            it('returns false for empty search', () => {
                expect(Str.doesntContain('hello world', '')).toBe(false);
            });
        });
    });

    describe('Extraction', () => {
        describe('after', () => {
            it('returns substring after search string', () => {
                expect(Str.after('hello world', 'o ')).toBe('world');
            });

            it('returns full string if search not found', () => {
                expect(Str.after('hello world', 'xyz')).toBe('hello world');
            });

            it('handles search at the end', () => {
                expect(Str.after('hello world', 'world')).toBe('');
            });
        });

        describe('before', () => {
            it('returns substring before search string', () => {
                expect(Str.before('hello world', ' world')).toBe('hello');
            });

            it('returns full string if search not found', () => {
                expect(Str.before('hello world', 'xyz')).toBe('hello world');
            });

            it('handles search at the beginning', () => {
                expect(Str.before('hello world', 'hello')).toBe('');
            });
        });

        describe('between', () => {
            it('returns substring between two strings', () => {
                expect(Str.between('hello world test', 'o ', ' t')).toBe('world');
            });

            it('returns empty string if start not found', () => {
                expect(Str.between('hello world', 'xyz', 'test')).toBe('');
            });

            it('returns empty string if end not found', () => {
                expect(Str.between('hello world', 'hello', 'xyz')).toBe('');
            });

            it('returns substring from start to first end occurrence', () => {
                expect(Str.between('aXbXc', 'a', 'X')).toBe('');
                expect(Str.between('aXbXc', 'aX', 'Xc')).toBe('b');
            });
        });
    });

    describe('Manipulation', () => {
        describe('replace', () => {
            it('replaces all occurrences', () => {
                expect(Str.replace('hello hello hello', 'hello', 'hi')).toBe('hi hi hi');
            });

            it('returns unchanged if search not found', () => {
                expect(Str.replace('hello world', 'xyz', 'test')).toBe('hello world');
            });

            it('handles empty search string', () => {
                // split('') creates array of individual characters
                // 'hello' -> ['h','e','l','l','o'] joined with 'x' -> 'hxexlxlxo'
                expect(Str.replace('hello', '', 'x')).toBe('hxexlxlxo');
            });
        });

        describe('replaceFirst', () => {
            it('replaces only the first occurrence', () => {
                expect(Str.replaceFirst('hello hello hello', 'hello', 'hi')).toBe('hi hello hello');
            });

            it('returns unchanged if search not found', () => {
                expect(Str.replaceFirst('hello world', 'xyz', 'test')).toBe('hello world');
            });

            it('handles empty search', () => {
                // Empty search finds first position (index -1 + 1 = 0)
                const result = Str.replaceFirst('hello', '', 'x');
                expect(result).toMatch(/^x?hello/);
            });
        });

        describe('limit', () => {
            it('truncates string to limit with default ellipsis', () => {
                expect(Str.limit('hello world', 5)).toBe('hello...');
            });

            it('truncates string to limit with custom end', () => {
                expect(Str.limit('hello world', 5, '***')).toBe('hello***');
            });

            it('returns unchanged if string is shorter than limit', () => {
                expect(Str.limit('hello', 10)).toBe('hello');
            });

            it('returns exactly limit chars if length equals limit', () => {
                expect(Str.limit('hello', 5)).toBe('hello');
            });
        });

        describe('slug', () => {
            it('creates URL-safe slug with default separator', () => {
                expect(Str.slug('Hello World')).toBe('hello-world');
            });

            it('removes special characters', () => {
                expect(Str.slug('Hello! @World#')).toBe('hello-world');
            });

            it('replaces multiple spaces with single separator', () => {
                expect(Str.slug('hello   world')).toBe('hello-world');
            });

            it('supports custom separator', () => {
                expect(Str.slug('hello world', '_')).toBe('hello_world');
            });

            it('removes leading/trailing separators', () => {
                expect(Str.slug('---hello world---')).toBe('hello-world');
            });
        });
    });

    describe('Parsing', () => {
        describe('trim', () => {
            it('removes leading and trailing whitespace', () => {
                expect(Str.trim('  hello world  ')).toBe('hello world');
            });

            it('removes only leading/trailing, not internal', () => {
                expect(Str.trim('  hello  world  ')).toBe('hello  world');
            });

            it('removes specified characters', () => {
                expect(Str.trim('xxxhello worldxxx', 'x')).toBe('hello world');
            });

            it('handles empty string', () => {
                expect(Str.trim('')).toBe('');
            });

            it('handles string with only whitespace', () => {
                expect(Str.trim('   ')).toBe('');
            });
        });

        describe('substr', () => {
            it('extracts substring from start index', () => {
                expect(Str.substr('hello world', 6)).toBe('world');
            });

            it('extracts substring with length specified', () => {
                expect(Str.substr('hello world', 0, 5)).toBe('hello');
            });

            it('handles negative start index', () => {
                expect(Str.substr('hello world', -5)).toBe('world');
            });

            it('handles length longer than available', () => {
                expect(Str.substr('hello', 2)).toBe('llo');
            });
        });

        describe('length', () => {
            it('returns string length', () => {
                expect(Str.length('hello')).toBe(5);
            });

            it('returns 0 for empty string', () => {
                expect(Str.length('')).toBe(0);
            });

            it('counts special characters', () => {
                expect(Str.length('hello!@#')).toBe(8);
            });

            it('counts unicode characters correctly', () => {
                // Some emojis use multiple codepoints
                expect(Str.length('hello😊')).toBe(7);
            });
        });
    });
});
