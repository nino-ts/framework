import { type StubTemplateName } from "./stub-templates";
export type StubWriteResult = "created" | "overwritten";
export declare class StubExistsError extends Error {
    constructor(targetPath: string);
}
export declare function writeGeneratedFile(options: {
    readonly targetPath: string;
    readonly content: string;
    readonly force: boolean;
}): Promise<StubWriteResult>;
export declare function writeStubFromTemplate(options: {
    readonly template: StubTemplateName;
    readonly targetPath: string;
    readonly replacements: Record<string, string>;
    readonly force: boolean;
}): Promise<StubWriteResult>;
