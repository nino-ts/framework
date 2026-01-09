import { QueryBuilder } from './src/QueryBuilder.ts';
import { Grammar } from './src/Grammar.ts';

const mockConn = {
    query: async () => [],
    run: async (sql, bindings) => {
        console.log('RUN SQL:', sql);
        console.log('BINDINGS:', bindings);
        return {};
    }
};

async function run() {
    try {
        const qb = new QueryBuilder(mockConn);
        console.log('--- SELECT ---');
        qb.from('users').select('id');
        console.log('SQL:', qb.toSql());

        console.log('--- INSERT ---');
        const qb2 = new QueryBuilder(mockConn);
        await qb2.from('users').insert({ name: 'John', email: 'john@test.com' });

    } catch (e) {
        console.error('Error:', e);
    }
}

run();
