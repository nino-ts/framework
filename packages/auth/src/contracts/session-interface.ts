export interface SessionInterface {
  get<T = unknown>(key: string, defaultValue?: T): T;
  put(key: string, value: unknown): void;
  forget(key: string): void;
  flush(): void;
  regenerate(destroy?: boolean): Promise<boolean>;
}
