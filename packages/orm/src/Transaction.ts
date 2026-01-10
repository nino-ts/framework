import { Connection } from './Connection';

/**
 * Transaction class implementing Disposable for use with 'using' statement.
 * 
 * @example
 * // With 'using' (auto-rollback if not committed)
 * {
 *   using tx = await Transaction.begin(conn);
 *   await doSomeWork();
 *   await tx.commit();
 * }
 * 
 * // Manual control
 * const tx = await Transaction.begin(conn);
 * try {
 *   await doSomeWork();
 *   await tx.commit();
 * } catch (error) {
 *   await tx.rollback();
 * }
 */
export class Transaction implements Disposable {
    private committed = false;
    private rolledBack = false;

    private constructor(private connection: Connection) { }

    /**
     * Begin a new transaction
     */
    static async begin(connection: Connection): Promise<Transaction> {
        await connection.run('BEGIN TRANSACTION');
        return new Transaction(connection);
    }

    /**
     * Commit the transaction
     */
    async commit(): Promise<void> {
        if (this.committed || this.rolledBack) {
            return;
        }
        await this.connection.run('COMMIT');
        this.committed = true;
    }

    /**
     * Rollback the transaction
     */
    async rollback(): Promise<void> {
        if (this.committed || this.rolledBack) {
            return;
        }
        await this.connection.run('ROLLBACK');
        this.rolledBack = true;
    }

    /**
     * Disposable implementation - auto-rollback if not committed
     */
    [Symbol.dispose](): void {
        if (!this.committed && !this.rolledBack) {
            // Sync rollback for disposal (best effort)
            // Note: In real scenarios, you'd want async disposal (Symbol.asyncDispose)
            this.connection.run('ROLLBACK').catch(() => { });
            this.rolledBack = true;
        }
    }

    /**
     * Check if transaction is active
     */
    get isActive(): boolean {
        return !this.committed && !this.rolledBack;
    }
}
