import type { Seeder } from "./seeder";
/**
 * Execute a root database seeder class.
 */
export declare class SeederRunner {
    private readonly seederClass;
    constructor(seederClass: new () => Seeder);
    run(): Promise<void>;
}
