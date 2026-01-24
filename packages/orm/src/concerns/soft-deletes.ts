import { Model } from '@/model';
import { QueryBuilder } from '@/query-builder';

type Constructor<T = Model> = new (...args: any[]) => T;

/**
 * SoftDeletes mixin handles soft deletion of models.
 */
export function SoftDeletes<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        // override delete
        async delete(): Promise<boolean> {
            this.setAttribute('deleted_at', new Date().toISOString());
            return this.save();
        }

        // override newQuery to apply scope
        newQuery(): QueryBuilder {
            const builder = super.newQuery();
            builder.whereNull('deleted_at');
            return builder;
        }

        // Static methods in mixins usually require explicit type intersection on usage
        // But for "Post.withTrashed()" to work, it has to be on the class.
        // We can add it as instance method on the builder via scope?
        // Or static method here:

        static withTrashed(): QueryBuilder {
            const instance = new this();
            // Call super.newQuery() directly?
            // "super" in static context refers to parent class constructor.
            // We want base implementation of newQuery without the global scope.
            // But newQuery is instance method.

            // Workaround: create instance, get base builder?
            // Or just verify if builder has the scope and remove it? (QueryBuilder removeWhere?)
            // Or pass a flag to newQuery(excludeDeleted = true)?

            // Simplest: 
            // We can't easily call "super.newQuery" from static context.
            // We can allow "newQuery(true)" to skip scopes if we change Model signature.
            // Or just simpler: "withTrashed" returns a builder that doesn't have the where.

            // Check QueryBuilder implementation:
            // It stores wheres.
            // We can create new query and NOT add whereNull.

            // But "newQuery" is called by Model.query().

            return (new this()).newQueryWithoutScopes();
        }

        newQueryWithoutScopes(): QueryBuilder {
            // Call Model's newQuery which is "super.newQuery" BEFORE our override?
            // "super.newQuery()" calls the PARENT's newQuery.
            // Our override calls super.newQuery() AND adds whereNull.
            // So calling "super.newQuery()" gives us the clean builder!
            return super.newQuery();
        }
    };
}
