/**
 * Deep clone an object using structured cloning
 *
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Map) {
    const map = new Map();
    obj.forEach((value, key) => {
      map.set(deepClone(key), deepClone(value));
    });
    return map as unknown as T;
  }

  if (obj instanceof Set) {
    const set = new Set();
    obj.forEach((value) => {
      set.add(deepClone(value));
    });
    return set as unknown as T;
  }

  const cloned: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }

  return cloned as T;
}
