import { Model } from './src/Model.ts';
import { Table } from './src/Decorators/Table.ts';
import { Column } from './src/Decorators/Column.ts';

function run() {
    try {
        console.log('Defining class...');

        @Table('custom_users')
        class User extends Model {
            @Column('full_name')
            name: string;
        }

        console.log('Class defined.');
        console.log('Table:', User.getTable());

        const u = new User();
        u.name = 'Alice';
        console.log('Attribute set.');
        console.log('Attributes:', (u as any).attributes);
        console.log('Name prop:', u.name);

        if (User.getTable() === 'custom_users' && (u as any).attributes['full_name'] === 'Alice') {
            console.log('SUCCESS');
        } else {
            console.log('FAILURE');
        }

    } catch (e) {
        console.error('ERROR:', e);
    }
}

run();
