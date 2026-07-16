export {
    applyStubReplacements,
    migrationTimestamp,
    normalizeControllerName,
    normalizeMigrationName,
    normalizeModelName,
    normalizeViewName,
    type ControllerNames,
    type MigrationNames,
    type ModelNames,
    type ViewNames,
} from "./naming";
export { PathResolver, type GeneratorPathsConfig } from "./path-resolver";
export { appendApiRoutes, appendWebRoutes } from "./route-patcher";
export { getStubTemplate, STUB_TEMPLATES, type StubTemplateName } from "./stub-templates";
export {
    StubExistsError,
    writeGeneratedFile,
    writeStubFromTemplate,
    type StubWriteResult,
} from "./stub-writer";
