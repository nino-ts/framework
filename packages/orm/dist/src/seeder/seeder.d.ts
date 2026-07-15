/**
 * Base database seeder — mirrors Laravel's Illuminate\Database\Seeder.
 */
export declare abstract class Seeder {
    private static calledSeeders;
    /**
     * Run the database seeds.
     */
    abstract run(): Promise<void> | void;
    /**
     * Run another seeder class.
     */
    call(seeder: new () => Seeder): Promise<void>;
    /**
     * Run another seeder class without console output (parity hook).
     */
    callSilent(seeder: new () => Seeder): Promise<void>;
    /**
     * Run a seeder only once per process.
     */
    callOnce(seeder: new () => Seeder): Promise<void>;
    /**
     * Reset called seeder tracking (for tests).
     */
    static resetCalled(): void;
}
