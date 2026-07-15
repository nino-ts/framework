/**
 * Layout composition helpers.
 *
 * @packageDocumentation
 */
import type { LayoutComponent, ViewComponent } from "./types";
/**
 * Compose a page view inside a layout component.
 *
 * @param Layout - Layout component receiving `children` plus optional layout props
 * @param Page - Page component rendered into the layout slot
 * @param layoutProps - Static props passed to the layout (excluding `children`)
 */
export declare function withLayout<P extends Record<string, unknown>, L extends Record<string, unknown> = Record<string, unknown>>(Layout: LayoutComponent<L>, Page: ViewComponent<P>, layoutProps?: L): ViewComponent<P>;
