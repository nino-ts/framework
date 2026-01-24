#!/usr/bin/env bun
/**
 * Script para executar testes com bancos de dados Docker.
 * Sobe os containers, aguarda healthcheck, roda testes e derruba tudo.
 * 
 * Uso: bun run scripts/test-with-db.ts [-- args para bun test]
 */

import { $ } from 'bun';

const COMPOSE_FILE = 'docker-compose.yml';

async function main() {
    const testArgs = process.argv.slice(2);

    console.log('🐳 Subindo containers de teste...');

    try {
        // Sobe containers em background
        await $`docker compose -f ${COMPOSE_FILE} up -d --wait`.quiet();

        console.log('✅ Containers prontos!');
        console.log('🧪 Executando testes...\n');

        // Executa testes (passa args extras se houver)
        const testProcess = Bun.spawn(['bun', 'test', ...testArgs], {
            stdio: ['inherit', 'inherit', 'inherit'],
            cwd: process.cwd(),
            env: {
                ...process.env,
                // Variáveis de ambiente para os testes
                POSTGRES_URL: 'postgres://ninots:ninots@localhost:5432/ninots_test',
                MYSQL_URL: 'mysql://ninots:ninots@localhost:3306/ninots_test',
            },
        });

        const exitCode = await testProcess.exited;

        console.log('\n🧹 Limpando containers...');
        await $`docker compose -f ${COMPOSE_FILE} down -v --remove-orphans`.quiet();

        console.log('✅ Containers removidos!');
        process.exit(exitCode);

    } catch (error) {
        console.error('❌ Erro:', error);

        // Garante limpeza mesmo em caso de erro
        console.log('🧹 Limpando containers...');
        await $`docker compose -f ${COMPOSE_FILE} down -v --remove-orphans`.quiet();

        process.exit(1);
    }
}

main();
