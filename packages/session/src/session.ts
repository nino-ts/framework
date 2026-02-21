import type { SessionDriver } from '@/contracts/session-driver.ts';

/**
 * Generates a cryptographically secure random token using the Bun native crypto API.
 *
 * Uses `crypto.getRandomValues()` to generate 32 random bytes, then encodes as hex string.
 * This is suitable for session tokens, CSRF tokens, and other security-sensitive identifiers.
 *
 * @internal
 * @returns A 64-character hex string (32 bytes)
 */
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Session manager class.
 */
export class Session {
  protected driver: SessionDriver;
  protected id: string;
  protected token: string;
  protected name: string;
  protected attributes: Record<string, unknown> = {};
  protected started: boolean = false;

  constructor(driver: SessionDriver, name: string, id?: string, token?: string) {
    this.driver = driver;
    this.name = name;
    this.id = id || crypto.randomUUID();
    this.token = token || generateToken();
  }

  /**
   * Start the session, reading data from driver.
   */
  async start(): Promise<boolean> {
    this.attributes = await this.driver.read(this.id);
    this.started = true;
    return true;
  }

  /**
   * Get the session ID.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Set the session ID.
   */
  setId(id: string): void {
    this.id = id;
  }

  /**
   * Get the session token.
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Set the session token.
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get the session name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get a value from the session.
   */
  get<T = unknown>(key: string, defaultValue?: T): T {
    return ((this.attributes[key] as T) ?? defaultValue) as T;
  }

  /**
   * Set a value in the session.
   */
  put(key: string, value: unknown): void {
    this.attributes[key] = value;
  }

  /**
   * Get all attributes.
   */
  all(): Record<string, unknown> {
    return this.attributes;
  }

  /**
   * Check if a key exists.
   */
  has(key: string): boolean {
    return key in this.attributes;
  }

  /**
   * Remove a key from the session.
   */
  forget(key: string): void {
    delete this.attributes[key];
  }

  /**
   * Remove all data from the session.
   */
  flush(): void {
    this.attributes = {};
  }

  /**
   * Save the session data to the driver.
   */
  async save(lifetime: number = 120): Promise<void> {
    await this.driver.write(this.id, this.attributes, lifetime);
  }

  /**
   * Invalidate the session (regenerate ID and keep data or flush).
   */
  async invalidate(): Promise<boolean> {
    await this.driver.destroy(this.id);
    this.id = crypto.randomUUID();
    return true;
  }

  /**
   * Regenerate the session ID.
   */
  async regenerate(destroy: boolean = false): Promise<boolean> {
    if (destroy) {
      await this.driver.destroy(this.id);
    }
    this.id = crypto.randomUUID();
    return true;
  }

  /**
   * Regenerate the session token and return the new token.
   *
   * The token is a cryptographically secure random string used to identify the session
   * in cookies, headers, or other transport mechanisms. This method generates a new token
   * and persists it via save().
   *
   * @returns The newly generated session token
   */
  async regenerateToken(): Promise<string> {
    this.token = generateToken();
    await this.save();
    return this.token;
  }

  /**
   * Flash a value to the session (next request only).
   * TODO: Implement flash logic (requires _flash key handling)
   */
  flash(key: string, value: unknown): void {
    this.put(key, value);
    this.push('_flash.new', key);
    this.removeFromOldFlash(key);
  }

  /**
   * Reflash all flash data.
   */
  reflash(): void {
    const old = this.get<string[]>('_flash.old', []);
    this.put('_flash.new', old);
    this.put('_flash.old', []);
  }

  /**
   * Keep specific flash data.
   */
  keep(keys: string[] = []): void {
    const old = this.get<string[]>('_flash.old', []);
    const toKeep = keys.length > 0 ? keys : old;

    for (const key of toKeep) {
      this.push('_flash.new', key);
      this.removeFromOldFlash(key);
    }
  }

  /**
   * Age flash data.
   */
  ageFlashData(): void {
    const old = this.get<string[]>('_flash.old', []);
    for (const key of old) {
      this.forget(key);
    }
    this.put('_flash.old', this.get('_flash.new', []));
    this.put('_flash.new', []);
  }

  private push(key: string, value: unknown): void {
    const array = this.get<unknown[]>(key, []);
    array.push(value);
    this.put(key, array);
  }

  private removeFromOldFlash(key: string): void {
    const old = this.get<string[]>('_flash.old', []);
    this.put(
      '_flash.old',
      old.filter((k) => k !== key),
    );
  }
}
