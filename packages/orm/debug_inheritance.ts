import { Model } from './src/Model.ts';
import { DatabaseManager } from './src/DatabaseManager.ts';

/**
 * Debug script to isolate static inheritance issue in Model
 */

class TestModel extends Model {
    protected static override table = 'test_table';
}

class RelatedModel extends Model {
    protected static override table = 'related_table';
}

async function run() {
    const db = new DatabaseManager();
    db.addConnection('default', { driver: 'sqlite', url: ':memory:' });
    db.setDefaultConnection('default');
    Model.setConnectionResolver(db);

    console.log('--- Static Inheritance Test ---');

    // Test 1: Static getTable on subclass
    console.log('TestModel.getTable():', TestModel.getTable());
    console.log('RelatedModel.getTable():', RelatedModel.getTable());

    // Test 2: Instance getTable
    const instance = new TestModel();
    console.log('instance.getTable():', instance.getTable());
    console.log('instance.constructor:', instance.constructor);
    console.log('instance.constructor.name:', instance.constructor.name);

    // Test 3: Check this.constructor type
    const related = new RelatedModel();
    console.log('related.getTable():', related.getTable());

    // Test 4: newQuery on instance
    console.log('Creating query...');
    try {
        const query = instance.newQuery();
        console.log('Query fromTable:', query.fromTable);
        console.log('SUCCESS: newQuery works');
    } catch (e) {
        console.log('FAILED: newQuery error:', e);
    }

    // Test 5: hasMany creates related instance
    console.log('\n--- HasMany Test ---');
    try {
        const hasMany = instance.hasMany(RelatedModel, 'test_id', 'id');
        console.log('HasMany created successfully');
        console.log('HasMany query fromTable:', hasMany.getQuery().fromTable);
    } catch (e) {
        console.log('FAILED: hasMany error:', e);
    }

    await db.closeALl();
}

run().catch(console.error);
