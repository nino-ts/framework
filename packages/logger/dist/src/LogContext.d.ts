/**
 * Global contextual storage using AsyncLocalStorage to inject metadata into logs.
 *
 * @packageDocumentation
 */
/**
 * Runs a function within a specific logging context.
 *
 * @param context - The initial context to apply
 * @param callback - The function to run
 * @returns The result of the callback
 */
declare function runWithContext<R>(context: Record<string, unknown>, callback: () => R): R;
/**
 * Retrieves the current logging context, if any.
 *
 * @returns The current context or undefined
 */
declare function getContext(): Record<string, unknown> | undefined;
/**
 * Adds data to the current logging context.
 * Useful for enriching logs mid-request.
 *
 * @param context - Additional data to merge
 */
declare function addContext(context: Record<string, unknown>): void;
export { addContext, getContext, runWithContext };
