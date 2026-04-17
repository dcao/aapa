import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import date from "lume/plugins/date.ts";
import wikilinks from "./plugins/wikilinks.ts";
import backlinks from "./plugins/backlinks.ts";
import esbuild from "lume/plugins/esbuild.ts";

const markdown = {
    options: {
        linkify: true,
        typographer: true,
    },
};


const site = lume({
    src: "."
}, { markdown });

// const slug = createSlugifier();
const slug = (s: string) => s.toLowerCase();

site.use(esbuild());
site.use(tailwindcss());
site.use(date());

site.use(wikilinks({ slugify: slug }));

console.log("WARNING: backlinks detection doesn't work for files with spaces, and doesn't handle regular href links!")
console.log("WARNING: getting aliases to work with backlinks detection")
site.use(backlinks());

// For each markdown file, let's auto-link pages and their aliases where possible.
site.preprocess([".md"], (pages) => {
    const s: Set<string> = new Set();

    for (const page of pages) {
        s.add(page.data.basename);
        if (page.data.aliases) {
            for (const a of page.data.aliases) {
                s.add(a);
            }
        }
    }

    // TODO: Can replace this with Aho-Corasick or similar to be way faster
    let r = `(?<!\\[\\[)\(${s.values().toArray().join("|")}\)`;
    let regex = new RegExp(r, "g");

    // // console.log(pages);
    for (const page of pages) {
        if (typeof page.data.content === "string") {
            page.data.content = page.data.content?.replaceAll(regex, "[[$1]]");
        }
    }
})

site.process([".html"], (pages) => {
    for (const page of pages) {
        // console.log(page.data.wikilinks)
        // Search all wikilinks in the page
        for (const link of page.document!.querySelectorAll("a[data-wikilink]")) {
            // Get the link id and remove the attribute
            const id = link.getAttribute("data-wikilink");
            // link.removeAttribute("data-wikilink");

            // Search a page with this id
            const found = pages.find((p) => {
                // console.log(p.data.basename, id)
                return slug(p.data.basename) === id || (p.data.aliases && p.data.aliases.includes(id));
            });

            if (found) {
                link.setAttribute("href", found.data.url);
                link.setAttribute("class", "wikilink valid")
            } else {
                link.setAttribute("title", "This page does not exist");
                link.setAttribute("class", "wikilink invalid")
            }
        }
    }
});

site.add("img/")
site.add("css/")
site.add("js/")
site.add("pages/")

export default site;
