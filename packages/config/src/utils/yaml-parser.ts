/**
 * Simple YAML parser for configuration files.
 *
 * Supports basic YAML features needed for config files:
 * - Key-value pairs
 * - Nested objects (indentation-based)
 * - Arrays (with - prefix)
 * - Basic types (string, number, boolean, null)
 *
 * @packageDocumentation
 */

type YamlValue = string | number | boolean | null | YamlObject | YamlArray;
type YamlObject = Record<string, YamlValue>;
type YamlArray = YamlValue[];

/**
 * Parse a YAML string into a JavaScript object.
 *
 * @param content - YAML content string
 * @returns Parsed object
 */
export function parseYaml(content: string): Record<string, unknown> {
    const lines = content.split('\n');
    const result: YamlObject = {};
    const stack: Array<{ indent: number; obj: YamlObject | YamlArray }> = [{ indent: -1, obj: result }];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === undefined) continue;

        const trimmed = line.trimEnd();
        if (trimmed === '' || trimmed.startsWith('#')) continue;

        const indent = line.length - line.trimStart().length;
        const currentLine = trimmed;

        while (stack.length > 1 && (stack[stack.length - 1]?.indent ?? 0) >= indent) {
            stack.pop();
        }

        const parent = stack[stack.length - 1];
        if (!parent) continue;

        if (currentLine.startsWith('- ')) {
            if (!Array.isArray(parent.obj)) {
                const key = Object.keys(parent.obj).pop();
                if (key) {
                    parent.obj[key] = [];
                    stack.push({ indent: parent.indent, obj: parent.obj[key] as YamlArray });
                }
                continue;
            }
            const value = parseScalar(currentLine.slice(2));
            parent.obj.push(value);
            continue;
        }

        const colonIndex = currentLine.indexOf(':');
        if (colonIndex === -1) continue;

        const key = currentLine.slice(0, colonIndex).trim();
        let valuePart = currentLine.slice(colonIndex + 1).trim();

        if (valuePart === '' || valuePart === '|' || valuePart === '>') {
            if (valuePart === '|' || valuePart === '>') {
                const multiline: string[] = [];
                const blockIndent = indent + 2;
                i++;
                while (i < lines.length) {
                    const nextLine = lines[i];
                    if (nextLine === undefined) break;
                    if (nextLine.trim() === '') {
                        multiline.push('');
                        i++;
                        continue;
                    }
                    const nextIndent = nextLine.length - nextLine.trimStart().length;
                    if (nextIndent < blockIndent && nextLine.trim() !== '') break;
                    multiline.push(nextLine.slice(blockIndent));
                    i++;
                }
                i--;
                valuePart = multiline.join('\n').trim();
            } else {
                const nextLine = lines[i + 1];
                if (nextLine?.trimStart().startsWith('- ')) {
                    const arr: YamlArray = [];
                    (parent.obj as YamlObject)[key] = arr;
                    stack.push({ indent, obj: arr });
                    continue;
                }
                const obj: YamlObject = {};
                (parent.obj as YamlObject)[key] = obj;
                stack.push({ indent, obj });
                continue;
            }
        }

        const value = parseScalar(valuePart);
        (parent.obj as YamlObject)[key] = value;
    }

    return result;
}

/**
 * Parse a scalar YAML value.
 */
function parseScalar(value: string): YamlValue {
    if (value === 'null' || value === '~' || value === '') {
        return null;
    }
    if (value === 'true') return true;
    if (value === 'false') return false;

    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'")) {
        return value.slice(1, -1);
    }

    const num = Number(value);
    if (!Number.isNaN(num)) return num;

    return value;
}
