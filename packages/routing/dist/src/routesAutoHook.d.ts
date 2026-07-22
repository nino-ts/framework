/**
 * Dev auto-hook: watch route dirs -> debounce -> emit typed registry.
 *
 * Reuses {@link emitRouteRegistry}; never watches `types/` (anti-loop).
 *
 * @packageDocumentation
 */
import type { Router } from "./router";
export interface RoutesAutoHookOptions {
    /** Directories to watch recursively (e.g. `routes`, `app/Modules`). Never `types/`. */
    routesDirs: string[];
    /** Relative path for the `.d.ts` artifact. @default `types/routes.d.ts` */
    outPath?: string;
    /** Resolve the live Router (re-called after each debounced change). */
    resolveRouter: () => Router | Promise<Router>;
    /** Abort to stop all watchers (ServeCommand SIGINT/SIGTERM). */
    signal?: AbortSignal;
    /** Coalesce Windows multi-event / atomic saves. @default 150 */
    debounceMs?: number;
    /** Override warning sink (defaults to `console.warn`). */
    onWarn?: (message: string) => void;
    /** Called when the artifact was actually written. */
    onWritten?: (outRel: string) => void;
}
/**
 * True when a watch event must be ignored (empty filename or `.d.ts`).
 */
export declare function shouldIgnoreWatchPath(filename: string | null | undefined): boolean;
/**
 * Write `content` only when it differs from the file on disk.
 *
 * @returns `true` when `Bun.write` ran
 */
export declare function writeRouteRegistryIfChanged(outPath: string, content: string): Promise<boolean>;
/**
 * Resolve router -> {@link emitRouteRegistry} -> conditional write.
 *
 * Exported for unit tests (no `fs.watch`).
 */
export declare function compileRouteRegistryArtifact(options: {
    resolveRouter: () => Router | Promise<Router>;
    outPath: string;
}): Promise<"written" | "unchanged">;
/**
 * Watch `routesDirs` and rebuild the typed route registry on change.
 *
 * Resolves when `signal` aborts (or immediately if already aborted).
 * Compile errors are logged via `onWarn` — they never reject this promise.
 */
export declare function startRoutesAutoHook(options: RoutesAutoHookOptions): Promise<void>;
