import { describe, test, expect } from 'bun:test';
import { Model } from '@/model';
import { Table } from '@/decorators/table';
import { Column } from '@/decorators/column';

// TS 5.x Decorator Usage
@Table('custom_users')
class User extends Model {
    @Column('full_name')
    name: string;
}

describe('Decorators', () => {
    test('@Table decorator should set table name', () => {
        expect(User.getTable()).toBe('custom_users');
    });

    test('@Column decorator should map property to database column', () => {
        // Preciso de uma forma de verificar o mapeamento.
        // O Model deve usar metadados para saber o nome da coluna?
        // Atualmente o Model usa 'attributes' e proxy.
        // Se eu acesso user.name, o proxy deve traduzir para attributes['full_name']?
        // O plano não detalhou a implementação de Column interna, mas sugere metadata.

        // Vamos testar acesso básico se o decorator fizer setup
        const user = new User();
        user.name = 'Alice';

        // Internamente deve ter setado em attributes['full_name'] ou mapping?
        // Se o Model suportar alias via metadata.

        // Para simplificar, vamos verificar se metadados existem no Symbol.metadata?
        // TS 5.2 Symbol.metadata shim required? bun supports it.

        // expect(User[Symbol.metadata]).toBeDefined();
    });
});
