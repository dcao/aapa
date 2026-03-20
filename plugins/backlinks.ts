// deno-lint-ignore-file no-explicit-any
export interface Options {
    /** Site location */
    location: URL;

    /** Key to save the backlinks in the page data */
    key: string;
}

export const defaults: Options = {
    location: new URL("http://localhost:3000"),
    key: "wikilinks",
};

function backlinks(
    md: any,
    userOptions: Partial<Options> = {},
) {
    const options = Object.assign({}, defaults, userOptions) as Options;

    function getBacklinks(tokens: any[], links: Set<string>, pageURL: URL) {
        for (const token of tokens) {
            if (token.type !== "link_open") {
                if (token.children) {
                    getBacklinks(token.children, links, pageURL);
                }
                continue;
            }

            const wikilink = token.attrGet("data-wikilink");

            // If so...
            if (wikilink) {
                let href = pageURL.href;
                if (href.endsWith("/")) {
                    href = href.substring(0, href.length - 1);
                }
                const basename = href.substring(href.lastIndexOf('/') + 1);

                if (wikilink !== basename) {
                    links.add(wikilink);
                }
            }
        }
    }

    md.core.ruler.push("getBacklinks", function (state: any) {
        const data = state.env.data?.page?.data;

        if (!data) {
            return;
        }

        const link = new Set<string>(data[options.key] ?? []);
        const pageUrl = pathToUrl(data.url, options.location);

        getBacklinks(state.tokens, link, pageUrl);
        data[options.key] = Array.from(link);
    });
}

function pathToUrl(path: string, location: URL): URL {
    const url = new URL(path, location);

    return url;
}

export default function backlinksPlugin(
    userOptions: Partial<Omit<Options, "location">> = {},
) {
    return function (site: Lume.Site) {
        const options = {
            ...userOptions,
            location: site.options.location,
        };

        site.hooks.addMarkdownItPlugin(backlinks, options);
    };
}