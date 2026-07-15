import type { Connection } from "./connection";
/**
 * Database migration contract — forward-only in Sprint 3 (no rollback CLI).
 */
export interface Migration {
    up(connection: Connection): Promise<void>;
    down(connection: Connection): Promise<void>;
}
