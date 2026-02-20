export interface ConnectionInterface {
  query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}
