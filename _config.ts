import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import date from "lume/plugins/date.ts";
import wikilinks from "markdown-plugins/wikilinks.ts";
import backlinks from "./plugins/backlinks.ts";
import esbuild from "lume/plugins/esbuild.ts";
import createSlugifier from "lume/core/slugifier.ts";

const site = lume({
    src: "."
});

const slug = createSlugifier();

site.use(esbuild());
site.use(tailwindcss());
site.use(date());
site.use(wikilinks({ slugify: slug }));

console.log("WARNING: backlinks detection doesn't work for files with spaces!")
site.use(backlinks());

// Search and replace the wikilinks with the final URLs
site.process([".html"], (pages) => {
    for (const page of pages) {
        console.log(page.data.wikilinks)
        // Search all wikilinks in the page
        for (const link of page.document!.querySelectorAll("a[data-wikilink]")) {
            // Get the link id and remove the attribute
            const id = link.getAttribute("data-wikilink");
            link.removeAttribute("data-wikilink");

            // Search a page with this id
            const found = pages.find((p) => slug(p.data.basename) === id);

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

site.add("public/", ".")
site.add("js/")

export default site;
