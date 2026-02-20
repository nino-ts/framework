import type { Model } from '@/model.ts';

/**
 * Constructor type for mixin pattern.
 * Note: TypeScript requires any[] for mixin constructors (TS2545).
 *
 * @template T - The base class type
 */
type Constructor<T extends Model = Model> = new (...args: any[]) => T;

/**
 * HasTimestamps mixin handles automatic timestamp management.
 *
 * @template TBase - The base constructor type
 *
 * @example
 * ```typescript
 * class User extends HasTimestamps(Model) {
 *     protected static table = 'users';
 * }
 *
 * const user = new User({ name: 'John' });
 * await user.save(); // Automatically sets created_at and updated_at
 *
 * user.name = 'Jane';
 * await user.save(); // Automatically updates updated_at
 * ```
 */
export function HasTimestamps<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    /**
     * Override save to automatically update timestamps.
     *
     * @returns Promise resolving to true if successful
     */
    override async save(): Promise<boolean> {
      this.updateTimestamps();
      return super.save();
    }

    /**
     * Update created_at and updated_at timestamps.
     * Sets created_at only on new records and updated_at on all saves.
     */
    updateTimestamps(): void {
      const now = new Date().toISOString(); // SQLite text format ISO8601

      // Check existence logic.
      // 'exists' property is protected in Model. Mixin should access it via subclassing.
      // TS might complain if definition file doesn't expose it.
      // Assuming we are in same package/compilation context it works.

      if (!this.exists) {
        this.setAttribute('created_at', now);
      }
      this.setAttribute('updated_at', now);
    }
  };
}
