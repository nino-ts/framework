export interface SessionInterface {
    get(key: string, defaultValue?: unknown): unknown;
    put(key: string, value: unknown): void;
    forget(key: string): void;
    flush(): void;
    regenerate(destroy?: boolean): Promise<boolean>;
}
