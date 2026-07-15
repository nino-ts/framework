/**
 * Layout composition helpers.
 *
 * @packageDocumentation
 */

import { isSafeHtml, toHtmlString } from "./safe-html";
import type { LayoutComponent, ViewComponent } from "./types";

/**
 * Compose a page view inside a layout component.
 *
 * @param Layout - Layout component receiving `children` plus optional layout props
 * @param Page - Page component rendered into the layout slot
 * @param layoutProps - Static props passed to the layout (excluding `children`)
 */
export function withLayout<
    P extends Record<string, unknown>,
    L extends Record<string, unknown> = Record<string, unknown>,
>(
    Layout: LayoutComponent<L>,
    Page: ViewComponent<P>,
    layoutProps?: L,
): ViewComponent<P> {
    return (pageProps: P) => {
        const content = Page(pageProps);
        const resolvedContent = toHtmlString(content);
        const mergedLayoutProps = { ...layoutProps, ...pageProps } as unknown as L & {
            children: string;
        };

        if (typeof content === "string" || isSafeHtml(content)) {
            return Layout({ ...mergedLayoutProps, children: resolvedContent });
        }

        return Promise.resolve(content).then((html) =>
            Layout({ ...mergedLayoutProps, children: toHtmlString(html) }),
        );
    };
}
