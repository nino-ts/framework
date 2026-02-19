/**
 * @ninots/support
 *
 * Foundation utilities for Ninots framework
 * Provides string, array, and collection helper classes
 *
 * @example
 * ```typescript
 * import { Str } from '@ninots/support';
 *
 * const camelized = Str.camel('hello-world');
 * ```
 */

export { Arr } from './arr';
export { Collection } from './collection';
export { InvalidArgumentException, RuntimeException } from './exceptions';
export { Str } from './str/str';
