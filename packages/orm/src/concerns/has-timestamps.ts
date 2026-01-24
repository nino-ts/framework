import { Model } from '@/model';

type Constructor<T = Model> = new (...args: any[]) => T;

/**
 * HasTimestamps mixin handles automatic timestamp management.
 */
export function HasTimestamps<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        async save(): Promise<boolean> {
            this.updateTimestamps();
            return super.save();
        }

        updateTimestamps() {
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
