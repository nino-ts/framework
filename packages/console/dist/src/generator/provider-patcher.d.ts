export declare const PROVIDER_IMPORT_MARKER = "// -- nino:provider-imports --";
export declare const PROVIDER_LIST_MARKER = "// -- nino:providers --";
/**
 * Append a module service provider import + registration to bootstrap/providers.ts.
 */
export declare function appendProviderRegistration(providersFile: string, importLine: string, providerClassName: string): Promise<void>;
