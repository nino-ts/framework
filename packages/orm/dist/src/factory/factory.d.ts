import type { Model } from "../model";
import type { ModelConstructor } from "../types";
/**
 * State callback applied during factory attribute resolution.
 */
export type FactoryStateCallback<TAttributes extends object> = (attributes: TAttributes) => Partial<TAttributes>;
/**
 * Queued child factory for `has()` relationships.
 */
interface ChildFactorySpec {
    readonly factory: Factory<Model>;
    readonly foreignKey: string;
    readonly localKey: string;
    readonly count: number;
}
type FactoryCount = number | null;
/**
 * Infer create/make result from factory count.
 */
export type FactoryResult<TModel extends Model, TCount extends FactoryCount> = TCount extends number ? TCount extends 1 ? TModel : TModel[] : TModel;
/**
 * Eloquent-style model factory with typed attributes and fluent API.
 */
export declare abstract class Factory<TModel extends Model = Model, TAttributes extends object = Record<string, unknown>, TCount extends FactoryCount = null> {
    protected countValue: TCount;
    protected states: FactoryStateCallback<TAttributes>[];
    protected children: ChildFactorySpec[];
    /**
     * Default attribute definition for the model.
     */
    abstract definition(): TAttributes;
    /**
     * Model class produced by this factory.
     */
    abstract model(): ModelConstructor<TModel>;
    /**
     * Create a new factory instance.
     */
    static new<T extends Factory>(this: new () => T): T;
    protected clone(): this;
    /**
     * Set how many models should be created.
     */
    count<TAmount extends number>(this: Factory<TModel, TAttributes, TCount>, amount: TAmount): Factory<TModel, TAttributes, TAmount>;
    /**
     * Apply state overrides to the generated attributes.
     */
    state(state: Partial<TAttributes> | FactoryStateCallback<TAttributes>): Factory<TModel, TAttributes, TCount>;
    /**
     * Create related models after the parent is persisted.
     */
    has<TChild extends Model>(factory: Factory<TChild>, foreignKey?: string, localKey?: string): Factory<TModel, TAttributes, TCount>;
    /**
     * Build model instances without persisting.
     */
    make(overrides?: Partial<TAttributes>): Promise<FactoryResult<TModel, TCount>>;
    /**
     * Persist model instance(s) to the database.
     */
    create(overrides?: Partial<TAttributes>): Promise<FactoryResult<TModel, TCount>>;
    protected resolveAttributes(overrides: Partial<TAttributes>): Partial<TAttributes>;
    protected createChildren(parent: TModel): Promise<void>;
}
/**
 * Register `Model.factory()` pointing at a factory class.
 */
export declare function configureModelFactory<TModel extends Model, TFactory extends {
    count(amount: number): unknown;
}>(model: ModelConstructor<TModel>, factoryClass: new () => TFactory): void;
export {};
